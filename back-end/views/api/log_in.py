from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import reverse

import json

from datastore.drivers import sessions as driver_sessions

from shared import errors, keys

def error_handler(request):

    data = {
        keys.ERROR_CODE: errors.ERROR_GENERIC,
    }

    return JsonResponse(data)

def request_handler(request):

    try:
        if request.method != 'POST':
            return error_handler(request)

        for key in request.session.keys():
            del request.session[key]

        data = json.load(request)
        session_data = driver_sessions.log_in(request, data)
        if session_data is not None:
            return JsonResponse(session_data)

        return error_handler(request)

    except Exception as ex:
        return error_handler(request)
