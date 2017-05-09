from flask_skeleton_ui.landregistry_flask import LandRegistryFlask

app = LandRegistryFlask(__name__,
                        template_folder='templates',
                        static_folder='assets/dist',
                        static_url_path='/static'
                        )

app.config.from_pyfile("config.py")
