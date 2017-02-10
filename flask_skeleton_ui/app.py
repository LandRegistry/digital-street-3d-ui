from flask import Flask, g, request
import uuid
import requests
from .landregistry_flask import LandRegistryFlask
from .static_asset_helpers import gzip, dated_url_for

app = LandRegistryFlask(__name__,
                        template_folder='templates',
                        static_folder='assets/dist',
                        static_url_path='/static'
                        )

app.config.from_pyfile("config.py")

gzip(app)


@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)


@app.before_request
def before_request():
    # Sets the transaction trace id into the global object if it has been provided in the HTTP header from the caller.
    # Generate a new one if it has not. We will use this in log messages.
    trace_id = request.headers.get('X-Trace-ID', None)
    if trace_id is None:
        trace_id = uuid.uuid4().hex
    g.trace_id = trace_id
    # We also create a session-level requests object for the app to use with the header pre-set, so other APIs will
    # receive it. These lines can be removed if the app will not make requests to other LR APIs!
    g.requests = requests.Session()
    g.requests.headers.update({'X-Trace-ID': trace_id})
