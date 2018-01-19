import unittest
from unittest import mock
import os

from flask_skeleton_ui.main import app
from flask_skeleton_ui.custom_extensions.gzip_static_assets.main import GzipStaticAssets
from flask_skeleton_ui.custom_extensions.gzip_static_assets.main import gzip_cache
from flask_skeleton_ui.custom_extensions.gzip_static_assets.main import gzip_cache_key


class TestGzipStaticAssets(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    @mock.patch('flask_skeleton_ui.custom_extensions.gzip_static_assets.main.GzipStaticAssets.init_app')
    def test_extension_alternative_init(self, mock_init_app):
        GzipStaticAssets('foo')
        mock_init_app.assert_called_once_with('foo')

    def test_setting_up_cache_directory(self):
        gzip_cache()

        # Check that the directory exists
        self.assertTrue(os.path.exists('.cache/gzip'))

        # And that it's empty
        print(os.listdir('.cache/gzip'))
        file_count = len([name for name in os.listdir('.cache/gzip') if os.path.isfile(name)])
        self.assertEqual(file_count, 1)

    def test_gzip_cache_key_format(self):
        # gzip_cache_key
        pass

    def test_gzipped_response(self):
        # Create test file
        # Request it and check response is valid gzip
        # Unzip it, check the contents is the same as the original
        pass

    def test_html_is_not_gzipped(self):
        pass

    def test_repeated_requests_returns_cached_value(self):
        pass
