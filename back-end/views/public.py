from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import redirect
from django.urls import reverse
import os

PUBLIC_ROOT = os.path.join(settings.BASE_DIR, 'public')

PUBLIC_PATHS = {
    '/': 'index.html',
    '/asset-manifest.json': 'asset-manifest.json',
    '/favicon.ico': 'favicon.ico',
    '/index.htm': 'index.html',
    '/index.html': 'index.html',
    '/manifest.json': 'manifest.json',
    '/logo192.png': 'logo192.png',
    '/logo512.png': 'logo512.png',
    '/robots.txt': 'robots.txt',
}

PUBLIC_HEADERS = {
    'asset-manifest.json': {
        'Content-Type': 'application/json',
    },
    'favicon.ico': {
        'Content-Type': 'image/x-icon',
    },
    'index.html': {
        'Content-Type': 'text/html;charset=UTF-8',
    },
    'manifest.json': {
        'Content-Type': 'application/json',
    },
    'logo192.png': {
        'Content-Type': 'image/png',
    },
    'logo512.png': {
        'Content-Type': 'image/png',
    },
    'robots.txt': {
        'Content-Type': 'text/plain;charset=UTF-8',
    },
}

PUBLIC_BLOBS = {}

for file_name in PUBLIC_HEADERS.keys():
    file_path = os.path.join(PUBLIC_ROOT, file_name)
    file_blob = open(file_path, 'rb').read()
    PUBLIC_BLOBS[file_name] = file_blob

DEFAULT_FILE_NAME = 'index.html'

def request_handler(request):

    file_name = PUBLIC_PATHS.get(request.path, DEFAULT_FILE_NAME)
    file_blob = PUBLIC_BLOBS[file_name]
    file_header = PUBLIC_HEADERS
    return HttpResponse(file_blob, headers=file_header)
