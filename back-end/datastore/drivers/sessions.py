from django.contrib.auth import authenticate
from django.contrib.sessions.backends.db import SessionStore

from datastore.drivers import registrations as driver_registrations

from datastore.models.registrations import Registration
from datastore.models.sessions import Session

from shared import errors, keys

session_store = SessionStore()

def create_session(user):
    session_store.create()
    key = session_store.session_key

    session = Session()
    session.user = user
    session.key = key
    session.save()

    return key

def log_in(request, data):
    username = data[keys.USERNAME]
    password = data[keys.PASSWORD]

    user = authenticate(request, username=username, password=password)
    if user is not None:
        session_key = create_session(username)
        registration = Registration.objects.get(user_number=user.id)
        registration_type = registration.registration_type
        registration_label = driver_registrations.LABELS[registration_type]
        number_user = user.id

        data = {
            keys.ERROR_CODE: errors.ERROR_NONE,
            keys.FIRST_NAME: user.first_name,
            keys.LAST_NAME: user.last_name,
            keys.SESSION: session_key,
            keys.USERNAME: user.username,
            keys.REGISTRATION_TYPE: registration_label,
            keys.NUMBER_USER: number_user,
        }

        return data

    return None
