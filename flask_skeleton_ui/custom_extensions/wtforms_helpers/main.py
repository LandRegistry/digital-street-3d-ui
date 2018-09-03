from deepmerge import Merger
from jinja2 import TemplateError

class WTFormsHelpers(object):
    """WTForms helpers

    Register some template helpers to allow developers to
    map WTForms elements to the GOV.UK jinja macros
    """

    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        app.add_template_global(raise_template_error)
        app.add_template_global(wtforms_field)
        app.add_template_global(wtforms_errors)

merger = Merger(
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

def raise_template_error(message):
    raise TemplateError(message)

def wtforms_field(form, name, params={}):
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
    SelectField
    SelectMultipleField
    RadioField
    PasswordField

    FileField
    MultipleFileField
    SubmitField
    DateField
    DateTimeField
    """
    el = form[name]

    # Map basic properties onto the govuk params structure
    wtforms_params = {
        'id': el.id,
        'name': name,
        'label': {
            'text': el.label.text
        },
        'value': el.data if el.data else '',
        'attributes': {}
    }

    # Special handling for:
    # BooleanField
    #
    # govuk-frontend requires a list of items with the standard form structure, plus
    #   - a 'checked' attribute
    if el.type in ['BooleanField']:
        wtforms_params = {
            'name': name,
            'items': [
                {
                    'id': el.id,
                    'text': el.label.text,
                    'checked': el.data,
                    'value': el._value()
                }
            ]
        }

    # Special handling for:
    # SelectMultipleField
    #
    # govuk-frontend requires a list of items with the standard form structure, plus
    #   - a 'checked' attribute
    if el.type in ['SelectMultipleField', 'RadioField']:

        def wtforms_checkbox_option(option):
            (index, option) = option
            return {
                        'id': '%s-%d' % (el.id, index),
                        'name': name,
                        'value': option[0],
                        'text': option[1],
                        'checked': option[0] in el.data if el.data else False
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

    # Special handling for:
    # PasswordField
    #
    # don't pass the value back up through the template layer
    if el.type in ['PasswordField']:
        del wtforms_params['value']

    # Special handling for:
    # MultipleFileField
    #
    # Need to set the multiple attribute on the field
    if el.type in ['MultipleFileField']:
        wtforms_params['attributes']['multiple'] = 'multiple'

    # Special handling for:
    # SubmitField
    #
    # Just need to grab button text which wtforms stores in the "label"
    if el.type in ['SubmitField']:
        wtforms_params['text'] = el.label

    # Assign errors to individual inputs
    if name in form.errors:
        wtforms_params['errorMessage'] = {
            'text': form.errors[name][0]
        }

    return merger.merge(wtforms_params, params)

def wtforms_errors(form, params):
    wtforms_params = {
        'titleText': 'There is a problem',
        'errorList': []
    }

    for key, errors in form.errors.items():
        wtforms_params['errorList'].append({
            'text': errors[0],
            'href': '#%s-error' % key
        })

    return merger.merge(wtforms_params, params)
