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
    def __call__(self, field, **kwargs):
        return self.render(self.map_gov_params(field, **kwargs))

    def map_gov_params(self, field, **kwargs):
        """Map WTForms' html params to govuk macros

        Taking WTForms' output, we need to map it to a params dict
        which matches the structure that the govuk macros are expecting
        """
        params = {
            'id': kwargs['id'],
            'name': field.name,
            'label': {
                'text': field.label.text
            },
            'attributes': {}
        }

        if 'value' in kwargs:
            params['value'] = kwargs['value']
            del kwargs['value']

        # Not all form elements have a type so guard against it not existing
        if 'type' in kwargs:
            params['type'] = kwargs['type']
            del kwargs['type']

        # Remove items that we've already used from the kwargs
        del kwargs['id']

        # Merge in any extra params passed in from the template layer
        if 'params' in kwargs:
            params = self.merge_params(params, kwargs['params'])

            # And then remove it, to make sure it doesn't make it's way into the attributes below
            del kwargs['params']

        # Map error messages
        if field.errors:
            params['errorMessage'] = {
                'text': field.errors[0]
            }

        # And then Merge any remaining attributes directly to the attributes param
        # This catches anything set in the more traditional WTForms manner
        # i.e. directly as kwargs passed into the field when it's rendered
        params['attributes'] = self.merge_params(params['attributes'], kwargs)

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

class GovIterableBase(GovFormBase):
    def map_gov_params(self, field, **kwargs):
        """Completely override the params mapping for this input type

        It bears little resemblance to that of a normal field
        because these fields are effectively collections of
        fields wrapped in an iterable"""

        params = {
            'name': field.name,
            'items': kwargs['items']
        }

        # Merge in any extra params passed in from the template layer
        if 'params' in kwargs:

            # Merge items individually as otherwise the merge will append new ones
            if 'items' in kwargs['params']:
                for index, item in enumerate(kwargs['params']['items']):
                    item = self.merge_params(params['items'][index], item)

                del kwargs['params']['items']

            params = self.merge_params(params, kwargs['params'])

        if field.errors:
            params['errorMessage'] = {
                'text': field.errors[0]
            }

        return params
