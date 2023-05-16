from django.db import models

class Review(models.Model):
    to_id = models.IntegerField()
    from_id = models.IntegerField()
    rating = models.IntegerField()
    description = models.TextField()
    enabled = models.BooleanField()
    post_time = models.BigIntegerField()
    
