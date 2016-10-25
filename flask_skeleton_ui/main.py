# This file is the entry point.
# First we import the app object, which will get initialised as we do it. Then import methods we're about to use.
from flask_skeleton_ui.app import app
from flask_skeleton_ui.extensions import register_extensions
from flask_skeleton_ui.blueprints import register_blueprints
from flask_skeleton_ui.exceptions import register_exception_handlers

# Now we register any extensions we use into the app
register_extensions(app)
# Register the exception handlers
register_exception_handlers(app)
# Finally we register our blueprints to get our routes up and running.
register_blueprints(app)
