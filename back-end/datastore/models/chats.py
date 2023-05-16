from django.db import models

class Chat(models.Model):
    application_id = models.IntegerField()

class Message(models.Model):
    chat_id = models.IntegerField()
    author_id = models.IntegerField()
    contents = models.TextField()
