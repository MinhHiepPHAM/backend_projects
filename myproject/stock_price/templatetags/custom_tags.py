from django import template

register = template.Library()

@register.simple_tag
def get_dict_value(dictionary, key):
    return dictionary[key]