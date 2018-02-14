from flask_skeleton_ui.custom_extensions.content_security_policy import reporting


class ContentSecurityPolicy(object):
    """Content security policy

    See https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
    """

    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):

        self.csp = ("default-src 'self';"
                    "script-src 'self' %(script_src_hashes)s;"
                    "report-uri /content-security-policy-report/"
                    )

        app.config.setdefault('CONTENT_SECURITY_POLICY_SCRIPT_SRC_HASHES', '')
        app.config.setdefault('CONTENT_SECURITY_POLICY_REPORT_ONLY', '')

        # TODOs:
        # More research into what the _right_ policy is
        # Google analytics?
        # Do we need a Jinja macro for outputting script blocks?
        # What to do about inline govuk script? Can we just specify a hash?
        # Use url_for for reporting url or make reporting URL configurable?
        # Decide right balance between csp and csp-report-only. You can even have both...
        # Pass traceid from parent request through to CSP report url? Is that even possible?

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
        def csp_headers(response):
            csp = self.csp % {
                'script_src_hashes': app.config.get('CONTENT_SECURITY_POLICY_SCRIPT_SRC_HASHES')
            }
            # response.headers['Content-Security-Policy'] = csp
            response.headers['Content-Security-Policy-Report-Only'] = csp

            return response
