import collections
from flask import ctx
from flask import g
from flask import request
from flask_logconfig import LogConfig
import json
import logging
import requests
import traceback
import uuid


class EnhancedLogging(object):

    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):

        logconfig = {
            'version': 1,
            'disable_existing_loggers': False,
            'formatters': {
                'simple': {
                    '()': 'flask_skeleton_ui.custom_extensions.enhanced_logging.JsonFormatter'
                },
                'audit': {
                    '()': 'flask_skeleton_ui.custom_extensions.enhanced_logging.JsonAuditFormatter'
                }
            },
            'filters': {
                'contextual': {
                    '()': 'flask_skeleton_ui.custom_extensions.enhanced_logging.ContextualFilter'
                }
            },
            'handlers': {
                'console': {
                    'class': 'logging.StreamHandler',
                    'formatter': 'simple',
                    'filters': ['contextual'],
                    'stream': 'ext://sys.stdout'
                },
                'audit_console': {
                    'class': 'logging.StreamHandler',
                    'formatter': 'audit',
                    'filters': ['contextual'],
                    'stream': 'ext://sys.stdout'
                }
            },
            'loggers': {
                'flask_skeleton_ui': {
                    'handlers': ['console'],
                    'level': app.config['FLASK_LOG_LEVEL']
                },
                'audit': {
                    'handlers': ['audit_console'],
                    'level': 'INFO'
                }
            }
        }

        app.config.update(LOGCONFIG=logconfig)

        logger = LogConfig()

        logger.init_app(app)

        # Along with the default flask logger (app.logger) define a new one specifically for audit. To use this logger
        # just add app.audit_logger.info("an audit point").
        app.audit_logger = logging.getLogger("audit")

        @app.before_request
        def before_request():
            # Sets the transaction trace id on the global object if provided in the HTTP header from the caller.
            # Generate a new one if it has not. We will use this in log messages.
            g.trace_id = request.headers.get('X-Trace-ID', uuid.uuid4().hex)
            # We also create a session-level requests object for the app to use with the header pre-set, so other APIs
            # will receive it. These lines can be removed if the app will not make requests to other LR APIs!
            g.requests = requests.Session()
            g.requests.headers.update({'X-Trace-ID': g.trace_id})


class ContextualFilter(logging.Filter):
    def filter(self, log_record):
        """Provide some extra variables to be placed into the log message """

        # If we have an app context (because we're servicing an http request) then get the trace id we have
        # set in g (see app.py)
        if ctx.has_app_context():
            log_record.trace_id = g.trace_id
        else:
            log_record.trace_id = 'N/A'
        return True


class JsonFormatter(logging.Formatter):
    def format(self, record):
        if record.exc_info:
            exc = traceback.format_exception(*record.exc_info)
        else:
            exc = None

        # Timestamp must be first (webops request)
        log_entry = collections.OrderedDict(
            [('timestamp', self.formatTime(record)),
             ('level', record.levelname),
             ('traceid', record.trace_id),
             ('message', record.msg % record.args),
             ('exception', exc)])

        return json.dumps(log_entry)


class JsonAuditFormatter(logging.Formatter):
    def format(self, record):
        # Timestamp must be first (webops request)
        log_entry = collections.OrderedDict(
            [('timestamp', self.formatTime(record)),
             ('level', 'AUDIT'),
             ('traceid', record.trace_id),
             ('message', record.msg % record.args)])

        return json.dumps(log_entry)
