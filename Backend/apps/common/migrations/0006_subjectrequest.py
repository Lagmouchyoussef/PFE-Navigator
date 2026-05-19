import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0005_subject_is_approved'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='SubjectRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(
                    choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
                    default='pending', max_length=20,
                )),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('student', models.OneToOneField(
                    limit_choices_to={'role': 'student'},
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='subject_request',
                    to=settings.AUTH_USER_MODEL,
                )),
                ('subject', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='requests',
                    to='common.subject',
                )),
            ],
            options={'ordering': ['-created_at']},
        ),
    ]
