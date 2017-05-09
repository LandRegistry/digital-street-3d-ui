from flask_skeleton_ui.extensions.cachebust_static_assets.main import CachebustStaticAssets
from flask_skeleton_ui.extensions.enhanced_logging.main import EnhancedLogging
from flask_skeleton_ui.extensions.gzip_static_assets.main import GzipStaticAssets


# Create empty extension objects here
cachebust_static_assets = CachebustStaticAssets()
enhanced_logging = EnhancedLogging()
gzip_static_assets = GzipStaticAssets()


def register_extensions(app):
    """Adds any previously created extension objects into the app, and does any further setup they need."""
    enhanced_logging.init_app(app)

    cachebust_static_assets.init_app(app)

    gzip_static_assets.init_app(app)

    # All done!
    app.logger.info("Extensions registered")
