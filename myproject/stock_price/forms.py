from django import forms
from .models import StockModel

class StockForm(forms.ModelForm):
    class Meta:
        model = StockModel
        fields = ['symbol']

