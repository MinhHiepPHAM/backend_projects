from django.db import models
    
class NewsModel(models.Model):
    url = models.URLField()
    symbol = models.CharField(max_length=10)
    scrapped_date = models.DateField()
    headline = models.CharField(max_length=250)
    context = models.TextField()
    class Meta:
        app_label = 'stock_price'
        constraints = [
            models.UniqueConstraint(fields=['url', 'symbol'], name='unique_field_pair')
        ]

    def __repr__(self):
        return f'{self.symbol}: {self.url}'
    
class StockManger(models.Manager): pass
    
class StockModel(models.Model):
    symbol = models.CharField(max_length=10, primary_key=True)
    company = models.CharField()
    close_price = models.FloatField()
    open_price = models.FloatField()
    low_price = models.FloatField()
    high_price = models.FloatField()
    adj_close_price = models.IntegerField()
    volume = models.BigIntegerField()
    related_news = models.ManyToManyField(NewsModel, related_name='stocks')
    is_trending = models.BooleanField(default=False)
    sector = models.CharField(max_length=250)
    industry = models.CharField(max_length=250)
    country = models.CharField(max_length=250)
    
    objects = StockManger()

    class Meta:
        app_label = 'stock_price'

    def __repr__(self) -> str:
        return self.symbol
    
    @classmethod
    def get_stock_change(cls,obj):
        return obj.adj_close_price- obj.open_price
    
