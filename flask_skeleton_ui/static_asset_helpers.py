from flask import current_app
from flask import request
from flask import url_for
from flask_compress import Compress
import os
from werkzeug.contrib.cache import FileSystemCache


def gzip(app):
    """Gzip compression with Flask-Compress

    Flask-Compress is used to gzip CSS and JS responses.
    To avoid doing this on every request, the responses are cached in memory.
    """
    app.config['COMPRESS_MIMETYPES'] = ['text/css', 'application/javascript']
    app.config['COMPRESS_CACHE_BACKEND'] = gzip_cache
    app.config['COMPRESS_CACHE_KEY'] = gzip_cache_key
    Compress(app)


def gzip_cache():
    """Set up a caching system for the gzipped assets"""
    cache = FileSystemCache(cache_dir='.asset-cache')
    cache.clear()
    return cache


def gzip_cache_key(response):
    """Gzip cache key"""
    return request.path + response.headers['ETag']


def dated_url_for(endpoint, **values):
    """Cachebusting

    Use the last updated timestamp from the file on disk to perform cachebusting duties.
    This forces browsers to download new versions of files when they change.
    """
    if endpoint == 'static':
        filename = values.get('filename', None)

        if filename:
            file_path = os.path.join(current_app.root_path, current_app.static_folder, filename)

            values['cache'] = int(os.stat(file_path).st_mtime)

    return url_for(endpoint, **values)
