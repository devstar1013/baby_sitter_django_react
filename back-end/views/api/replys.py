from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import reverse

import json

from datastore.drivers import replys as driver_replys

from shared import errors, keys

def error_handler(request):

    data = {
        keys.ERROR_CODE: errors.ERROR_GENERIC,
    }

    return JsonResponse(data, safe=False)

def get_handler(request):

    comment_number = request.GET.get(keys.NUMBER_COMMENT, None)
    all_data = driver_replys.load_replys(comment_number)
    return JsonResponse(all_data, safe=False)

def post_handler(request):
    data = json.load(request)

    reply_data = driver_replys.save_reply(data)
    if reply_data is not None:
        return JsonResponse(reply_data, safe=False)

    return error_handler(request)

def request_handler(request):

    try:

        if request.method == 'POST':
            return post_handler(request)

        if request.method == 'GET':
            return get_handler(request)

    except Exception as ex:
        return error_handler(request)
