from django.db import models

class Vote(models.Model):
    job_id = models.IntegerField()
    from_id = models.IntegerField()
    enabled = models.BooleanField()
    post_time = models.BigIntegerField()
    
