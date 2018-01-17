# flask-skeleton-ui

This repository contains a flask application structured in the way that all Land Registry flask user interfaces should be structured going forwards.

## Usage

You can use this to create your own app.
Take a copy of all the files, and change all occurences of `flask-skeleton-ui` and `flask_skeleton_ui` to your app name - including folders! There will be other places to tweak too such as the exposed port in docker-compose-fragment, so please look through every file before starting to extend it for your own use. There is a [more comprehensive guide](http://192.168.250.79/index.php/Diary_-_Creating_a_New_Application) available on TechDocs.

## Building frontend assets (CSS, JS etc)

See [flask_skeleton_ui/assets](flask_skeleton_ui/assets)

## Quick start

### Docker

This app supports the [universal dev-env](http://gitlab.service.dev.ctp.local/common/dev-env) so adding the following to your dev-env config file is enough:

```YAML
  flask-skeleton-api:
    repo: git@gitlab.service.dev.ctp.local:skeletons/flask-skeleton-ui.git
    branch: master
```

The Docker image it creates (and runs) will install all necessary requirements and set all environment variables for you.

### Standalone

#### Environment variables to set

* PYTHONUNBUFFERED *(suggested value: yes)*
* PORT
* LOG_LEVEL
* COMMIT
* APP_NAME

##### When not using gunicorn

* FLASK_APP *(suggested value: flask_skeleton_ui/main.py)*
* FLASK_DEBUG *(suggested value: 1)*

#### Running (when not using gunicorn)

(The third party libraries are defined in requirements.txt and can be installed using pip)

```shell
python3 -m flask run
or
flask run
or
make run
```

## Testing

### Unit tests

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

You can run these commands in the app's running container via `docker-compose exec flask-skeleton-ui <command>` or `exec flask-skeleton-ui <command>`. There is also an alias: `unit-test flask-skeleton-ui` and `unit-test flask-skeleton-ui -r` will run tests and generate reports respectively.

### Integration tests

The integration tests are contained in the integration_tests folder. [Pytest](http://docs.pytest.org/en/latest/) is used for integration testing. To run the tests and output a junit xml use the following command:

```shell
make integrationtest
(or py.test integration_tests)
```

This file gets added to the test-output folder. The test-output folder is created if doesn't exist.

To run the integration tests if you are using the common dev-env you can run `docker-compose exec flask-skeleton-ui make integrationtest` or, using the alias, `integration-test flask-skeleton-ui`.

## Application Framework implementation

Although you should inspect every file and understand how the app is put together, here is a high level list of how the [Application Framework](http://techdocs.dev.ctp.local/index.php/Application_Framework) standard structure and behaviours are implemented:

### Universal Development Environment support

Provided via `configuration.yml`, `Dockerfile` and `fragments/docker-compose-fragment.yml`.

`configuration.yml` lists the commodities the dev env needs to spin up e.g. postgres. The ELK stack is spun up when "logging" is present.

The `docker-compose-fragment.yml` contains the service definiton, including the external port to map to, sharing the app source folder so the files don't need to be baked into the image, and redirection of the stdout logs to logstash via syslog.

The `Dockerfile` simply sets the APP_NAME environment variable and installs the third party library requirements. Any further app-specific variables or commands can be added here.

### Logging in a consistent format (JSON) with consistent content

Flask-LogConfig is used as the logging implementation. It is registered in a custom extension called `enhanced_logging`. There is also a filter that adds the current trace id into each log record from g, and a formatter that puts the log message into a standard JSON format. The message can then be correctly interpreted by both the dev-env and webops ELK stacks. The configuration that tells Python logging to use those formatters and the filter is also set up in `enhanced_logging`.

### Consistent way to run the application

`main.py` imports from `app.py` in order to trigger the setup of the app and it's extensions. It also provides the app object to `manage.py`.

`manage.py` contains the app object which is what should be given to a WSGI container such as gunicorn. It is also where Alembic database migration code is to be placed.

All Flask extensions (enhanced logging, SQLAlchemy, socketIO etc) shoud be registered in `extensions.py`. First they are created empty, then introduced to the app in the `register_extensions()` method (which is then called by `main.py` during initialisation).

### A Makefile with specific commands to run unit tests and integrations tests

`Makefile` - This provides generic language-independent functions to run unit and integration tests  (useful for the build pipeline).

### Consistent Unit test and integration test file structure

Provided via `unit_test` and `integration_test` directories. These locations do not have an `__init__.py` so the tests cannot be accidentally imported into other areas of the app. This links in with the management script as it expects the tests to be in these locations. The file `setup.cfg` also contains the default test entry point and coverage settings.

### An X-API-Version HTTP header returned in all responses detailing the semantic version of the interface

Not applicable

### An X-Trace-ID HTTP header received/generated and then propagated

Provided by the `before_request()` method in `main.py` in the enhanced_logging custom extension. If a header of that name is passed in, it extracts it and places it into g for logging (see next section) and also creates a requests Session object with it preset as a header. This allows the same value to propagate throughout the lifetime of a request regardless of how many UIs/APIs it passes through - making debugging and tracing of log messages much easier.

Note that for the propagation to work, g.requests must be used for making calls to other APIs rather than just requests.

### Consistent error response structure (but not content)

In `exceptions.py` there is a custom exception class ApplicationError defined, which can be raised by applications that need to send back details of an error to the client. There is a handler method defined that converts it into a consistent response, with JSON fields and the requested http status code.

There is also a handler method for any other types of exception that manage to escape the route methods. These are always http code 500.

Both handlers are registered in the `register_exception_handlers()` method, which is called by main.py in a similar way to registering  blueprints.

### Consistent environment variable names

All config variables the app uses are created in `config.py`. It is a plain python module (not a dict or object) and no region-specific code. The mandatory variables are `FLASK_LOG_LEVEL` (read by Flask automatically), `COMMIT` and `APP_NAME` (both used in the health route).

This should be the only place environment variables are read from the underlying OS. It is effectively the gateway into the app for them.

### Consistent implementation of health and cascading health endpoints

Routes are logically segregated into separate files within `/views`. By default a `general.py` is provided that creates the health routes (see table above) that returns a standardised set of JSON fields. Note how the app name is retrieved using the APP_NAME config variable (which in turn comes from the environment).

Blueprints are registered in the `register_blueprints` method in `blueprints.py` (which is then called by `main.py` during initialisation).

### Concise and clear requirements management

The only (non-test related) requirements that should be changed by hand are those in `requirements.in`. They are the top -level requirements that are directly used by the application. When one of these is updated, the tool `pip-compile` should be used to generate a full requirements.txt that contains all sub-dependencies, pinned to whatever version is available at the time. Both files should be in source control. See [TechDocs](http://techdocs.dev.ctp.local/index.php/Requirements_management) for further explanation.


## Other useful documentation

### ADFS authentication
If you are looking to use ADFS for authenticating users, see this section on techdocs:

[OAuth2 for Internal Users via ADFS - Implementation Guide](http://techdocs.dev.ctp.local/index.php/OAuth2_for_Internal_Users_via_ADFS_-_Implementation_Guide)
