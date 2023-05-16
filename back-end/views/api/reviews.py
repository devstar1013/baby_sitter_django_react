from django.conf import settings
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import reverse

import json

from datastore.drivers import reviews as driver_reviews

from shared import errors, keys

def error_handler(request):

    data = {
        keys.ERROR_CODE: errors.ERROR_GENERIC,
    }

    return JsonResponse(data, safe=False)

def get_handler(request):

    to_number = request.GET.get(keys.NUMBER_TO, None)
    review_number = request.GET.get(keys.NUMBER_REVIEW, None)
    if to_number is not None:
        reviews_data = driver_reviews.load_reviews(to_number)
        return JsonResponse(reviews_data, safe=False)

    if review_number is not None:
        review_data = driver_reviews.load_single_review(review_number)
        return JsonResponse(review_data, safe=False)

    all_data = driver_reviews.load_reviews()
    return JsonResponse(all_data, safe=False)

def post_handler(request):
    data = json.load(request)
    review_data = driver_reviews.save_review(data)
    if review_data is not None:
        return JsonResponse(review_data, safe=False)

    return error_handler(request)

def request_handler(request):

    try:

        if request.method == 'POST':
            return post_handler(request)

        if request.method == 'GET':
            return get_handler(request)

    except Exception as ex:
        return error_handler(request)
