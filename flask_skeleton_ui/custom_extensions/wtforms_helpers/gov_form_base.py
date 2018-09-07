import re
from deepmerge import Merger
from flask import render_template
from jinja2 import Markup

class GovFormBase(object):
    """Collection of helpers

    These are mixed into the WTForms classes which we are subclassing
    to provide extra functionality.

    Some of our subclasses then extend these base utilities for their
    specific use cases
    """

    def map_gov_params(self, field, **kwargs):
        """Map WTForms' html params to govuk macros

        Taking WTForms' output, we need to map it to a params dict
        which matches the structure that the govuk macros are expecting
        """
        params = {
            'type': kwargs['type'],
            'id': kwargs['id'],
            'name': field.name,
            'label': {
                'text': field.label.text
            },
            'attributes': {}
        }

        # Remove items that we've already used from the kwargs
        del kwargs['type']
        del kwargs['id']

        # Merge in any extra params passed in from the template layer
        # And then remove it, to make sure it doesn't make it's way into the attributes below
        if 'params' in kwargs:
            params = self.merge_params(params, kwargs['params'])
            # del kwargs['params']

        # Map error messages
        if field.errors:
            params['errorMessage'] = {
                'text': field.errors[0]
            }

        # And then Merge any remaining attributes directly to the attributes param
        #
        # TODO: Do we want to do this? It matches the WTForms API, but it duplicates
        # the ability to set custom attributes directly with the gov options.
        # Currently thinking *not* to have this line in...
        #
        # params['attributes'] = self.merge_params(params['attributes'], kwargs)

        return params

    def merge_params(self, a, b):
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

        return merger.merge(a, b)

    def render(self, params):
        return Markup(render_template(self.template, params=params))
