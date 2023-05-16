from django.contrib.auth.models import User

import time

from datastore.models.comments import Comment
from datastore.models.registrations import Registration
from datastore.models.sessions import Session

from datastore.drivers import registrations as driver_registrations
from datastore.drivers import replys as driver_replys

from shared import errors, keys

def single_comment(comment:Comment):

    number_comment = comment.id
    number_from = comment.from_id
    number_job = comment.job_id
    description = comment.description
    post_time = comment.post_time

    user_from:Registration = driver_registrations.load_single_user(number_from)
    
    replys = driver_replys.load_replys ( number_comment)

    data = {
        keys.NUMBER_COMMENT: number_comment,
        keys.NUMBER_FROM: number_from,
        keys.NUMBER_JOB: number_job,
        keys.DESCRIPTION: description,
        keys.POST_TIME: post_time,
        keys.NAME_FROM:user_from['username'],
        keys.REPLYS: replys
    }
    return data

def comments_array(comments):

    array = []
    for comment in list(comments):

        data = single_comment(comment)
        array.append(data)
    return array

def load_single_comment(comment_number):

    comment = Comment.objects.get(id=comment_number)
    return single_comment(comment)

def load_all_comments():

    all_comments = Comment.objects.all().filter(enabled=True)
    all_data = comments_array(all_comments)
    return all_data

def load_comments(number_job=None):
    if number_job is not None:
        all_comments = Comment.objects.all().filter(job_id = number_job)
        all_data = comments_array(all_comments)
        return all_data

    return load_all_comments()

def save_comment(data):

    session_key = data[keys.SESSION]

    session = Session.objects.get(key=session_key)
    user = User.objects.get(username=session.user)

    from_id = user.id
    job_id = data[keys.NUMBER_JOB]
    description = data[keys.DESCRIPTION]
    post_time = int(time.time() * 1000)

    comment = Comment()
    comment.from_id = from_id
    comment.job_id = job_id
    comment.description = description
    comment.enabled = True
    comment.post_time = post_time
    comment.save()

    comment_data = {
        keys.NUMBER_COMMENT: comment.id,
        keys.ERROR_CODE: errors.ERROR_NONE,
    }

    return comment_data
