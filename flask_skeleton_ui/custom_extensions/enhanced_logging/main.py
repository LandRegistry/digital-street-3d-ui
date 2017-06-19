from flask import g
from flask import request
from flask_logconfig import LogConfig
import logging
import requests

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
                    '()': 'flask_skeleton_ui.custom_extensions.enhanced_logging.formatters.JsonFormatter'
                },
                'audit': {
                    '()': 'flask_skeleton_ui.custom_extensions.enhanced_logging.formatters.JsonAuditFormatter'
                }
            },
            'filters': {
                'contextual': {
                    '()': 'flask_skeleton_ui.custom_extensions.enhanced_logging.filters.ContextualFilter'
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
