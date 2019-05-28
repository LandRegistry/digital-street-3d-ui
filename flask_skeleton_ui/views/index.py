from flask import Blueprint
from flask import render_template
from flask_skeleton_ui.custom_extensions.wtforms_helpers.wtforms_widgets import GovTextInput
from flask_wtf import FlaskForm
from wtforms.fields import StringField
from wtforms.validators import InputRequired


# This is the blueprint object that gets registered into the app in blueprints.py.
index = Blueprint('index', __name__)


class ExampleForm(FlaskForm):
    string_field = StringField('StringField',
                               widget=GovTextInput(),
                               validators=[InputRequired(message='Example error message coming from flask-wtf (wtforms)')],
                               )


@index.route("/")
def index_page():
    form = ExampleForm()
    form.validate()
    return render_template('app/index.html', form=form)
