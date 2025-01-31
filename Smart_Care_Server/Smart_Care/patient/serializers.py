from rest_framework import serializers
from .models import Patient
from django.contrib.auth.models import User

class PatientSerializer(serializers.ModelSerializer):
    # user = serializers.StringRelatedField(many=False)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())  
    class Meta:
        model = Patient
        fields = '__all__'

class RegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(required=True)
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'confirm_password']
    def save(self, **kwargs):
        # return super().save(**kwargs)
        username = self.validated_data['username']
        email = self.validated_data['email']
        password = self.validated_data['password']
        confirm_password = self.validated_data['confirm_password']
        first_name = self.validated_data['first_name']
        last_name = self.validated_data['last_name']

        # password validation
        if password != confirm_password:
            raise serializers.ValidationError({'error': 'passwords do not match'})
        
        if User.objects.filter(email=email).exists() or User.objects.filter(username=username).exists():
            raise serializers.ValidationError({'error': 'email or username already exists'})
        
        user = User(username=username, email=email, first_name=first_name, last_name=last_name)
        user.set_password(password)
        user.is_active = False

        user.save()
        return user
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)