from django.conf import settings
from django.conf.urls.static import static
from django.urls import re_path

from shared import names, routes
from views import api, public

VIEW_API_DISPATCHER = api.request_handler
VIEW_GENERAL_REDIRECTOR = public.request_handler

PATH_GENERAL_REDIRECTOR = re_path(
    routes.GENERAL_REDIRECTOR,
    VIEW_GENERAL_REDIRECTOR,
    name=names.GENERAL_REDIRECTOR,
)

PATH_API_DISPATCHER = re_path(
    routes.API_DISPATCHER,
    VIEW_API_DISPATCHER,
    name=names.API_DISPATCHER,
)

static_urlpatterns = static(
    settings.STATIC_URL,
    document_root=settings.STATIC_ROOT
)

base_urlpatterns = [
    PATH_API_DISPATCHER,
    PATH_GENERAL_REDIRECTOR,
]

urlpatterns = []

urlpatterns.extend(static_urlpatterns)
urlpatterns.extend(base_urlpatterns)
