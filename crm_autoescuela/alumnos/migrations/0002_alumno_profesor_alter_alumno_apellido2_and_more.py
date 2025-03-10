# Generated by Django 5.1.5 on 2025-03-06 09:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('alumnos', '0001_initial'),
        ('profesores', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='alumno',
            name='profesor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='alumnos', to='profesores.profesor'),
        ),
        migrations.AlterField(
            model_name='alumno',
            name='apellido2',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='alumno',
            name='email',
            field=models.EmailField(max_length=254, unique=True),
        ),
        migrations.AlterField(
            model_name='alumno',
            name='telefono',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]
