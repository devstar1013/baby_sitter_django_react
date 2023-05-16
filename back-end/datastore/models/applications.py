from django.db import models

class Application(models.Model):
    from_id = models.IntegerField()
    job_id = models.IntegerField()
    cover_letter = models.TextField()
