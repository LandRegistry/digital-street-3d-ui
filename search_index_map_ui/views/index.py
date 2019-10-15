import os
import requests
import json
from flask import Blueprint
from flask import render_template
from flask import current_app
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
    headers = {'Accept': 'application/json'}
    params = {'embed': 'ba_units'}

    r = requests.get(current_app.config['INDEX_MAP_API_URL'] + '/spatial_units', headers=headers, params=params)

    try: 
        r.raise_for_status()
    except requests.exceptions.RequestException:
        return render_template('app/mapbox.html', spatial_units=None, error=r.text)
    
    spatial_units = []
    spatial_units.append(r.json())

    if not spatial_units:
        return render_template('app/mapbox.html', spatial_units=None, error="Cannot find spatial units")

    return render_template('app/mapbox.html', spatial_units=json.dumps(spatial_units), error=None)


