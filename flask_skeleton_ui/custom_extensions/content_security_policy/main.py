from flask_skeleton_ui.custom_extensions.content_security_policy import reporting
from flask import url_for
from flask import g
from os import urandom
from base64 import b64encode


class ContentSecurityPolicy(object):
    """Content security policy

    See https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
        https://www.owasp.org/index.php/Content_Security_Policy_Cheat_Sheet
        https://content-security-policy.com/
    """

    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):

        self.csp = ("default-src 'self';"
                    "style-src 'self' 'nonce-%(nonce)s';"
                    "script-src 'self' www.google-analytics.com ajax.googleapis.com 'nonce-%(nonce)s';"
                    "font-src 'self' data:;"                                   # GOV.UK template loads it's fonts with a data URI
                    "block-all-mixed-content;"
                    # "require-sri-for script style;"                   # Desirable, but disabled until browsers implement this
                    "report-uri %(report_uri)s;"
                    )

        app.config.setdefault('CONTENT_SECURITY_POLICY_MODE', 'full')

        # TODOs:

        # Google analytics?
        # Docs
        # Refactor and tidy up

        app.register_blueprint(reporting.reporting, url_prefix='/content-security-policy-report/')

        # If we've got flask_wtf's CSRF protection enabled, we need to exempt the reporting blueprint
        try:
            csrf = app.extensions['csrf']
        except KeyError:
            # If the CSRF extension isn't enabled just carry on
            pass
        else:
            csrf.exempt(reporting.reporting)

        @app.after_request
        def after_request(response):
            csp = self.csp % {
                'report_uri': url_for('reporting.report', trace_id=g.trace_id),
                'nonce': g.csp_nonce
            }
            if app.config['CONTENT_SECURITY_POLICY_MODE'] == 'report-only':
                response.headers['Content-Security-Policy-Report-Only'] = csp
            else:
                response.headers['Content-Security-Policy'] = csp

            return response

        @app.before_request
        def before_request():
            g.csp_nonce = b64encode(urandom(32)).decode('utf-8')
