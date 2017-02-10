# flask-skeleton-ui

This repository contains a flask application structured in the way that all
Land Registry flask user interfaces should be structured going forwards.

You can use this to create your own app.
Take a copy of all the files, and change all occurences of `flask-skeleton-ui` and `flask_skeleton_ui` to your app name. There will be other places to tweak too such as the exposed port in docker-compose-fragment, so please look through every file before starting to extend it for your own use.

## Quick start (outside Docker)

```shell
# For Flask CLI
export FLASK_APP=flask_skeleton_ui/main.py
export FLASK_DEBUG=1
# For Python
export PYTHONUNBUFFERED=yes
# For gunicorn
export PORT=9998
# For app's config.py
export FLASK_LOG_LEVEL=DEBUG
export COMMIT=LOCAL

# Run the app
flask run
```

or run the shell command:

```bash
make run
```


## Migrating existing apps

Although you should inspect every file and understand how the app is put together, here is a high level list of the main features.

### Universal dev-env support (with ELK)

Provided via `configuration.yml`, `Dockerfile` and `fragments/docker-compose-fragment.yml`.

`configuration.yml` lists the commodities the dev env needs to spin up e.g. postgres. The ELK stack is spun up when "logging" is present.

The `docker-compose-fragment.yml` contains the service definiton, including the external port to map to, sharing the app source folder for hot reloading, and redirection of the stdout logs to logstash via syslog.

The `Dockerfile` simply sets the APP_NAME environment variable and installs the pip dependencies. Any app-specific variables or commands can be added here.

### Management scripts

1. `manage.py` - This gives us a generic WSGI entry point for gunicorn (as it imports the app) plus an extra function to run the server in a standalone state. It is also where Alembic database migration code is to be placed.
2. `Makefile` - This provides generic language-independent functions to run unit and integration tests  (useful for the build pipeline).

### Test structure

Provided via `unit_test` and `integration_test` directories. These locations do not have an `__init__.py` so the tests cannot be accidentally imported into other areas of the app. This links in with the management script as it expects the tests to be in these locations. The file `setup.cfg` also contains the default test entry point and coverage settings.

### Initialisation flow

All registration methods described in the following sections are called from `main.py` (which is also the file that provides the app object to `manage.py`).

`main.py` also imports from `app.py` in order to trigger the setup of the app and it's extensions.


### Building frontend assets (CSS, JS etc)

See [flask_skeleton_ui/assets](flask_skeleton_ui/assets)


### Blueprints / Health route

Routes are logically segregated into separate files within `/views`. By default a `general.py` is provided that creates a basic `/health` route that returns a standardised set of JSON fields. Note how the app name is retrieved using the APP_NAME config variable (which in turn comes from the environment).

Blueprints are registered in the `register_blueprints` method in `blueprints.py` (which is then called by `main.py` during initialisation).

### X-API-Version header response

Provided by the `after_request()` method in `app.py`. The exact version of the API interface spec is returned, in case clients need to know (the URL will only contain the major version as per the API manual).

### X-Trace-ID header propagation

Provided by the `before_request()` method in `app.py`. If a header of that name is passed in, it extracts it and places it into g for logging (see next section) and also creates a requests Session object with it preset as a header. This allows the same value to propagate throughout the lifetime of a request regardless of how many UIs/APIs it passes through - making debugging and tracing of log messages much easier.

Note that for the propagation to work, g.requests must be used for making calls to other APIs rather than just requests.

### Logging

Flask-LogConfig is used as the logging implementation. It is registered in `extensions.py`. There is also a filter that adds the current trace id into each log record from g, and two formatters, one for normal logs and one for audit, that puts the log message into a standard JSON format, than can then be correctly interpreted by both the dev-env and webops ELK stacks. The configuration that tells Python logging to use those formatters and the filter is in `config.py`.

### Exception / error handling

In `exceptions.py` there is a custom exception class ApplicationError defined, which can be raised by applications that need to send back details of an error to the client. There is a handler method defined that converts it into a consistent response, with JSON fields and the requested http status code.

There is also a handler method for any other types of exception that manage to escape the route methods. These are always http code 500.

Both handlers are registered in the `register_exception_handlers()` method, which is called by main.py in a similar way to registering  blueprints.

### Flask Extensions

As mentioned in previous sections, all Flask extensions (logging, SQLAlchemy, socketIO etc) are registered in `extensions.py`. First they are created empty, then introduced to the app in the `register_extensions()` method (which is then called by `main.py` during initialisation).

### Configuration

All config variables the app uses are created in `config.py`. It is a plain python module - no dict or objects, and no region-specific code. The mandatory variables are `FLASK_LOG_LEVEL` (read by FLask automatically), `COMMIT`, `APP_NAME` (both used in the health route) and `LOGCONFIG` (read by Flask-LogConfig automatically).

This should be the only place environment variables are read from the underlying OS. It is effectively the gateway into the app for them.

## Unit tests

The unit tests are contained in the unit_tests folder. [Pytest](http://docs.pytest.org/en/latest/) is used for unit testing. To run the tests use the following command:

```bash
make unittest
(or just py.test)
```

To run them and output a coverage report and a junit xml file run:

```bash
make report="true" unittest
```

These files get added to a test-output folder. The test-output folder is created if doesn't exist.

To run the unit tests if you are using the common dev-env use the following command:

```bash
docker-compose exec flask-skeleton-ui make unittest
or, using the alias
unit-test flask-skeleton-ui
```

or

```bash
docker-compose exec flask-skeleton-ui make report="true" unittest
or, using the alias
unit-test flask-skeleton-ui -r
```

## Integration tests

The integration tests are contained in the integration_tests folder. [Pytest](http://docs.pytest.org/en/latest/) is used for integration testing. To run the tests and output a junit xml use the following command:

```shell
make integrationtest
(or py.test integration_tests)
```

This file gets added to the test-output folder. The test-output folder is created if doesn't exist.

To run the integration tests if you are using the common dev-env use the following command:

```shell
docker-compose exec flask-skeleton-ui make integrationtest
```
