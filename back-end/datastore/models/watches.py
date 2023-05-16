from django.db import models

class Watch(models.Model):
    friend_id = models.IntegerField()
    from_id = models.IntegerField()
    enabled = models.BooleanField()
    post_time = models.BigIntegerField()
    
