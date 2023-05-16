from django.conf import settings
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import reverse

import json

from datastore.drivers import registrations as driver_regs
from datastore.drivers import jobs as driver_jobs

from shared import errors, keys

def error_handler(request):

    data = {
        keys.ERROR_CODE: errors.ERROR_GENERIC,
    }

    return JsonResponse(data, safe=False)

def get_sitters_handler(request):
    check_age = request.GET.get(keys.CHECK_AGE, None)
    check_gender = request.GET.get(keys.CHECK_GENDER, None)
    check_skill = request.GET.get(keys.CHECK_SKILL, None)
    min_age = (int)(request.GET.get(keys.MIN_AGE, None))
    max_age = (int)(request.GET.get(keys.MAX_AGE, None))
    gender = (int)(request.GET.get(keys.GENDER, None))
    skill = (int)(request.GET.get(keys.SKILL, None))

    sitter_data = driver_regs.filter_sitters(check_age, min_age, max_age, check_gender, gender, check_skill, skill)
    return JsonResponse(sitter_data, safe=False)

def get_jobs_handler(request):
    check_family = request.GET.get(keys.CHECK_FAMILY, None)
    check_sitter = request.GET.get(keys.CHECK_SITTER, None)

    job_data = driver_jobs.filter_jobs(check_family, check_sitter)
    return JsonResponse(job_data, safe=False)

def get_parents_handler(request):
    check_children = request.GET.get(keys.CHECK_CHILDREN, None)
    num_of_children = (int)(request.GET.get(keys.NUM_OF_CHILDREN, None))

    sitter_data = driver_regs.filter_parents(check_children, num_of_children)
    return JsonResponse(sitter_data, safe=False)


def request_sitters_handler(request):
    try:

        if request.method == 'GET':
            return get_sitters_handler(request)

    except Exception as ex:
        return error_handler(request)

def request_jobs_handler(request):
    try:

        if request.method == 'GET':
            return get_jobs_handler(request)

    except Exception as ex:
        return error_handler(request)

def request_parents_handler(request):
    try:

        if request.method == 'GET':
            return get_parents_handler(request)

    except Exception as ex:
        return error_handler(request)
