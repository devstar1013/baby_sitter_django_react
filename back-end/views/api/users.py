from django.conf import settings
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import reverse

import json

from datastore.drivers import registrations as driver_regs

from shared import errors, keys

def error_handler(request):

    data = {
        keys.ERROR_CODE: errors.ERROR_GENERIC,
    }

    return JsonResponse(data, safe=False)

def get_handler(request):
    reg_type = request.GET.get(keys.REGISTRATION_TYPE, None)
    user_number = request.GET.get(keys.NUMBER_USER, None)

    if reg_type is not None:
        sitter_data = driver_regs.load_users ( reg_type)
        return JsonResponse(sitter_data, safe=False)
    if  user_number is not None:
        sitter_data = driver_regs.load_single_user ( user_number)
        return JsonResponse(sitter_data, safe=False)

def post_handler(request):
    data = json.load(request)

    job_data = driver_regs.update_user(data)
    if job_data is not None:
        return JsonResponse(job_data, safe=False)

    return error_handler(request)

def request_handler(request):
    try:

        if request.method == 'POST':
            return post_handler(request)

        if request.method == 'GET':
            return get_handler(request)

    except Exception as ex:
        return error_handler(request)
