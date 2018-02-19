# Set the base image to the base image

FROM hmlandregistry/dev_base_python_flask:4

RUN yum install -y -q libffi-devel

RUN curl -SLO "https://nodejs.org/dist/v8.9.4/node-v8.9.4-linux-x64.tar.xz" && \
tar -xJf "node-v8.9.4-linux-x64.tar.xz" -C /usr/local --strip-components=1 && \
ln -s /usr/local/bin/node /usr/local/bin/nodejs && \
rm "node-v8.9.4-linux-x64.tar.xz"


# Using SQLAlchemy/Postgres?
# See how the required env vars are set here:
# http://192.168.249.38/gadgets/gadget-api/blob/master/Dockerfile


# Get the python environment ready.
ADD requirements_test.txt requirements_test.txt
ADD requirements.txt requirements.txt
RUN pip3 install -q -r requirements.txt && \
  pip3 install -q -r requirements_test.txt


# Install node modules
# These are installed outside of the mounted volume and nodejs is instructed to look for them by setting NODE_PATH / PATH
# This is to avoid the fact that the volume will wipe out anything that gets added when the container is being built
ENV NODE_PATH='/node_modules/flask-skeleton-ui/node_modules' \
  PATH="/node_modules/flask-skeleton-ui/node_modules/.bin:${PATH}" \
  NODE_ENV='production' \
  NPM_CONFIG_PRODUCTION='false'
ADD package*.json /node_modules/flask-skeleton-ui/
RUN cd /node_modules/flask-skeleton-ui \
  && npm install


# Put your app-specific stuff here (extra yum installs etc).
# Any unique environment variables your config.py needs should also be added as ENV entries here
ENV APP_NAME=flask-skeleton-ui \
  MAX_HEALTH_CASCADE=6 \
  LOG_LEVEL=DEBUG \
  SECRET_KEY='ABC' \
  FLASK_DEBUG=1

CMD ["./run.sh"]

