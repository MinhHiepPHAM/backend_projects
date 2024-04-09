from django.db import models
    
class NewsModel(models.Model):
    url = models.URLField(primary_key=True)
    scrapped_date = models.DateField()
    headline = models.CharField(max_length=250)
    context = models.TextField()
    class Meta:
        app_label = 'stock_price'

    def __repr__(self):
        return f'{self.url}'
    
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

    class Meta:
        app_label = 'stock_price'

    def __repr__(self) -> str:
        return self.symbol + ' - ' + self.company
    
    
    
