from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from collections import OrderedDict

class HomePagination(PageNumberPagination):
    page_size = 15
    max_page_size = 1000
    page_query_param = 'p'
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('page_size', self.get_page_size(self.request)),
            ('all_stock_data', data)
        ]))
    
class NewsPagination(PageNumberPagination):
    page_size = 15
    max_page_size = 1000
    page_query_param = 'p'
    page_size_query_param = 'page_size'
    
    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('page_size', self.get_page_size(self.request)),
            ('news', data)
        ]))