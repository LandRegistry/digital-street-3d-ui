#!/bin/bash

cp /tmp/package-lock.json .   # Copy the package-lock.json file generated at build time back into the app so that it appears outside the container ready to be committed into Git
make build
/usr/bin/gunicorn -k eventlet --pythonpath /src --access-logfile - manage:manager.app --reload
