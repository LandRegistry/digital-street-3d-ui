import json
import unittest
import re
import yaml
from unittest import mock
from flask import render_template_string
from flask_skeleton_ui.main import app
from unit_tests.fixtures.wtf_macros_example_form import ExampleForm


class TestFlaskWtfMacros(unittest.TestCase):
    """Test the flask-wtf -> govuk macros

    Test the output of passing flask-wtf form elements
    through the custom govuk macros, ensuring we get
    correctly formed responses."""

    def setup_method(self, method):
        self.app = app.test_client()
        self.base_template = "{% import 'app/macros/wtforms_helpers.html' as wtforms_helpers %}"
        app.jinja_env.lstrip_blocks = True
        app.jinja_env.trim_blocks = True

    def request(self, **kwargs):
        self.ctx = app.test_request_context('/', **kwargs)
        self.ctx.push()

        self.form = ExampleForm()
        self.form.validate_on_submit()

    def teardown_method(self, method):
        self.ctx.pop()

    def render(self, template):
        """Helper method to render a snippet of a form"""
        return render_template_string(self.base_template + template,
                                        form=self.form).strip()

def make_test_function(template, scenario_data):
    def test(self):
        if 'request' in scenario_data:
            self.request(**scenario_data['request'])
        else:
            self.request()

        output = self.render(template)

        for expectation in scenario_data['expected_output']:
            self.assertRegex(output, expectation)

    return test

test_data = yaml.load(open('unit_tests/fixtures/wtf_macros_data.yaml').read())

for element_name, params in test_data.items():
    for scenario_name, scenario_data in params['scenarios'].items():
        test_func = make_test_function(params['template'], scenario_data)
        setattr(TestFlaskWtfMacros, 'test_{0}_{1}'.format(element_name, scenario_name), test_func)
