# Generated by Django 4.0.6 on 2022-07-12 02:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('datastore', '0019_alter_job_user_type'),
    ]

    operations = [
        migrations.RenameField(
            model_name='application',
            old_name='babysitter_id',
            new_name='from_id',
        ),
        migrations.RenameField(
            model_name='job',
            old_name='parent_id',
            new_name='from_id',
        ),
    ]
