from markupsafe import Markup, escape
from wtforms.widgets.core import Input, TextInput, PasswordInput, CheckboxInput, RadioInput, FileInput, SubmitInput, TextArea, Select
from wtforms.compat import iteritems, text_type
from flask import render_template
from flask_skeleton_ui.custom_extensions.wtforms_helpers.gov_form_base import GovFormBase

"""Lifted from WTForms and modified to generate GOV.UK markup

The upstream code should be monitored when updating WTForms to
see if any modifications need to be brought in
"""


class GovInput(GovFormBase, Input):
    """
    Render a basic ``<input>`` field.

    This is used as the basis for most of the other input fields.

    By default, the `_value()` method will be called upon the associated field
    to provide the ``value=`` HTML attribute.
    """
    template = 'wtforms_gov/input.html'

    def __call__(self, field, **kwargs):
        kwargs.setdefault("id", field.id)
        kwargs.setdefault("type", self.input_type)
        if "value" not in kwargs:
            kwargs["value"] = field._value()
        if "required" not in kwargs and "required" in getattr(field, "flags", []):
            kwargs["required"] = True

        return super().__call__(field, **kwargs)



class GovTextInput(GovInput, TextInput):
    """
    Render a single-line text input.
    """
    input_type = "text"



class GovPasswordInput(GovInput, PasswordInput):
    """
    Render a password input.

    For security purposes, this field will not reproduce the value on a form
    submit by default. To have the value filled in, set `hide_value` to
    `False`.
    """
    def __call__(self, field, **kwargs):
        if self.hide_value:
            kwargs["value"] = ""
        return super().__call__(field, **kwargs)


class GovCheckboxesInput(GovFormBase):
    """Multiple checkboxes, from a SelectMultipleField

    This widget type doesn't exist in WTForms - the recommendation
    there is to use a combination of the list and checkbox widgets.
    However in the GOV.UK macros this type of field is not simply
    a list of smaller widgets - multiple checkboxes are a single
    construct of their own."""

    template = 'wtforms_gov/checkboxes.html'
    input_type = 'checkbox'

    def __call__(self, field, **kwargs):
        kwargs.setdefault("id", field.id)

        if "required" not in kwargs and "required" in getattr(field, "flags", []):
            kwargs["required"] = True

        kwargs['items'] = []

        # This field is constructed as an iterable of subfields
        for subfield in field:
            item = {
                'text': subfield.label.text,
                'value': subfield._value()
            }

            if getattr(subfield, "checked", subfield.data):
                item["checked"] = True

            kwargs['items'].append(item)

        return super().__call__(field, **kwargs)

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


class GovCheckboxInput(GovCheckboxesInput):
    """
    Render a single checkbox (i.e. a WTForms BooleanField).
    """
    def __call__(self, field, **kwargs):
        # We are subclassing GovCheckboxesInput which expects
        # the field to be an iterable yielding each checkbox "subfield"
        # In order to make our single BooleanField comply with this, we
        # need to provide it with a similar construct, but which only
        # yields a single checkbox
        class IterableField(object):
            def __init__(self, field):
                self.field = field
                self.max = 1

            def __iter__(self):
                self.index = 0
                return self

            def __next__(self):
                if self.index < self.max:
                    self.index += 1

                    return self.field
                else:
                    raise StopIteration

            def __getattr__(self, name):
                return getattr(self.field, name)

        field_group = IterableField(field)

        return super().__call__(field_group, **kwargs)


class GovRadioInput(GovInput, RadioInput):
    """
    Render a single radio button.

    This widget is most commonly used in conjunction with ListWidget or some
    other listing, as singular radio buttons are not very useful.
    """

    input_type = "radio"

    def __call__(self, field, **kwargs):
        if field.checked:
            kwargs["checked"] = True
        return super().__call__(field, **kwargs)


class GovFileInput(GovInput, FileInput):
    """Render a file chooser input.

    :param multiple: allow choosing multiple files
    """
    def __call__(self, field, **kwargs):
        # browser ignores value of file input for security
        kwargs["value"] = False

        if self.multiple:
            kwargs["multiple"] = True

        return super().__call__(field, **kwargs)


class GovSubmitInput(GovInput, SubmitInput):
    """
    Renders a submit button.

    The field's label is used as the text of the submit button instead of the
    data on the field.
    """
    def __call__(self, field, **kwargs):
        kwargs.setdefault("value", field.label.text)
        return super().__call__(field, **kwargs)


class GovTextArea(GovFormBase, TextArea):
    """
    Renders a multi-line text area.

    `rows` and `cols` ought to be passed as keyword args when rendering.
    """
    template = 'wtforms_gov/textarea.html'

    def __call__(self, field, **kwargs):
        kwargs.setdefault("id", field.id)
        if "required" not in kwargs and "required" in getattr(field, "flags", []):
            kwargs["required"] = True
        return super().__call__(field, **kwargs)


class GovSelect(Select):
    """
    Renders a select field.

    If `multiple` is True, then the `size` property should be specified on
    rendering to make the field useful.

    The field must provide an `iter_choices()` method which the widget will
    call on rendering; this method must yield tuples of
    `(value, label, selected)`.
    """

    def __init__(self, multiple=False):
        self.multiple = multiple

    def __call__(self, field, **kwargs):
        kwargs.setdefault("id", field.id)
        if self.multiple:
            kwargs["multiple"] = True
        if "required" not in kwargs and "required" in getattr(field, "flags", []):
            kwargs["required"] = True

        # html = ["<select %s>" % html_params(name=field.name, **kwargs)]
        # for val, label, selected in field.iter_choices():
        #     html.append(self.render_option(val, label, selected))
        # html.append("</select>")
        # return Markup("".join(html))

        return super().__call__(field, **kwargs)
