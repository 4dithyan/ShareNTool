from django.urls import path
from .views import LoginView, SignupView, ProfileView, DummyUsersListView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('profile/', ProfileView.as_view(), name='profile-current'),
    path('profile/<int:user_id>/', ProfileView.as_view(), name='profile-detail'),
    path('dummy-users/', DummyUsersListView.as_view(), name='dummy-users'),
]

