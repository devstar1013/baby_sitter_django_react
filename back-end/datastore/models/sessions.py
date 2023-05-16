from django.db import models

class Session(models.Model):
    user = models.TextField()
    key = models.TextField()