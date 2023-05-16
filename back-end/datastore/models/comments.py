from django.db import models

class Comment(models.Model):
    job_id = models.IntegerField()
    from_id = models.IntegerField()
    description = models.TextField()
    enabled = models.BooleanField()
    post_time = models.BigIntegerField()
    
