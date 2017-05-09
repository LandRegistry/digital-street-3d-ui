from flask import current_app
from flask import url_for
import os


cache_busting_values = {}


class Cachebusting(object):

    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):

        @app.context_processor
        def override_url_for():
            return dict(url_for=dated_url_for)


def dated_url_for(endpoint, **values):

    """Cachebusting

    Use the last updated timestamp from the file on disk to perform cachebusting duties.
    This forces browsers to download new versions of files when they change.
    """
    if endpoint == 'static':
        filename = values.get('filename', None)

        if filename:
            file_path = os.path.join(current_app.root_path, current_app.static_folder, filename)

            # Store the last changed timestamp in a dict so that on subsequent
            # requests we don't have to hit the disk to stat the file
            cached_last_changed = cache_busting_values.get(file_path)

            if cached_last_changed:
                values['cache'] = cached_last_changed
            else:
                last_changed = int(os.stat(file_path).st_mtime)
                cache_busting_values[file_path] = last_changed
                values['cache'] = last_changed

    return url_for(endpoint, **values)
