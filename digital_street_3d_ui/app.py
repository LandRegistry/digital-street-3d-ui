from digital_street_3d_ui.landregistry_flask import LandRegistryFlask
from jinja2 import PackageLoader
from jinja2 import PrefixLoader


app = LandRegistryFlask(__name__,
                        template_folder='templates',
                        static_folder='assets/dist',
                        static_url_path='/ui'
                        )


# Set Jinja up to be able to load templates from packages (See gadget-govuk-ui for a full example)
app.jinja_loader = PrefixLoader({
    'app': PackageLoader('digital_street_3d_ui'),
    'wtforms_gov': PackageLoader('digital_street_3d_ui.custom_extensions.wtforms_helpers')
})

app.config.from_pyfile("config.py")


@app.context_processor
def inject_global_values():
    """Inject global template values

    Use this to inject values into the templates that are used globally.
    This might be things such as the current username
    """

    return dict(
        service_name='Search Index Map'
    )
