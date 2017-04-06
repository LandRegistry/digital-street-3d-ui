from flask import request, Blueprint, Response, render_template
from flask import current_app
import json

# This is the blueprint object that gets registered into the app in blueprints.py.
index = Blueprint('index', __name__)


@index.route("/")
def index_page():
    return render_template('index.html')
