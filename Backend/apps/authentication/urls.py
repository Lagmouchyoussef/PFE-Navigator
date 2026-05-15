from django.urls import path
from .views import LoginView, UserMeView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('me/', UserMeView.as_view(), name='me'),
]