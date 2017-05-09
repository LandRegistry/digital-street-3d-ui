from flask import jsonify
from flask import render_template
from flask_skeleton_ui import utils
from werkzeug.exceptions import default_exceptions
from werkzeug.exceptions import HTTPException


GENERIC_ERROR_TITLE = 'Sorry, we are experiencing technical difficulties.'
GENERIC_ERROR_DESCRIPTION = 'Please try again in a few moments.'

ERROR_RESPONSES = {
    404: {
        'title': 'Page not found',
        'description': 'If you entered a web address please check it was correct.'
    },
    429: {
        'title': 'Too many requests',
        'description': 'The maximum rate allowed is {description}.'
    },
    403: {
        'title': 'Access denied',
        'description': 'You do not have permission to access the requested resource.'
    }
}


def error_handler(error):
    if isinstance(error, HTTPException):
        code = error.code
        error_title = GENERIC_ERROR_TITLE
        error_description = GENERIC_ERROR_DESCRIPTION

        error_response = ERROR_RESPONSES.get(code, False)
        if(error_response):
            error_title = error_response.get('title', GENERIC_ERROR_TITLE)
            error_description = error_response.get('description', GENERIC_ERROR_DESCRIPTION).format(**error.__dict__)
    else:
        code = 500
        error_title = GENERIC_ERROR_TITLE
        error_description = GENERIC_ERROR_DESCRIPTION

    # Negotiate based on the Accept header
    if utils.request_wants_json():
        return jsonify({'message': '{} - {}'.format(error_title, error_description)}), code
    else:
        return render_template("error.html",
                               title=error_title,
                               code=code,
                               description=error_description
                               ), code


def register_exception_handlers(app):

    for exception in default_exceptions:
        app.register_error_handler(exception, error_handler)

    app.register_error_handler(Exception, error_handler)
    app.logger.info("Exception handlers registered")
