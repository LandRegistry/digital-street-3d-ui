# Set the base image to the base image
FROM hmlandregistry/dev_base_python_flask:3

VOLUME /tmp

RUN curl -SLO "https://nodejs.org/dist/v8.1.1/node-v8.1.1-linux-x64.tar.xz" && \
tar -xJf "node-v8.1.1-linux-x64.tar.xz" -C /usr/local --strip-components=1 && \
ln -s /usr/local/bin/node /usr/local/bin/nodejs

# Using SQLAlchemy/Postgres?
# See how the required env vars are set here:
# http://192.168.249.38/gadgets/gadget-api/blob/master/Dockerfile

# ----
# Put your app-specific stuff here (extra yum installs etc).
# Any unique environment variables your config.py needs should also be added as ENV entries here

ENV APP_NAME=flask-skeleton-ui
ENV MAX_HEALTH_CASCADE 6

# ----

# Get the python environment ready.
ADD requirements_test.txt requirements_test.txt
ADD requirements.txt requirements.txt
RUN pip3 install -q -r requirements.txt && \
  pip3 install -q -r requirements_test.txt

# Install node modules
ADD package*.json ./
RUN rm -rf node_modules/* && \
npm install

# Add various files that the Gulp build task needs
ADD flask_skeleton_ui/assets/src flask_skeleton_ui/assets/src
ADD check-node-version.js check-node-version.js
ADD browserslist browserslist
ADD Gulpfile.js Gulpfile.js

# Run the gulp build task
# We copy the resulting output into a temporary directory since the filesystem at this point is transitory
# This temporary folder will be copied back in the run CMD
RUN npm run build && \
rm -rf /tmp/flask-skeleton-ui && \
mkdir -p /tmp/flask-skeleton-ui/flask_skeleton_ui/assets/dist && \
cp package-lock.json /tmp/flask-skeleton-ui/package-lock.json | true && \
cp -r flask_skeleton_ui/assets/dist/* /tmp/flask-skeleton-ui/flask_skeleton_ui/assets/dist

CMD ["./run.sh"]

