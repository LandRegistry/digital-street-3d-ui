from digital_street_3d_ui.main import app
from digital_street_3d_ui.utils.content_negotiation_utils import request_wants_json
import unittest


class TestContentNegotiationUtil(unittest.TestCase):

    def setup_method(self, method):
        self.app = app.test_client()

    def test_content_negotiation_util_returns_false_for_text_html(self):
        with self.app:
            self.app.get('/', headers=[('Accept', 'text/html')])
            assert request_wants_json() is False

    def test_content_negotiation_util_returns_true_for_application_json(self):
        with self.app:
            self.app.get('/', headers=[('Accept', 'application/json')])
            assert request_wants_json() is True
