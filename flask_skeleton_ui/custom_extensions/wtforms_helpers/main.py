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
        app.add_template_global(wtforms_errors)


def wtforms_errors(form, params={}):
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
