from django.conf import settings
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import reverse

import json

from datastore.drivers import registrations as driver_registrations

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

        img_file = request.FILES["img_file"]
        data =  request.POST['data']
        data = json.loads(data)
        data = driver_registrations.create_registration(data, img_file)

        return JsonResponse(data)

    except Exception as ex:
        print(f'exception: {ex}')
        return error_handler(request)
