from flask_script import Manager
from digital_street_3d_ui.main import app
import os


manager = Manager(app)


@manager.command
def runserver(port=9996):
    """Run the app using flask server"""

    os.environ["PYTHONUNBUFFERED"] = "yes"
    os.environ["LOG_LEVEL"] = "DEBUG"
    os.environ["COMMIT"] = "LOCAL"

    app.run(port=int(port), ssl_context=('/supporting-files/ssl.cert', '/supporting-files/ssl.key'))


if __name__ == "__main__":
    manager.run()
