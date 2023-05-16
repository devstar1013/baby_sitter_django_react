from django.contrib.auth.models import User

from datastore.models.applications import Application
from datastore.models.registrations import Registration
from datastore.models.chats import Chat, Message
from datastore.models.jobs import Job

from shared import errors, keys

def existing_chat(application_id):

    chat_entry = None

    try:

        chat_entry = Chat.objects.get(application_id=application_id)

    except Chat.DoesNotExist:
        pass

    return chat_entry

def find_chat(application_id):

    chat_entry = None

    try:

        chat_entry = Chat.objects.get(application_id=application_id)

    except Chat.DoesNotExist:

        chat_entry = Chat()
        chat_entry.application_id = application_id
        chat_entry.save()

    return chat_entry

def single_message(message):

    number_author = message.author_id
    contents = message.contents

    data = {
        keys.NUMBER_AUTHOR: number_author,
        keys.CONTENTS: contents,
    }

    return data

def save_message(data):

    chat_id = data[keys.NUMBER_CHAT]
    author_id = data[keys.NUMBER_AUTHOR]
    contents = data[keys.CONTENTS]

    chat_entry = Chat.objects.get(id=chat_id)

    message = Message()
    message.chat_id = chat_id
    message.author_id = author_id
    message.contents = contents
    message.save()

def load_chat(application_id):

    chat_entry = find_chat(application_id)

    application_id = chat_entry.application_id
    application = Application.objects.get(id=application_id)

    job_id = application.job_id
    job = Job.objects.get(id=job_id)

    from_id = application.from_id
    app_user = Registration.objects.get(user_number = from_id)

    title = job.title

    chat_id = chat_entry.id
    messages = Message.objects.all().filter(chat_id=chat_id)
    messages = [single_message(x) for x in messages]

    data = {
        keys.ERROR_CODE: errors.ERROR_NONE,
        keys.NUMBER_CHAT: chat_id,
        keys.TITLE: title,
        keys.MESSAGES: messages,
        keys.NUMBER_FROM: from_id,
        keys.USERNAME: app_user.username
    }

    return data
