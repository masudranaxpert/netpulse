import routeros_api


class MikrotikConnection:
    def __init__(self, host, port, username, password=''):
        self.host = host
        self.username = username
        self.password = password or ''
        self.port = port
        self.api = None

        self.connect_mikrotik()

    def connect_mikrotik(self,
        plaintext_login=True,
        use_ssl=False,
        ssl_verify=True,
        ssl_verify_hostname=True,
        ssl_context=None):

        try:
            connect = routeros_api.RouterOsApiPool(
                self.host, 
                username=self.username, 
                password=self.password,
                port=self.port, 
                plaintext_login=plaintext_login,
                use_ssl=use_ssl,
                ssl_verify=ssl_verify,
                ssl_verify_hostname=ssl_verify_hostname,
                ssl_context=ssl_context
                )
            api = connect.get_api()
            self.api = api
            print("Connected to router")
        except Exception as e:
            print(f"Error connecting to router: {e}")
            self.api = None

    def get_router_info(self):
        if not self.api:
            return None
        resource = self.api.get_resource("/system/resource").get()
        data = resource[0] if resource else {}
        return data