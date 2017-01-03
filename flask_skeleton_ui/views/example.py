from flask import request, Blueprint, Response, render_template
from flask import current_app
import json

# This is the blueprint object that gets registered into the app in blueprints.py.
example = Blueprint('example', __name__)


@example.route("/")
def index():
    return render_template('example/index.html', title='Example', content='<p>Hello</p>')
