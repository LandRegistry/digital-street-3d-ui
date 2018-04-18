# flask-skeleton-ui

This repository contains a flask application structured in the way that all Land Registry flask user interfaces should be structured going forwards.

## Usage

You can use this to create your own app.
Take a copy of all the files, and change all occurences of `flask-skeleton-ui` and `flask_skeleton_ui` to your app name - including folders! There will be other places to tweak too such as the exposed port in docker-compose-fragment, so please look through every file before starting to extend it for your own use. There is a [more comprehensive guide](http://192.168.250.79/index.php/Diary_-_Creating_a_New_Application) available on TechDocs.

## Quick start

### Docker

This app supports the [universal dev-env](http://gitlab.service.dev.ctp.local/common/dev-env) so adding the following to your dev-env config file is enough:

```YAML
  flask-skeleton-ui:
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

### Building frontend assets (CSS, JS etc)

See [flask_skeleton_ui/assets](flask_skeleton_ui/assets) for more details.

At a high level this includes:
- Sass - because writing raw CSS is painful.
- Webpack - for bundling JavaScript modules. To help us write modular, maintainable code and avoid "JavaScript spaghetti".
- Babel - to let us use modern syntax which makes JavaScript nicer to write and in some cases reduce code complexity.

### GOV.UK template

The GOV.UK template is pulled in automatically from the npm package that gets installed. This happens on every build, so while the file is committed into the repository, you should not modify it manually yourself.

If you need to customise the file, make a copy of it and change your other templates to extend your copy instead of the original. When the GOV.UK kit gets updated, you then have a reference to use when bringing the updates in.

### Removing the GOV.UK frontend code

If you want to remove the GOV.UK frontend code in order to do something else such as Bootstrap or just custom stuff, you will need to make the following changes:

- Remove the reference to `land-registry-elements` from the `sassIncludePaths` array in `Gulpfile.js`
- Remove references to GOV.UK from `flask_skeleton_ui/.gitignore`
- Remove `govuk_elements_jinja_macros` and `land_registry_elements` from the template `PrefixLoader` in `flask_skeleton_ui/app.py`
- Remove any references to GOV.UK from your app's SCSS and JS files
- Change `flask_skeleton_ui/custom_extensions/jinja_markdown_filter/main.py` to use `misaka.HtmlRenderer` instead of the custom `GovRenderer` and update the unit tests to suit.
- Remove the references to GOV.UK from `flask_skeleton_ui/templates/layout.html` and implement your own base layout template.
- Remove `govuk-elements-sass`, `govuk_frontend_toolkit`, `govuk_template_jinja` and `land-registry-elements` from `package.json` and regenerate your `package-lock.json`
- Remove `govuk-elements-jinja-macros` and `land-registry-elements` dependencies from `pipcompilewrapper.sh`
- Tweak the Content-Security-Policy to suit your new needs

### Using the GOV.UK toolkit on a non service.gov.uk domain

The GOV.UK toolkit can be used freely to build anything you like, however there are restrictions on the use of the Crown and the Transport font which can only be used on the following URLs:

- gov.uk/myservice
- myservice.service.gov.uk
- myblog.blog.gov.uk

_(Taken from https://www.gov.uk/service-manual/design/making-your-service-look-like-govuk)_

In order to use the toolkit elsewhere you therefore need to stop using these. This can be done as follows:

- Make your own copy of govuk_template.html (Don't edit the one that's already there - this one will be overwritten when updating the GOV kit)
- Find code that looks like the following blocks and delete them:

  ```
  <!--[if IE 8]><link rel="stylesheet" media="all" href="{{ asset_path }}stylesheets/fonts-ie8.css?0.23.0"/><![endif]-->
  <!--[if gte IE 9]><!--><link rel="stylesheet" media="all" href="{{ asset_path }}stylesheets/fonts.css?0.23.0"/><!--<![endif]-->
  ```

  ```
  <link rel="mask-icon" href="{{ asset_path }}images/gov.uk_logotype_crown.svg?0.23.0" color="#0b0c0c">
  <link rel="apple-touch-icon" sizes="180x180" href="{{ asset_path }}images/apple-touch-icon-180x180.png?0.23.0">
  <link rel="apple-touch-icon" sizes="167x167" href="{{ asset_path }}images/apple-touch-icon-167x167.png?0.23.0">
  <link rel="apple-touch-icon" sizes="152x152" href="{{ asset_path }}images/apple-touch-icon-152x152.png?0.23.0">
  <link rel="apple-touch-icon" href="{{ asset_path }}images/apple-touch-icon.png?0.23.0">
  ```

  ```
  <meta property="og:image" content="{{ asset_path }}images/opengraph-image.png?0.23.0">
  ```

  
- Create a new favicon for your app in `flask_skeleton_ui/assets/src/images` and re-point the shortcut icon to point to it as follows:

  ```
  <link rel="shortcut icon" href="{{ url_for('static', filename='images/app/favicon.ico') }}" type="image/x-icon" />
  ```

- Modify the `<div class="header-logo">` to be a Land Registry logo or whatever is appropriate.
- Add the following code to the top of your `main.scss` file, above the `govuk-elements` import:

  ```
  $toolkit-font-stack: 'HelveticaNeue', 'Helvetica Neue', 'Arial', 'Helvetica', sans-serif;
  $toolkit-font-stack-tabular: 'HelveticaNeue', 'Helvetica Neue', 'Arial', 'Helvetica', sans-serif;
  ```
- Rebuild your CSS by running `npm run build`

### Support for Flask `flash()` messages

Messages registered with the Flask `flash()` method will appear at the top of the page in a styled box.
`flash('Something something', 'error')` will raise a message using the error style, whereas `flash('Message')` will produce a more neutral looking "information" style message.

### Flask-WTForms

[Flask-WTForms](https://flask-wtf.readthedocs.io/en/stable/) is included and should be used for all forms.

#### Jinja macros

The skeleton includes a set of Jinja macros to assist in writing GOV.UK compliant forms (See https://github.com/LandRegistry/govuk-elements-jinja-macros). These can be imported as follows:

```
{% from 'govuk_elements_jinja_macros/form.html' import element, single_choice, multiple_choice, error_summary %}
```

#### CSRF protection

Forms are protected with the CSRF protection built in to Flask-WTF. This is customised to handle the CSRFError exception that gets thrown and show users a message when it occurs. It is worth considering however whether you should warn users of this upfront, before they start filling out a form. Otherwise there is a risk their session will time out after an hour and their form submission will be thrown away, forcing them to do it again.

If you need to exempt a view from CSRF, you need to import the csrf instance from the csrf extension as follows:

```
from flask_skeleton_ui.custom_extensions.csrf.main import csrf

@csrf.exempt
@my_blueprint.route("/")
def index_page():
    ...
```

### Land-registry-elements

[land-registry-elements](https://github.com/LandRegistry/land-registry-elements) is bundled into the skeleton, providing CSS & JS as well as Jinja macros for some of the components. These can be used like this:

```
{% from 'land_registry_elements/address/template.html' import address_simple %}

{{ address_simple(['48 Foo bar', 'Wibble', 'PL1 1LP']) }}
```

CSS can be imported from individual components like this:

```css
@import 'land_registry_elements/media/style';
```

And JS like this:

```js
import 'land-registry-elements/src/land_registry_elements/clientside-form-validation/controller'
```


### ApplicationError templates
The ApplicationError class contains a code parameter when raising exceptions, such as:

```
raise ApplicationError('Friendly message here', 'E102', 400)
```

If this exception goes uncaught in your code, it will bubble up to the application  error handler. At this point, it will try to find a template named `E102.html` in the `flask-skeleton-ui/templates/errors/application` folder to allow you to write custom error pages on a per error code basis.

If it cannot find this template, it will fall back to `application.html` and show a generic message.

Do not feel you have to make custom templates for every error code. This is an _optional feature_, not a requirement.

### Markdown

`flask_skeleton_ui/custom_extensions/jinja_markdown_filter` exposes a jinja template filter which can be used to render markdown to GOV.UK compatible html. It's well suited to things like Terms and conditions pages which could be written in markdown and rendered to HTML on the fly.

```
  {{ my_variable_containing_some_markdown_content|markdown }}
```

or

```
{% filter markdown %}
  # This is markdown

  - Hello
  - World
{% endfilter %}
```

### Content Security Policy

The Content-Security-Policy (CSP) HTTP response header helps you reduce Cross Site Scripting (XSS) risks on modern browsers by declaring what dynamic resources are allowed to load via a HTTP Header. This has been configured with some sensible defaults that will work out the box for a GOV.UK frontend.

#### Modes

There are two modes available. `full` and `report-only`. These are configured via the `CONTENT_SECURITY_POLICY_MODE` environment variable. It is recommended that you initially use `report-only` which will test but not enforce the rules and monitor the logs for violations. If none are found after a bedding in period, it should be switched to `full` at which point the security protections will begin to be enforced.

#### Gotcha #1: How to write inline scripts

One of the main features of CSP is that it blocks inline script tags. This is a robust protection against XSS but it does sometimes get in the way of simple Google Analytics implementations and other uses of inline scripts. The best answer to this is _not to write inline scripts_. If you do everything in actual .js files you will not fall foul of the CSP.

The difficulty this may present is that sometimes it is necessary to pass data from the backend through to the frontend. This is commonly done by writing values from the Python app directly into JavaScript variables. Unfortunately this is exactly the thing that CSP is trying to prevent, since these values will often be user generated either directly or indirectly. A specially crafted value might "break out" of the variable declaration and inject malicious JS into the page (In a very similar manner to SQL injection).

There are a few options which can be used to work around this:

##### `data-` attributes

Simple bits of data could be included as follows:

```html
<div data-lat="50" data-lng="-4" id="my-map"></div>
```

This can then be accessed in jQuery:

```js
var $map = $('#my-map')
var lat = $map.data('lat')
var lat = $map.data('lng')
```

This is only really suitable for fairly simple pieces of data and it requires you to place it on a related HTML element. Data should not be arbitrarily placed on unrelated HTML elements purely for the sake of passing it around. In the above example, lat and lng are used to center the map once it is initialised, hence the data is related to the component on which it is stored.

##### JSON in script tags

For data beyond just simple strings, or data that isn't obviously associated with a component, you can stick JSON in script tags as follows:

```
<script type="application/json" id="my-data">
  {
    "center": {
      "lat": "50",
      "lng": "-4"
    },
    "polygon": [1, 2, 3, 4, 5, 6, 7, 8, 9 ...]
  }
</script>
```

This can then be loaded into your JavaScript files like this:

```js
var configElement = document.getElementById('my-data')
rules = JSON.parse(configElement.innerHTML)
```

##### Hidden form fields

Data can also be rendered into hidden form fields:

```html
<input type="hidden" name="lat" value="50" id="lat">
<input type="hidden" name="lng" value="-4" id="lng">
```

And then accessed like:

```js
var lat = document.getElementById('lat').value
var lng = document.getElementById('lng').value
```

#### Gotcha #2: Referencing scripts via CDN

Another feature of CSPs is that they block external JavaScript and CSS loading from domains that are not in the approved list. If you need to add a new external stylesheet, you will need to add the domain to the `script-src` or `style-src` declarations in the CSP in flask_skeleton_ui/custom_extensions/content_security_policy/main.py.

When doing this however **it is vital that you include a Sub Resource Integrity (SRI) hash on the script tag**. See https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity for details on how to do this. This is essential in order to mitigate against the possibility of malicious code being injected if the CDN were compromised, or someone managed to achieve a man in the middle attack. When SRI is used, the browser will not run the script if the contents do not match the hash.

Future iterations of the CSP will strictly enforce SRI, but this is not currently in place due to poor browser support.

#### Useful further reading

https://content-security-policy.com/
https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
https://www.owasp.org/index.php/Content_Security_Policy_Cheat_Sheet


### ADFS authentication
If you are looking to use ADFS for authenticating users, see this section on techdocs:

[OAuth2 for Internal Users via ADFS - Implementation Guide](http://techdocs.dev.ctp.local/index.php/OAuth2_for_Internal_Users_via_ADFS_-_Implementation_Guide)
