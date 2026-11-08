from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer, UserProfileSerializer
from .models import UserProfile

class LoginView(APIView):
    """
    Dummy/College-ready Login: authenticates against Django user,
    or creates dummy session info easily.
    """
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        if user is None:
            # Fallback: check if user exists, if not college dummy auto-provision or check password
            try:
                user = User.objects.get(username=username)
                # If password didn't match standard hash, allow easy login for college test users if password matches username
                if password == 'password123' or password == username:
                    pass
                else:
                    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            except User.DoesNotExist:
                return Response({'error': 'User not found. Please sign up or use demo accounts!'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user)
        return Response({
            'message': 'Login successful',
            'token': f'dummy-token-{user.id}-{user.username}',
            'user': serializer.data
        })

class SignupView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user_data = UserSerializer(user).data
            return Response({
                'message': 'Account created successfully',
                'token': f'dummy-token-{user.id}-{user.username}',
                'user': user_data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    def get(self, request, user_id=None):
        if user_id:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # dummy current user default: first user or specified via query
            uid = request.query_params.get('userId')
            if uid:
                user = User.objects.filter(id=uid).first()
            else:
                user = User.objects.first()
        if not user:
            return Response({'error': 'No user found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(UserSerializer(user).data)

    def put(self, request, user_id=None):
        uid = user_id or request.data.get('user_id')
        user = User.objects.filter(id=uid).first() if uid else User.objects.first()
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        user.email = request.data.get('email', user.email)
        user.save()

        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.phone = request.data.get('phone', profile.phone)
        profile.city = request.data.get('city', profile.city)
        profile.address = request.data.get('address', profile.address)
        profile.bio = request.data.get('bio', profile.bio)
        profile.avatar_url = request.data.get('avatar_url', profile.avatar_url)
        profile.save()

        return Response(UserSerializer(user).data)

class DummyUsersListView(APIView):
    """Convenient endpoint for college presentation to inspect test demo users"""
    def get(self, request):
        users = User.objects.all()
        return Response(UserSerializer(users, many=True).data)
