"""
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""


from django.urls import path,re_path
from . import views

urlpatterns = [
    re_path(r'login/$', views.CustomLoginView.as_view(), name='login'),
    re_path(r'signup/$', views.RegisterView.as_view(), name='register'),
    re_path(r'dashboard/$', views.DashboardView.as_view(), name='dashboard'),
    re_path(r'logout/$', views.CustomLogoutView.as_view(), name='logout'),
    path('home/', views.HomePageView.as_view(), name='home')
]