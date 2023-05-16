from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import reverse

import json

from datastore.drivers import chats as driver_chats

from shared import errors, keys

def error_handler(request):

    data = {
        keys.ERROR_CODE: errors.ERROR_GENERIC,
    }

    return JsonResponse(data, safe=False)

def get_handler(request):

    application_number = request.GET.get(keys.NUMBER_APPLICATION, None)
    chat_data = driver_chats.load_chat(application_number)
    return JsonResponse(chat_data, safe=False)

def post_handler(request):
    data = json.load(request)

    driver_chats.save_message(data)

    data = {
        keys.ERROR_CODE: errors.ERROR_NONE,
    }

    return JsonResponse(data)

def request_handler(request):

    try:

        if request.method == 'POST':
            return post_handler(request)

        if request.method == 'GET':
            return get_handler(request)

    except Exception as ex:
        return error_handler(request)
