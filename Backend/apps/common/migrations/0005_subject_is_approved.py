from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0004_resource_type_year'),
    ]

    operations = [
        migrations.AddField(
            model_name='subject',
            name='is_approved',
            field=models.BooleanField(default=False),
        ),
    ]
