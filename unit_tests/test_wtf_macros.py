import json
import unittest
from unittest import mock
from flask import render_template_string
from flask_skeleton_ui.main import app
from flask_wtf import FlaskForm
from wtforms.fields import BooleanField
from wtforms.fields import RadioField
from wtforms.fields import SelectField
from wtforms.fields import SelectMultipleField
from wtforms.fields import StringField
from wtforms.fields import TextAreaField
from wtforms.fields import PasswordField
from wtforms.fields import FloatField
from wtforms.fields import IntegerField
from wtforms.fields import DecimalField
from wtforms.fields import FileField
from wtforms.fields import MultipleFileField
from wtforms.fields import SubmitField
from wtforms.validators import InputRequired
from wtforms.validators import EqualTo
from wtforms.validators import ValidationError


class TestFlaskWtfMacros(unittest.TestCase):
    """Test the flask-wtf -> govuk macros

    Test the output of passing flask-wtf form elements
    through the custom govuk macros, ensuring we get
    correctly formed responses.

    Rather than comparing the whole output to a known string
    we try and err on the side of just checking the most
    pertinent aspects of the form in the hope that the tests
    will not be too susceptible to changes upstream"""

    def setup_method(self, method):
        self.app = app.test_client()

        app.jinja_env.lstrip_blocks = True
        app.jinja_env.trim_blocks = True

    def test_string_field(self):
        class ExampleForm(FlaskForm):
            string_field = StringField('StringField',
                                    validators=[InputRequired(message='StringField is required')],
                                    )

        template = '''{% import 'app/macros/wtforms_helpers.html' as wtforms_helpers %}
                      {{ wtforms_helpers.govukInput(form, 'string_field')}}'''

        with app.test_request_context('/'):
            form = ExampleForm()
            output = render_template_string(template, form=form).strip()

        self.assertIn('<input class="govuk-input" id="string_field" name="string_field" type="text">', output)
        self.assertRegex(output, '<label class="govuk-label" for="string_field">\s*StringField\s*</label>')
