from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'results': data
        })


def paginate_list_data(data_list, request, paginator_instance=None):
    """
    Reusable function to paginate arbitrary list data (not just Django QuerySets).
    Useful for API responses from external services (like MikroTik) that need pagination.
    
    Args:
        data_list (list): The list of items to paginate
        request: The Django request object
        paginator_instance: CustomPagination instance (uses defaults if not provided)
    
    Returns:
        dict: Paginated response dictionary with count, next/previous links, results
    """
    paginator = paginator_instance or CustomPagination()
    
    page_size = paginator.page_size
    page_size_query = request.query_params.get(paginator.page_size_query_param)
    if page_size_query and page_size_query.isdigit():
        page_size = min(int(page_size_query), paginator.max_page_size)
    
    page_number = request.query_params.get('page', 1)
    try:
        page_number = int(page_number)
    except (TypeError, ValueError):
        page_number = 1
    
    start = (page_number - 1) * page_size
    end = start + page_size
    page_data = data_list[start:end]
    
    total_count = len(data_list)
    total_pages = (total_count + page_size - 1) // page_size
    
    paginated_response = {
        'count': total_count,
        'next': None,
        'previous': None,
        'total_pages': total_pages,
        'current_page': page_number,
        'results': page_data
    }
    
    query_params = []
    if page_size_query and page_size_query.isdigit():
        query_params.append(f"{paginator.page_size_query_param}={page_size_query}")
    
    if page_number < total_pages:
        next_params = query_params + [f"page={page_number + 1}"]
        paginated_response['next'] = f"{request.path}?{'&'.join(next_params)}"
    if page_number > 1:
        prev_params = query_params + [f"page={page_number - 1}"]
        paginated_response['previous'] = f"{request.path}?{'&'.join(prev_params)}"
    
    return paginated_response
