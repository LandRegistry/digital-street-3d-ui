from flask import Blueprint
from flask import render_template
from search_index_map_ui.custom_extensions.wtforms_helpers.wtforms_widgets import GovTextInput
from flask_wtf import FlaskForm
from wtforms.fields import StringField
from wtforms.validators import InputRequired


# This is the blueprint object that gets registered into the app in blueprints.py.
index = Blueprint('index', __name__)

@index.route("/")
def index_page():
    return render_template('app/index.html')
