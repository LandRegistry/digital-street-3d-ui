from flask_skeleton_ui.custom_extensions.cachebust_static_assets import CachebustStaticAssets
from flask_skeleton_ui.custom_extensions.enhanced_logging import EnhancedLogging
from flask_skeleton_ui.custom_extensions.gzip_static_assets import GzipStaticAssets


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
