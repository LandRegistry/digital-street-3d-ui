# Set the base image to the base image

FROM hmlandregistry/dev_base_python_flask:4


RUN yum install -y -q libffi-devel

# Using SQLAlchemy/Postgres?
# See how the required env vars are set here:
# http://192.168.249.38/gadgets/gadget-api/blob/master/Dockerfile

# ----
# Put your app-specific stuff here (extra yum installs etc).
# Any unique environment variables your config.py needs should also be added as ENV entries here

ENV APP_NAME=flask-skeleton-ui
ENV MAX_HEALTH_CASCADE=6
ENV SECRET_KEY='ABC'

# ----

# Get the python environment ready.
ADD requirements_test.txt requirements_test.txt
ADD requirements.txt requirements.txt
RUN pip3 install -q -r requirements.txt && \
  pip3 install -q -r requirements_test.txt

CMD ["./run.sh"]

