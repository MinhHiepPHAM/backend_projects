from django.db import models

class StockModel(models.Model):
    symbol = models.CharField(max_length=10)

    def __repr__(self) -> str:
        return self.symbol
    
