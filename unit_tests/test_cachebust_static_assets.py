import unittest
from unittest import mock
import os

from flask_skeleton_ui.main import app
from flask_skeleton_ui.custom_extensions.cachebust_static_assets.main import md5_for_file
from flask import render_template_string


class TestCachebustStaticAssets(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_md5_for_file_generates_same_value_repeatedly(self):
        hash_one = md5_for_file('./README.md')
        hash_two = md5_for_file('./README.md')
        hash_three = md5_for_file('./README.md')
        self.assertEqual(hash_one, hash_two)
        self.assertEqual(hash_two, hash_three)

    def test_md5_for_different_files_generate_different_hashes(self):
        hash_one = md5_for_file('./README.md')
        hash_two = md5_for_file('./Dockerfile')
        self.assertNotEqual(hash_one, hash_two)

    def test_md5_for_file_generates_different_value_when_file_is_changed(self):
        filename = './test_md5_for_file_generates_different_value_when_file_is_changed.txt'
        with open(filename, 'w+') as file:
            file.write('Hello')
        hash_one = md5_for_file(filename)

        with open(filename, 'a') as file:
            file.write(' World')

        hash_two = md5_for_file(filename)
        self.assertNotEqual(hash_one, hash_two)

        os.remove(filename)

    def test_url_for_adds_cache_query_string(self):
        filename = 'flask_skeleton_ui/assets/dist/test.txt'
        with open(filename, 'w+') as file:
            file.write('Hello')

        with app.test_request_context('/'):
            output = render_template_string("{{ url_for('static', filename='test.txt') }}")

        md5_value = md5_for_file(filename, hexdigest=True)

        self.assertIn('?cache={}'.format(md5_value), output)

        os.remove(filename)

    @mock.patch('flask_skeleton_ui.custom_extensions.cachebust_static_assets.main.md5_for_file', wraps=md5_for_file)
    def test_repeated_url_for_calls_hits_cache_not_disk(self, mock_md5_for_file):
        filename = 'flask_skeleton_ui/assets/dist/test.txt'
        with open(filename, 'w+') as file:
            file.write('Hello')

        with app.test_request_context('/'):
            hash_one = render_template_string("{{ url_for('static', filename='test.txt') }}")
            hash_two = render_template_string("{{ url_for('static', filename='test.txt') }}")
            hash_three = render_template_string("{{ url_for('static', filename='test.txt') }}")

            self.assertEqual(mock_md5_for_file.call_count, 1)

        self.assertEqual(hash_one, hash_two)
        self.assertEqual(hash_two, hash_three)

        os.remove(filename)

    def test_non_existent_file_doesnt_throw_exception_but_logs_instead(self):
        with app.test_request_context('/'):
            app.preprocess_request()

            with self.assertLogs(level='ERROR') as logs:

                render_template_string("{{ url_for('static', filename='doesnt-exist.txt') }}")
                # Test would fail if an exception was raised above

                self.assertIn('File not found: /src/flask_skeleton_ui/assets/dist/doesnt-exist.txt', str(logs))

    def test_hashed_url_for_only_runs_for_static_asset_routes(self):
        with app.test_request_context('/'):
            output = render_template_string("{{ url_for('index.index_page') }}")

        self.assertNotIn('?cache', output)
