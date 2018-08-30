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
from wtforms.fields import PasswordField
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
    full_name = StringField('Full name',
                            validators=[InputRequired(message='Full name is required')],
                            )

    ni = StringField('National Insurance number',
                     validators=[InputRequired(message='National Insurance number is required')]
                     )

    email = StringField('Email address',
                        validators=[InputRequired(message='Email address is required')]
                        )

    checkbox = BooleanField('Boolean field',
                            validators=[InputRequired(message='Please tick the box')]
                            )

    select_field = SelectField('Select field',
                               [InputRequired(message='Please select an option')],
                               choices=[('', 'Please select'), ('one', 'One'), ('two', 'Two'), ('three', 'Three')],
                               default=''
                               )

    radio_field = RadioField('Radio field',
                             [InputRequired(message='Please select an option')],
                             choices=[('one', 'One'), ('two', 'Two'), ('three', 'Three')]
                             )

    checkboxes_field = SelectMultipleField('Select multiple',
                                           [InputRequired(message='Please select an option')],
                                           choices=[('one', 'One'), ('two', 'Two'), ('three', 'Three')],
                                           option_widget=widgets.CheckboxInput(),
                                           widget=widgets.ListWidget(prefix_label=False)
                                           )

    password = PasswordField('Create a password', validators=[
        InputRequired('Password is required'),
        EqualTo('password_retype', message='Please ensure both password fields match'),
    ])

    password_retype = PasswordField('Re-type your password')

    def validate_full_name(self, field):
        if field.data != 'John Smith':
            raise ValidationError('Example serverside error - type "John Smith" into this field to suppress it')


@example_form.route("/success")
def success():
    return render_template('app/success.html', message='Form successfully submitted')
