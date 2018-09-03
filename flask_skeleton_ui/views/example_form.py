from flask import Blueprint
from flask import redirect
from flask import render_template
from flask import url_for
from flask_wtf import FlaskForm
from wtforms import widgets
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
from wtforms.fields import DateField
from wtforms.fields import DateTimeField
from wtforms.fields import FileField
from wtforms.fields import MultipleFileField
from wtforms.fields import SubmitField
from wtforms.validators import InputRequired
from wtforms.validators import EqualTo
from wtforms.validators import ValidationError


# This is the blueprint object that gets registered into the app in blueprints.py.
example_form = Blueprint('example_form', __name__)


@example_form.route("/", methods=['GET', 'POST'])
def index():
    form = ExampleForm()
    if form.validate_on_submit():
        return redirect(url_for('example_form.success'))
    else:
        return render_template('app/example-form.html', form=form)


@example_form.route("/session_storage", methods=['GET'])
def session_storage():
    return render_template('app/example-form-session-storage.html')


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

    date_field = DateField('DateField')
    date_time_field = DateTimeField('DateTimeField')
    file_field = FileField('FileField')
    multiple_file_field = MultipleFileField('MultipleFileField')
    submit_field = SubmitField('SubmitField')


    password_field = PasswordField('PasswordField', validators=[
        InputRequired('Password is required'),
        EqualTo('password_retype', message='Please ensure both password fields match'),
    ])

    password_retype_field = PasswordField('Re-type your password')

    def validate_string_field(self, field):
        if field.data != 'John Smith':
            raise ValidationError('Example serverside error - type "John Smith" into this field to suppress it')


@example_form.route("/success")
def success():
    return render_template('app/success.html', message='Form successfully submitted')
