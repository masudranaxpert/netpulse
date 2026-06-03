from typing import Any

from django.contrib.auth import get_user_model
from rest_framework import exceptions, serializers

from auth_kit.serializers.login_factors import LoginRequestSerializer


class EmailOnlyLoginRequestSerializer(LoginRequestSerializer):
    username = None
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(style={"input_type": "password"}, write_only=True)

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        serializers.Serializer.__init__(self, *args, **kwargs)

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        email = attrs.get("email")
        password = attrs.get("password")

        User = get_user_model()

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise exceptions.ValidationError("Unable to log in with provided credentials.")

        if not user.check_password(password):
            raise exceptions.ValidationError("Unable to log in with provided credentials.")

        if not user.is_active:
            raise exceptions.ValidationError("User account is disabled.")

        self.validate_email_verification_status(user)
        self.context["user"] = user
        return attrs