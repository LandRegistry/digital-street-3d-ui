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
from wtforms.validators import Email

class ExampleForm(FlaskForm):
    string_field = StringField('StringField',
                               validators=[InputRequired(message='StringField is required')],
                               )

    email_field = StringField('Email address',
                              validators=[Email()]
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
