from flask import g
from flask import request
from flask import url_for
from flask_skeleton_ui.landregistry_flask import LandRegistryFlask
import os
import requests
import uuid

app = LandRegistryFlask(__name__,
                        template_folder='templates',
                        static_folder='assets/dist',
                        static_url_path='/static'
                        )

app.config.from_pyfile("config.py")


@app.before_request
def before_request():
    # Sets the transaction trace id into the global object if it has been provided in the HTTP header from the caller.
    # Generate a new one if it has not. We will use this in log messages.
    g.trace_id = request.headers.get('X-Trace-ID', uuid.uuid4().hex)
    # We also create a session-level requests object for the app to use with the header pre-set, so other APIs will
    # receive it. These lines can be removed if the app will not make requests to other LR APIs!
    g.requests = requests.Session()
    g.requests.headers.update({'X-Trace-ID': g.trace_id})


def dated_url_for(endpoint, **values):
    """Cachebusting

    Use the last updated timestamp from the file on disk to perform cachebusting duties.
    This forces browsers to download new versions of files when they change.
    """
    if endpoint == 'static':
        filename = values.get('filename', None)

        if filename:
            file_path = os.path.join(app.root_path, app.static_folder, filename)

            values['cache'] = int(os.stat(file_path).st_mtime)

    return url_for(endpoint, **values)


@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)
