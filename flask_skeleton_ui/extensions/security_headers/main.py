class SecurityHeaders(object):
    """Set some security related headers

    See https://www.owasp.org/index.php/OWASP_Secure_Headers_Project#tab=Headers
    """

    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):

        @app.after_request
        def security_headers(response):
            response.headers['X-Frame-Options'] = 'DENY'
            response.headers['Strict-Transport-Security'] = 'max-age=31536000'  # 1 year
            response.headers['X-XSS-Protection'] = '1; mode=block'
            response.headers['X-Content-Type-Options'] = 'nosniff'

            return response
