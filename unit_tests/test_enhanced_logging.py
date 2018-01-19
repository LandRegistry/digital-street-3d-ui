import unittest
from unittest import mock
import logging
import json
from freezegun import freeze_time
from flask_skeleton_ui.main import app
from flask_skeleton_ui.custom_extensions.enhanced_logging.main import EnhancedLogging


@freeze_time("2017-01-18")
def test_log_output(pytestconfig):
    capmanager = pytestconfig.pluginmanager.getplugin('capturemanager')
    logger = logging.getLogger('flask-skeleton-ui')
    logger.info('Foo')
    out, err = capmanager.suspend_global_capture(in_=True)
    capmanager.resume_global_capture()

    record = json.loads(out)

    assert record == {
        'timestamp': '2017-01-18 00:00:00,000',
        'traceid': 'N/A',
        'level': 'INFO',
        'message': 'Foo',
        'exception': None
    }


class TestEnhancedLogging(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    @mock.patch('flask_skeleton_ui.custom_extensions.enhanced_logging.main.EnhancedLogging.init_app')
    def test_extension_alternative_init(self, mock_init_app):
        EnhancedLogging('foo')
        mock_init_app.assert_called_once_with('foo')

    def test_trace_id_present_when_servicing_an_http_request(self):
        pass

    def test_trace_id_absent_when_not_servicing_an_http_request(self):
        pass

    def test_exc_info_in_log_entries_when_passed(self):
        pass
