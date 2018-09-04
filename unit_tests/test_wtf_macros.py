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

    def test_string_field(self):
        self.request()
        output = self.render("{{ wtforms_helpers.govukInput(form, 'string_field')}}")

        self.assertIn('<input class="govuk-input" id="string_field" name="string_field" type="text">', output)
        self.assertRegex(output, '<label class="govuk-label" for="string_field">\s*StringField\s*</label>')

    def test_string_field_valid_post(self):
        self.request(method='post', data={'string_field': 'John Smith'})
        output = self.render("{{ wtforms_helpers.govukInput(form, 'string_field')}}")

        self.assertIn('<input class="govuk-input" id="string_field" name="string_field" type="text" value="John Smith">', output)
        self.assertRegex(output, '<label class="govuk-label" for="string_field">\s*StringField\s*</label>')

    def test_string_field_invalid_post(self):
        self.request(method='post', data={'string_field': 'foo'})
        output = self.render("{{ wtforms_helpers.govukInput(form, 'string_field')}}")

        self.assertIn('<input class="govuk-input govuk-input--error" id="string_field" name="string_field" type="text" value="foo" aria-describedby="string_field-error">', output)
        self.assertRegex(output, '<label class="govuk-label" for="string_field">\s*StringField\s*</label>')
        self.assertRegex(output, '<span id="string_field-error" class="govuk-error-message">\s*Example serverside error - type &#34;John Smith&#34; into this field to suppress it\s*</span>')
        self.assertIn('<div class="govuk-form-group govuk-form-group--error">', output)


class ExampleForm(FlaskForm):
    string_field = StringField('StringField',
                               validators=[InputRequired(message='StringField is required')],
                               )

    email_field = StringField('Email address',
                              validators=[InputRequired(message='Email address is required')]
                              )

    float_field = FloatField('FloatField',
                             validators=[InputRequired(message='FloatField is required')]
                             )

    integer_field = IntegerField('IntegerField',
                                 validators=[InputRequired(message='IntegerField is required')]
                                 )

    decimal_field = DecimalField('DecimalField',
                                 validators=[InputRequired(message='DecimalField is required')]
                                 )

    textarea_field = TextAreaField('TextAreaField',
                                   validators=[InputRequired(message='TextAreaField is required')]
                                   )

    boolean_field = BooleanField('BooleanField',
                                 validators=[InputRequired(message='Please tick the box')]
                                 )

    select_field = SelectField('SelectField',
                               [InputRequired(message='Please select an option')],
                               choices=[('', 'Please select'), ('one', 'One'), ('two', 'Two'), ('three', 'Three')],
                               default=''
                               )

    select_multiple_field = SelectMultipleField('SelectMultipleField',
                                                [InputRequired(message='Please select an option')],
                                                choices=[('one', 'One'), ('two', 'Two'), ('three', 'Three')]
                                                )

    radio_field = RadioField('RadioField',
                             [InputRequired(message='Please select an option')],
                             choices=[('one', 'One'), ('two', 'Two'), ('three', 'Three')]
                             )

    file_field = FileField('FileField',
                           [InputRequired(message='Please upload a file')])

    multiple_file_field = MultipleFileField('MultipleFileField',
                                            [InputRequired(message='Please upload a file')])

    submit_button = SubmitField('SubmitField')

    password_field = PasswordField('PasswordField', validators=[
        InputRequired('Password is required'),
        EqualTo('password_retype_field', message='Please ensure both password fields match'),
    ])

    password_retype_field = PasswordField('Re-type your password',
                                          validators=[InputRequired('Please retype your password')])

    def validate_string_field(self, field):
        if field.data != 'John Smith':
            raise ValidationError('Example serverside error - type "John Smith" into this field to suppress it')
