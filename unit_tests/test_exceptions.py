from flask_skeleton_ui.main import app
import unittest
from unittest.mock import patch


class TestExceptionHandlers(unittest.TestCase):

    def setup_method(self, method):
        self.app = app.test_client()

    @patch('flask_skeleton_ui.exceptions.unhandled_exception')
    @patch('flask_skeleton_ui.views.index.index_page')
    def test_unhandled_exceptions(self, mock_index_page, mock_exception_handler):
        mock_index_page.side_effect = Exception('test exception')
        # print(self.error_handler_spec)
        response = self.app.get('/')
        assert mock_exception_handler.called
        assert response.status_code == 500

