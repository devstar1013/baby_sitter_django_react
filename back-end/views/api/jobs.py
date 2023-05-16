from django.conf import settings
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import reverse

import json

from datastore.drivers import jobs as driver_jobs

from shared import errors, keys

def error_handler(request):

    data = {
        keys.ERROR_CODE: errors.ERROR_GENERIC,
    }

    return JsonResponse(data, safe=False)

def get_handler(request):

    parent_number = request.GET.get(keys.NUMBER_PARENT, None)
    job_number = request.GET.get(keys.NUMBER_JOB, None)

    if parent_number is not None:
        jobs_data = driver_jobs.load_jobs(parent_number)
        return JsonResponse(jobs_data, safe=False)

    if job_number is not None:
        job_data = driver_jobs.load_single_job(job_number)
        return JsonResponse(job_data, safe=False)

    all_data = driver_jobs.load_jobs()
    return JsonResponse(all_data, safe=False)

def post_handler(request):
    data = json.load(request)

    job_data = driver_jobs.save_job(data)
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
