from django.db import models

class Reply(models.Model):
    comment_id = models.IntegerField()
    from_id = models.IntegerField()
    description = models.TextField()
    enabled = models.BooleanField()
    post_time = models.BigIntegerField()
    
