from rest_framework.pagination import PageNumberPagination
# from rest_framework.response import Response


class HomePagination(PageNumberPagination):
    page_size = 20
    max_page_size = 1000
    page_query_param = 'p'
    page_size_query_param = 'page_size'
