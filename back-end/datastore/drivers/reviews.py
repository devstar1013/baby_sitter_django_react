from django.contrib.auth.models import User

import time
from datastore.models.registrations import Registration

from datastore.models.reviews import Review
from datastore.models.sessions import Session

from datastore.drivers import registrations as driver_registrations

from shared import errors, keys

def single_review(review:Review):

    number_review = review.id
    number_from = review.from_id
    number_to = review.to_id
    rating = review.rating
    description = review.description
    post_time = review.post_time

    user_from:Registration = driver_registrations.load_single_user(number_from)
    

    data = {
        keys.NUMBER_REVIEW: number_review,
        keys.NUMBER_FROM: number_from,
        keys.NUMBER_TO: number_to,
        keys.RATING:rating,
        keys.DESCRIPTION: description,
        keys.POST_TIME: post_time,
        keys.NAME_FROM:user_from['username']
    }
    return data

def reviews_array(reviews):

    array = []
    for review in list(reviews):

        data = single_review(review)
        array.append(data)
    return array

def load_single_review(review_number):

    review = Review.objects.get(id=review_number)
    return single_review(review)

def load_all_reviews():

    all_reviews = Review.objects.all().filter(enabled=True)
    all_data = reviews_array(all_reviews)
    return all_data

def load_reviews(to_number=None):
    if to_number is not None:
        all_reviews = Review.objects.all().filter(to_id = to_number)
        all_data = reviews_array(all_reviews)
        return all_data

    return load_all_reviews()

def save_review(data):

    session_key = data[keys.SESSION]

    session = Session.objects.get(key=session_key)
    user = User.objects.get(username=session.user)

    from_id = user.id
    to_id = data[keys.NUMBER_TO]
    existing_reviews = Review.objects.all().filter(to_id = to_id).filter(from_id = from_id)
    if len ( list(existing_reviews)) > 0:
        review_data = {
            keys.ERROR_CODE: errors.ERROR_OTHER
        }
        return review_data

    rating = data[keys.RATING]
    description = data[keys.DESCRIPTION]
    post_time = int(time.time() * 1000)

    review = Review()
    review.from_id = from_id
    review.to_id = to_id
    review.rating = rating
    review.description = description
    review.enabled = True
    review.post_time = post_time
    review.save()

    review_data = {
        keys.NUMBER_REVIEW: review.id,
        keys.ERROR_CODE: errors.ERROR_NONE,
    }

    return review_data
