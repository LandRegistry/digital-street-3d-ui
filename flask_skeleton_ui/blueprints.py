# Import every blueprint file
from flask_skeleton_ui.views import general
from flask_skeleton_ui.views import index
from flask_skeleton_ui.views import example_form


def register_blueprints(app):
    """
    Adds all blueprint objects into the app.
    """
    app.register_blueprint(general.general)
    app.register_blueprint(index.index)
    app.register_blueprint(example_form.example_form, url_prefix='/example-form')

    # All done!
    app.logger.info("Blueprints registered")
