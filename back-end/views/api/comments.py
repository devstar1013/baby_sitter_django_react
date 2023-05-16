from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import reverse

import json

from datastore.drivers import comments as driver_comments

from shared import errors, keys

def error_handler(request):

    data = {
        keys.ERROR_CODE: errors.ERROR_GENERIC,
    }

    return JsonResponse(data, safe=False)

def get_handler(request):

    job_number = request.GET.get(keys.NUMBER_JOB, None)
    all_data = driver_comments.load_comments(job_number)
    return JsonResponse(all_data, safe=False)

def post_handler(request):
    data = json.load(request)

    job_data = driver_comments.save_comment(data)
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
