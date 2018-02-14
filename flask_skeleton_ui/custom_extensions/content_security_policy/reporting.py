import json
import logging
from flask import Blueprint
from flask import request


reporting = Blueprint('reporting', __name__)
logger = logging.getLogger('content_security_policy')


@reporting.route("/", methods=['POST'])
def report():
    data = json.loads(request.data.decode('utf-8'))
    csp_report = data['csp-report']

    logger.info('CSP violation', extra={
        'content_security_policy_report': csp_report
    })

    return '', 204
