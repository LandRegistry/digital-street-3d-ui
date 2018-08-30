from flask_skeleton_ui.landregistry_flask import LandRegistryFlask
from jinja2 import PackageLoader
from jinja2 import PrefixLoader
from jinja2 import TemplateError
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

    def raise_template_error(message):
        raise TemplateError(message)

    def wtforms(form, name, params={}):
        """WTForms / govuk macro helper

        Takes a WTForms form object and maps it to the necessary pieces
        of the govuk-frontend macros so that the two mesh seamlessly

        Available wtforms types
        -----------------------

        No special handling required:
        StringField
        FloatField
        IntegerField
        DecimalField

        Require special handling:
        BooleanField
        DateField
        DateTimeField
        FileField
        MultipleFileField
        RadioField
        SelectField
        SelectMultipleField
        SubmitField
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
                'text': el.label.text
            },
            'value': el.data
        }

        # Special handling for:
        # BooleanField
        #
        # govuk-frontend requires a list of items with the standard form structure, plus
        #   - a 'checked' attribute
        if el.type in ['BooleanField']:
            wtforms_params = {
                'items': [
                    {
                        'id': el.id,
                        'name': name,
                        'text': el.label.text,
                        'value': el.data,
                        'checked': el.data
                    }
                ]
            }

        # Special handling for:
        # SelectMultipleField
        #
        # govuk-frontend requires a list of items with the standard form structure, plus
        #   - a 'checked' attribute
        if el.type in ['SelectMultipleField']:

            def wtforms_checkbox_option(option):
                (index, option) = option
                return {
                            'id': '%s-%d' % (el.id, index),
                            'name': name,
                            'value': option[0],
                            'text': option[1],
                            'checked': option[0] in el.data
                        }
            wtforms_params['items'] = list(map(wtforms_checkbox_option, enumerate(el.choices)))

        # Special handling for:
        # SelectField
        #
        # govuk-frontend requires a list of dicts with value, text, selected and disabled keys
        if el.type in ['SelectField']:
            # Note that wtforms does not appear to allow disabled options inside a select field
            # so this is left unhandled.
            # Frankly this is a weird edge case anyway which is probably unlikely to be well understood by users so perhaps this is for the best
            def wtforms_select_option(option):
                return { 'value': option[0],
                         'text': option[1],
                         'selected': option[0] == el.data }

            wtforms_params['items'] = list(map(wtforms_select_option, el.choices))

        return my_merger.merge(wtforms_params, params)

    return dict(
        wtforms=wtforms,
        raise_template_error=raise_template_error
    )
