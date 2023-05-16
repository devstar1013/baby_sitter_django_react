from django.contrib.auth.models import User

import time

from datastore.models.replys import Reply
from datastore.models.registrations import Registration
from datastore.models.sessions import Session

from datastore.drivers import registrations as driver_registrations

from shared import errors, keys

def single_reply(reply:Reply):

    number_reply = reply.id
    number_from = reply.from_id
    number_comment = reply.comment_id
    description = reply.description
    post_time = reply.post_time

    user_from:Registration = driver_registrations.load_single_user(number_from)
    

    data = {
        keys.NUMBER_REPLY: number_reply,
        keys.NUMBER_FROM: number_from,
        keys.NUMBER_COMMENT: number_comment,
        keys.DESCRIPTION: description,
        keys.POST_TIME: post_time,
        keys.NAME_FROM:user_from['username']
    }
    return data

def replys_array(replys):

    array = []
    for reply in list(replys):

        data = single_reply(reply)
        array.append(data)
    return array

def load_single_reply(reply_number):

    reply = Reply.objects.get(id=reply_number)
    return single_reply(reply)

def load_all_replys():

    all_replys = Reply.objects.all().filter(enabled=True)
    all_data = replys_array(all_replys)
    return all_data

def load_replys(number_comment=None):
    if number_comment is not None:
        all_replys = Reply.objects.all().filter(comment_id = number_comment)
        all_data = replys_array(all_replys)
        return all_data

    return load_all_replys()

def save_reply(data):

    session_key = data[keys.SESSION]

    session = Session.objects.get(key=session_key)
    user = User.objects.get(username=session.user)

    from_id = user.id
    comment_id = data[keys.NUMBER_COMMENT]
    description = data[keys.DESCRIPTION]
    post_time = int(time.time() * 1000)

    reply = Reply()
    reply.from_id = from_id
    reply.comment_id = comment_id
    reply.description = description
    reply.enabled = True
    reply.post_time = post_time
    reply.save()

    reply_data = {
        keys.NUMBER_REPLY: reply.id,
        keys.ERROR_CODE: errors.ERROR_NONE,
    }

    return reply_data
