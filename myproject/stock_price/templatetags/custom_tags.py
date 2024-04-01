from django import template

register = template.Library()

@register.simple_tag
def get_change_price(close_price, open_price):
    return float('{:.2f}'.format(close_price - open_price))