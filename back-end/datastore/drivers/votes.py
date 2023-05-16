from django.contrib.auth.models import User

import time
from datastore.models.registrations import Registration

from datastore.models.votes import Vote
from datastore.models.sessions import Session

from shared import errors, keys

def get_votes_len(job_number, from_number=None):
    if from_number is not None:
        vote = Vote.objects.all().filter(job_id = job_number).filter(from_id = from_number)
        return len ( list(vote))
    votes = Vote.objects.all().filter(job_id = job_number)
    return len ( list(votes))

def load_votes(job_number, number_from):

    votes_all_len = get_votes_len ( job_number)
    votes_user_len = get_votes_len ( job_number, number_from)

    data = {
        keys.VOTES_ALL_LEN : votes_all_len,
        keys.VOTES_USER_LEN : votes_user_len
    }

    return data



def save_vote(data):

    session_key = data[keys.SESSION]

    session = Session.objects.get(key=session_key)
    user = User.objects.get(username=session.user)

    from_id = user.id
    job_id = data[keys.NUMBER_JOB]
    post_time = int(time.time() * 1000)

    vote = Vote()
    vote.from_id = from_id
    vote.job_id = job_id
    vote.enabled = True
    vote.post_time = post_time
    vote.save()

    vote_data = {
        keys.NUMBER_VOTE: vote.id,
        keys.ERROR_CODE: errors.ERROR_NONE,
    }
    return vote_data
