from django.conf import settings
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
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

        #if request.method != 'POST':
            #return error_handler(request)

        data = json.load(request)
        session_key = data[keys.SESSION]

        success = driver_sessions.destroy_session(session_key)
        if success:

            data = {
                keys.ERROR_CODE: errors.ERROR_NONE,
            }

            return JsonResponse(data)

        return error_handler(request)

    except Exception as ex:
        print(f'exception: { ex }')
        return error_handler(request)
