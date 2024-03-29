from digital_street_3d_ui.custom_extensions.wtforms_helpers.gov_form_base import (GovFormBase,
                                                                               GovIterableBase)
from digital_street_3d_ui.exceptions import ApplicationError
from wtforms.widgets.core import (FileInput, Input, PasswordInput, Select,
                                  SubmitInput, TextArea, TextInput)


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


class GovCheckboxesInput(GovIterableBase):
    """Multiple checkboxes, from a SelectMultipleField

    This widget type doesn't exist in WTForms - the recommendation
    there is to use a combination of the list and checkbox widgets.
    However in the GOV.UK macros this type of field is not simply
    a list of smaller widgets - multiple checkboxes are a single
    construct of their own."""

    template = 'wtforms_gov/checkboxes.html'
    input_type = 'checkbox'


class GovCheckboxInput(GovCheckboxesInput):
    """Render a single checkbox (i.e. a WTForms BooleanField)."""
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


class GovRadioInput(GovIterableBase):
    template = 'wtforms_gov/radios.html'
    input_type = 'radio'


class GovFileInput(GovInput, FileInput):
    """Render a file chooser input.

    :param multiple: allow choosing multiple files
    """
    template = 'wtforms_gov/file-upload.html'

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
    template = 'wtforms_gov/button.html'

    def __call__(self, field, **kwargs):
        return super().__call__(field, **kwargs)

    def map_gov_params(self, field, **kwargs):
        params = super().map_gov_params(field, **kwargs)

        params.setdefault('text', field.label.text)
        params.setdefault('element', 'button')

        return params


class GovTextArea(GovFormBase, TextArea):
    """
    Renders a multi-line text area.

    `rows` and `cols` ought to be passed as keyword args when rendering.
    """
    template = 'wtforms_gov/textarea.html'

    def __call__(self, field, **kwargs):
        kwargs.setdefault("id", field.id)
        if "value" not in kwargs:
            kwargs["value"] = field._value()
        if "required" not in kwargs and "required" in getattr(field, "flags", []):
            kwargs["required"] = True
        return super().__call__(field, **kwargs)


class GovSelect(GovFormBase, Select):
    """
    Renders a select field.

    If `multiple` is True, then the `size` property should be specified on
    rendering to make the field useful.

    The field must provide an `iter_choices()` method which the widget will
    call on rendering; this method must yield tuples of
    `(value, label, selected)`.
    """
    template = 'wtforms_gov/select.html'

    def __call__(self, field, **kwargs):
        if self.multiple:
            raise ApplicationError('Please do not render mutliselect elements as a select box'
                                   ' - you should use checkboxes instead in order to comply with'
                                   ' the GOV.UK service manual')

        kwargs.setdefault("id", field.id)

        if "required" not in kwargs and "required" in getattr(field, "flags", []):
            kwargs["required"] = True

        kwargs['items'] = []

        # Construct select box choices
        for val, label, selected in field.iter_choices():
            item = {
                'text': label,
                'value': val,
                'selected': selected
            }

            kwargs['items'].append(item)

        return super().__call__(field, **kwargs)

    def map_gov_params(self, field, **kwargs):

        params = super().map_gov_params(field, **kwargs)

        params['items'] = kwargs['items']

        return params
