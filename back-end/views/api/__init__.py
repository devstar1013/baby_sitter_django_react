from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.urls import reverse

from . import apply, chat, jobs, log_in, register, users, reviews, comments, replys, votes, watches, filter

API_ROUTES = {
    '/api/register': register.request_handler,
    '/api/log-in': log_in.request_handler,
    '/api/jobs': jobs.request_handler,
    '/api/chat': chat.request_handler,
    '/api/apply': apply.request_handler,
    '/api/users':users.request_handler,
    '/api/reviews':reviews.request_handler,
    '/api/comments':comments.request_handler,
    '/api/replys':replys.request_handler,
    '/api/votes':votes.request_handler,
    '/api/watches':watches.request_handler,
    '/api/filter_sitters':filter.request_sitters_handler,
    '/api/filter_jobs':filter.request_jobs_handler,
    '/api/filter_parents':filter.request_parents_handler,
}



def request_handler(request):

    route_handler = API_ROUTES.get(request.path, None)
    if route_handler is not None:
        return route_handler(request)
    return None
