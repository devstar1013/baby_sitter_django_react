# Generated by Django 3.2.5 on 2022-06-08 17:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('datastore', '0007_remove_chat_parent_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chat',
            name='babysitter_id',
        ),
        migrations.AddField(
            model_name='message',
            name='author_id',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
