#!/bin/bash

/usr/bin/gunicorn -k eventlet --pythonpath /src --access-logfile - manage:manager.app --reload
