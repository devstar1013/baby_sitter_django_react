from django.contrib.auth.models import User

import time
from datastore.models.registrations import Registration
from datastore.drivers import registrations as driver_registrations

from datastore.models.watches import Watch
from datastore.models.sessions import Session

from shared import errors, keys

def load_watches(from_number):
    watch_list = [-1]
    watches = Watch.objects.all().filter (from_id = from_number)
    for watch in list(watches):
        if watch.friend_id not in watch_list:
            watch_list.append ( watch.friend_id)
    user_data = driver_registrations.load_users_by_id_list ( watch_list)
    return user_data

def is_in_watches(from_number, friend_number):
    watches = Watch.objects.all().filter (from_id = from_number).filter ( friend_id = friend_number)
    return ( len(list(watches)) > 0)

def save_watch(data):

    session_key = data[keys.SESSION]

    session = Session.objects.get(key=session_key)
    user = User.objects.get(username=session.user)

    from_id = user.id
    friend_id = data[keys.NUMBER_FRIEND]
    post_time = int(time.time() * 1000)

    watch = Watch()
    watch.from_id = from_id
    watch.friend_id = friend_id
    watch.enabled = True
    watch.post_time = post_time
    watch.save()

    watch_data = {
        keys.NUMBER_WATCH: watch.id,
        keys.ERROR_CODE: errors.ERROR_NONE,
    }
    return watch_data
