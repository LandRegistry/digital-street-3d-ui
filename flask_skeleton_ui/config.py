import os
# RULES OF CONFIG:
# 1. No region specific code. Regions are defined by setting the OS environment variables appropriately to build up the
# desired behaviour.
# 2. No use of defaults when getting OS environment variables. They must all be set to the required values prior to the
# app starting.
# 3. This is the only file in the app where os.environ should be used.

# For logging
FLASK_LOG_LEVEL = os.environ['LOG_LEVEL']

# For health route
COMMIT = os.environ['COMMIT']

# This APP_NAME variable is to allow changing the app name when the app is running in a cluster. So that
# each app in the cluster will have a unique name.
APP_NAME = os.environ['APP_NAME']

# Using SQLAlchemy/Postgres?
# The required variables (and required usage) can be found here:
# http://192.168.249.38/gadgets/gadget-api/blob/master/gadget_api/config.py

LOGCONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'simple': {
            '()': 'flask_skeleton_ui.extensions.JsonFormatter'
        },
        'audit': {
            '()': 'flask_skeleton_ui.extensions.JsonAuditFormatter'
        }
    },
    'filters': {
        'contextual': {
            '()': 'flask_skeleton_ui.extensions.ContextualFilter'
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
            'level': FLASK_LOG_LEVEL
        },
        'audit': {
            'handlers': ['audit_console'],
            'level': 'INFO'
        }
    }
}
