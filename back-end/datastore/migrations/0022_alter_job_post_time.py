# Generated by Django 4.0.6 on 2022-07-21 10:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('datastore', '0021_alter_job_time_a_alter_job_time_b'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='post_time',
            field=models.TextField(),
        ),
    ]
