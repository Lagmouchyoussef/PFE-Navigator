from django.db import migrations


def approve_available_subjects(apps, schema_editor):
    Subject = apps.get_model('common', 'Subject')
    Subject.objects.filter(status='available', is_approved=False).update(is_approved=True)


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0006_subjectrequest'),
    ]

    operations = [
        migrations.RunPython(approve_available_subjects, migrations.RunPython.noop),
    ]
