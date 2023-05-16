from django.contrib.auth.models import User

from datetime import datetime

from datastore.models.jobs import Job
from datastore.models.registrations import Registration
from datastore.models.sessions import Session

from shared import errors, keys



def single_job(job):
    

    number_job = job.id
    title = job.title
    description = job.description
    time_a = job.time_a
    time_b = job.time_b

    from_id = job.from_id
    job_user = Registration.objects.get(user_number=from_id)
    job_user_type = job_user.registration_type
    job_user_loc = job_user.loc


    data = {
        keys.NUMBER_JOB: number_job,
        keys.TITLE: title,
        keys.DESCRIPTION: description,
        keys.TIME_A: time_a,
        keys.TIME_B: time_b,
        keys.REGISTRATION_TYPE: job_user_type,
        keys.NUMBER_USER: job_user.user_number,
        keys.USERNAME: job_user.username,
        keys.AGE:job_user.age,
        keys.LOCATION:job_user_loc
    }

    return data

def jobs_array(jobs):

    array = []
    for job in list(jobs):

        data = single_job(job)
        array.append(data)

    return array

def load_single_job(job_number):

    job = Job.objects.get(id=job_number)
    return single_job(job)

def load_all_jobs():

    all_jobs = Job.objects.all().filter(enabled=True)
    all_data = jobs_array(all_jobs)
    return all_data

def load_user_jobs(from_number):

    user_jobs = Job.objects.all().filter(from_id=from_number)
    user_data = jobs_array(user_jobs)
    return user_data

def load_jobs(from_number=None):

    if from_number is not None:
        return load_user_jobs(from_number)

    return load_all_jobs()

def save_job(data):

    session_key = data[keys.SESSION]

    session = Session.objects.get(key=session_key)
    user = User.objects.get(username=session.user)
    registration = Registration.objects.get(user_number=user.id)
    registration_type = registration.registration_type

    title = data[keys.TITLE]
    description = data[keys.DESCRIPTION]
    time_a = data[keys.TIME_A]
    print ( time_a)
    time_b = data[keys.TIME_B]
    from_id = user.id
    post_time = datetime.now().strftime("%Y-%m-%d %H-%M")
    print ( post_time)

    job = Job()
    job.title = title
    job.description = description
    job.time_a = time_a
    job.time_b = time_b
    job.from_id = from_id
    job.user_type = registration_type
    job.enabled = True
    job.post_time = post_time
    job.save()
    print ( 'Saving job...')

    job_data = {
        keys.NUMBER_JOB: job.id,
        keys.ERROR_CODE: errors.ERROR_NONE,
    }
    print ( job_data)
    return job_data

def filter_jobs(check_family, check_sitter):
    job_data = Job.objects.all()
    if check_family == 'false':
        job_data = job_data.filter(user_type = 1)
    if check_sitter == 'false':
        job_data = job_data.filter(user_type = 2)
    job_data = jobs_array(job_data)
    return job_data
