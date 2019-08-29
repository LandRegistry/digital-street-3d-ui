import os
from flask import Blueprint
from flask import render_template
from flask_httpauth import HTTPBasicAuth
from search_index_map_ui.custom_extensions.wtforms_helpers.wtforms_widgets import GovTextInput
from flask_wtf import FlaskForm
from wtforms.fields import StringField
from wtforms.validators import InputRequired


auth = HTTPBasicAuth()

@auth.verify_password
def verify_password(username, password):
    if os.environ.get('USE_AUTH') == "true":
        if username == os.environ.get('USERNAME') and password == os.environ.get('PASSWORD'):
            return True
        return False
    return True

# This is the blueprint object that gets registered into the app in blueprints.py.
index = Blueprint('index', __name__)

@index.route("/")
@auth.login_required
def index_page():
    return render_template('app/index.html')

@index.route("/leaflet")
@auth.login_required
def leaflet_page():
    return render_template('app/leaflet.html')

@index.route("/mapbox")
@auth.login_required
def mapbox_page():
    return render_template('app/mapbox.html')