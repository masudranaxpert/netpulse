import os
from datetime import timedelta

SPECTACULAR_SETTINGS = {
    'TITLE': 'ISP Billing API',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'TAGS': [
        {'name': 'auth', 'description': 'Authentication endpoints'},
        {'name': 'packages', 'description': 'Internet package management endpoints'},
        {'name': 'customers - Customers', 'description': 'Customer management endpoints'},
        {'name': 'mikrotik - Routers', 'description': 'MikroTik router management endpoints'},
        {'name': 'mikrotik - Profiles', 'description': 'MikroTik router management endpoints'},
        {'name': 'scheduler', 'description': 'Background tasks scheduler endpoints'},
        {'name': 'customer_portal', 'description': 'Customer portal endpoints'},
        {'name': 'reports', 'description': 'Analytics & dashboard reporting endpoints'},
    ],
}

AUTH_KIT = {
    'AUTH_TYPE': 'jwt',
    'USE_AUTH_COOKIE': True,
    'SESSION_LOGIN': False,
    'ALLOW_LOGIN_REDIRECT': False,
    'AUTH_JWT_COOKIE_NAME': 'auth-jwt',
    'AUTH_JWT_COOKIE_PATH': '/',
    'AUTH_JWT_REFRESH_COOKIE_NAME': 'auth-refresh-jwt',
    'AUTH_JWT_REFRESH_COOKIE_PATH': '/',
    'AUTH_JWT_COOKIE_SECURE': False,
    'AUTH_JWT_COOKIE_HTTPONLY': True,
    'AUTH_JWT_COOKIE_SAMESITE': 'Lax',
    'LOGIN_REQUEST_SERIALIZER': 'customers.serializers.users.EmailOnlyLoginRequestSerializer',
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=int(os.environ.get('JWT_ACCESS_LIFETIME_MINUTES', 30))),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=int(os.environ.get('JWT_REFRESH_LIFETIME_DAYS', 7))),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True
}

ACCOUNT_EMAIL_VERIFICATION = os.environ.get('ACCOUNT_EMAIL_VERIFICATION', 'none')
ACCOUNT_LOGIN_METHODS = {"email"}
ACCOUNT_SIGNUP_FIELDS = ["email*", "password1*", "password2*"]

ADMIN_APP_ORDER = [
    "customers",
    "customer_portal",
    "billing",
    "mikrotik",
    "django_q",
    "account",
    "auth",
]

ADMIN_MODEL_ORDER = {
    "customers": [
        "CustomerProfile",
        "SupportTicket",
        "TicketReply",
        "AddressZone",
    ],
    "billing": [
        "Package",
        "MonthlyBill",
        "ConnectionFee",
        "PaymentTransaction",
        "PaymentAllocation",
        "InvoiceStatusHistory",
    ],
    "mikrotik": [
        "MikrotikRouter",
        "RouterInfo",
    ],
}

