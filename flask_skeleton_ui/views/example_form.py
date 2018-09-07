from flask import Blueprint
from flask import redirect
from flask import render_template
from flask import url_for
from flask import flash
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

from flask_skeleton_ui.custom_extensions.wtforms_helpers.wtforms_widgets import GovTextInput, GovPasswordInput


# This is the blueprint object that gets registered into the app in blueprints.py.
example_form = Blueprint('example_form', __name__)


@example_form.route("/", methods=['GET', 'POST'])
def index():
    form = ExampleForm()
    if form.validate_on_submit():
        flash('Thanks')
        return redirect(url_for('example_form.index'))
    else:
        return render_template('app/example-form.html', form=form)


@example_form.route("/session_storage", methods=['GET'])
def session_storage():
    return render_template('app/example-form-session-storage.html')


class ExampleForm(FlaskForm):
    string_field = StringField('StringField',
                               widget=GovTextInput(),
                               validators=[InputRequired(message='StringField is required')],
                               )

    password_field = PasswordField('PasswordField',
                                   widget=GovPasswordInput(),
                                   validators=[
                                       InputRequired('Password is required'),
                                       EqualTo('password_retype_field', message='Please ensure both password fields match'),
                                   ])

    password_retype_field = PasswordField('Re-type your password',
                                          widget=GovPasswordInput(),
                                          validators=[InputRequired('Please retype your password')])

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

    def validate_string_field(self, field):
        if field.data != 'John Smith':
            raise ValidationError('Example serverside error - type "John Smith" into this field to suppress it')
