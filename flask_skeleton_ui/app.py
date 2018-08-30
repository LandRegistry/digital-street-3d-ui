from flask_skeleton_ui.landregistry_flask import LandRegistryFlask
from jinja2 import PackageLoader
from jinja2 import PrefixLoader
from deepmerge import Merger


app = LandRegistryFlask(__name__,
                        template_folder='templates',
                        static_folder='assets/dist',
                        static_url_path='/ui'
                        )


# Set Jinja up to be able to load templates from packages (See gadget-govuk-ui for a full example)
app.jinja_loader = PrefixLoader({
    'app': PackageLoader('flask_skeleton_ui')
})

app.config.from_pyfile("config.py")


@app.context_processor
def inject_global_values():
    """Inject global template values

    Use this to inject values into the templates that are used globally.
    This might be things such as google analytics keys, or even the current username
    """

    return dict(
        service_name='Flask Skeleton UI'
    )


@app.context_processor
def wtforms_helper():
    """Inject WTForms helper method"""

    def wtforms(form, name, params={}):
        """WTForms / govuk macro helper

        Takes a WTForms form object and maps it to the necessary pieces
        of the govuk-frontend macros so that the two mesh seamlessly
        """
        my_merger = Merger(
            # pass in a list of tuple, with the
            # strategies you are looking to apply
            # to each type.
            [
                (list, ["append"]),
                (dict, ["merge"])
            ],
            # next, choose the fallback strategies,
            # applied to all other types:
            ["override"],
            # finally, choose the strategies in
            # the case where the types conflict:
            ["override"]
        )

        el = form[name]

        # Map basic properties onto the govuk params structure
        wtforms_params = {
            'id': el.id,
            'name': name,
            'label': {
                'text': el.label.text,
                'for': el.id
            },
            'value': el.data
        }

        # Special handling for <select> field options
        if el.type == 'SelectField':
            # Note that wtforms does not appear to allow disabled options inside a select field
            # so this is left unhandled
            wtforms_params['items'] = [{
                                        'value': value,
                                        'text': text,
                                        'selected': value == el.data
                                      } for value, text in el.choices]

        return my_merger.merge(wtforms_params, params)

    return dict(
        wtforms=wtforms
    )
