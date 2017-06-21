#!/bin/bash

cp -R /tmp/flask-skeleton-ui/* .    # Copy various pieces generated at build time back into the folder
# rm -rf /tmp/flask-skeleton-ui/*     # And then nuke the temporary build files - we don't want them to overwrite any newly created files every time the app restarts
/usr/bin/gunicorn -k eventlet --pythonpath /src --access-logfile - manage:manager.app --reload
