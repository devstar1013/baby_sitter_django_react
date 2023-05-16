from django.db import models

class Registration(models.Model):
    #common information
    user_number = models.IntegerField(primary_key=True)
    registration_type = models.IntegerField()
    username = models.TextField()

    loc = models.TextField()
    short_info = models.TextField()
    rating = models.FloatField()
    #information for babby sitter
    age = models.IntegerField()
    gender = models.IntegerField()
    exp_years = models.IntegerField()
    price = models.IntegerField()
    education = models.TextField()
    
    child_care = models.IntegerField() #skills
    school_help = models.IntegerField()
    #information for parrents
    num_of_children = models.IntegerField()


