# Generated by Django 4.2.9 on 2024-03-10 20:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stock_price', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stockmodel',
            name='symbol',
            field=models.CharField(max_length=10),
        ),
    ]