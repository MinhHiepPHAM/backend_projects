from django.db import models

class StockModel(models.Model):
    symbol = models.CharField(max_length=10)

    class Meta:
        app_label = 'stock_price'

    def __repr__(self) -> str:
        return self.symbol
    
class NewsModel(models.Model):
    url = models.URLField()
    symbol = models.CharField(max_length=10)
    scrapped_date = models.DateField()
    headline = models.CharField(max_length=250)
    class Meta:
        app_label = 'stock_price'
        constraints = [
            models.UniqueConstraint(fields=['url', 'symbol'], name='unique_field_pair')
        ]

    def __repr__(self):
        return f'{self.symbol}: {self.url}'
