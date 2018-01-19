from unittest import mock
import logging
import json
from freezegun import freeze_time
from flask_skeleton_ui.main import app
from flask_skeleton_ui.custom_extensions.enhanced_logging.main import EnhancedLogging
from werkzeug import Headers

logger = logging.getLogger('flask-skeleton-ui')
client = app.test_client()


@freeze_time("2017-01-18")
def test_log_output_in_json_format(pytestconfig):
    capmanager = pytestconfig.pluginmanager.getplugin('capturemanager')
    with app.app_context():
        client.application.logger.info('Foo')
    out, err = capmanager.suspend_global_capture(in_=True)
    capmanager.resume_global_capture()

    try:
        record = json.loads(out)
    except Exception:
        print(out)
        print(err)

    assert record == {
        'timestamp': '2017-01-18 00:00:00,000',
        'traceid': 'N/A',
        'level': 'INFO',
        'message': 'Foo',
        'exception': None
    }


def test_unique_trace_id_when_servicing_an_http_request(pytestconfig):
    capmanager = pytestconfig.pluginmanager.getplugin('capturemanager')

    with app.test_request_context('/'):
        app.preprocess_request()
        client.application.logger.info('Foo')
        out, err = capmanager.suspend_global_capture(in_=True)
        capmanager.resume_global_capture()
        try:
            record = json.loads(out)
        except Exception:
            print(out)
            print(err)
        uuid_one = record['traceid']

    with app.test_request_context('/'):
        app.preprocess_request()
        client.application.logger.info('Foo')
        out, err = capmanager.suspend_global_capture(in_=True)
        capmanager.resume_global_capture()
        try:
            record = json.loads(out)
        except Exception:
            print(out)
            print(err)
        uuid_two = record['traceid']

    assert uuid_one != uuid_two


def test_trace_id_propagated_when_receiving_one_in_header(pytestconfig):
    capmanager = pytestconfig.pluginmanager.getplugin('capturemanager')

    with app.test_request_context('/', headers=Headers([('X-Trace-ID', 'upstream-trace-id')])):
        app.preprocess_request()
        client.application.logger.info('Foo')
        out, err = capmanager.suspend_global_capture(in_=True)
        capmanager.resume_global_capture()

    try:
        record = json.loads(out)
    except Exception:
        print(out)
        print(err)

    assert record['traceid'] == 'upstream-trace-id'


def test_exc_info_in_log_entries_when_passed(pytestconfig):
    capmanager = pytestconfig.pluginmanager.getplugin('capturemanager')

    with app.test_request_context('/', headers=Headers([('X-Trace-ID', 'upstream-trace-id')])):
        app.preprocess_request()

        try:
            raise Exception('Hello')
        except Exception as e:
            client.application.logger.info('Foo', exc_info=e)

        out, err = capmanager.suspend_global_capture(in_=True)
        capmanager.resume_global_capture()

    try:
        record = json.loads(out)
    except Exception:
        print(out)
        print(err)

    assert 'Traceback (most recent call last)' in ' '.join(record['exception'])
    assert 'Exception: Hello' in ' '.join(record['exception'])


@mock.patch('flask_skeleton_ui.custom_extensions.enhanced_logging.main.EnhancedLogging.init_app')
def test_extension_alternative_init(mock_init_app):
    EnhancedLogging('foo')
    mock_init_app.assert_called_once_with('foo')
