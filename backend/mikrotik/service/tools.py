def get_customers(connection):
    if not connection:
        return {"status": "Failed", "message": "No connection to router", "customers": [], "customers_count": 0}
    conn = connection
    try:
        customers = conn.get_resource('/ppp/secret').get()
        customers_count = len(customers)
        data = {
            "status": "Success",
            "customers": customers,
            "customers_count": customers_count
        }
        return data
    except Exception as e:
        return {"status": "Failed", "message": str(e), "customers": [], "customers_count": 0}


def get_active_customers(connection):
    if not connection:
        return {"status": "Failed", "message": "No connection to router", "customers": [], "customers_count": 0}
    conn = connection
    try:
        customers = conn.get_resource('/ppp/active').get()
        customers_count = len(customers)
        data = {
            "status": "Success",
            "customers": customers,
            "customers_count": customers_count
        }
        return data
    except Exception as e:
        return {"status": "Failed", "message": str(e), "customers": [], "customers_count": 0}


def get_specific_customer(connection, customer_name):
    if not connection:
        return {"status": "Failed", "message": "No connection to router", "customer_info": None}
    conn = connection
    try:
        customer = conn.get_resource('/ppp/secret').get(name=customer_name)
        
        if customer:
            data = {
                "status": "Found",
                "customer_info": customer[0]
            }
        else:
            data = {
                "status": "Not Found",
                "customer_info": None
            }
        return data
    except Exception as e:
        return {"status": "Failed", "message": str(e), "customer_info": None}


def get_check_customer_status(connection, customer_name):
    if not connection:
        return "Connection Error"
    conn = connection
    try:
        customer = conn.get_resource('/ppp/active').get(name=customer_name)
        if customer:
            return "Active"
        else:
            return "Inactive"
    except Exception as e:
        return f"Error: {str(e)}"


def get_profiles(connection):
    if not connection:
        return {"status": "Failed", "message": "No connection to router", "profiles": None, "profiles_count": 0}
    conn = connection
    try:
        profiles = conn.get_resource("/ppp/profile").get()
        if profiles:
            data = {
                "status": "Found",
                "profiles": profiles,
                "profiles_count": len(profiles)
            }
        else:
            data = {
                "status": "Not Found",
                "profiles": None,
                "profiles_count": 0
            }
        return data
    except Exception as e:
        return {"status": "Failed", "message": str(e), "profiles": None, "profiles_count": 0}


def create_customer(connection, name, password, profile, service="pppoe", disabled="false", address=None):
    if not connection:
        return {"status": "Failed", "message": "No connection to router"}
    conn = connection
    resource = conn.get_resource('/ppp/secret')
    comment = {
        "name": name,
        "password": password,
        "profile": profile,
        "service": service,
        "disabled": disabled,
        "address": address
    }
    try:
        resource.add(
            name=name,
            password=password,
            profile=profile,
            service=service,
            disabled=disabled,
            comment=str(comment)
        )
        return {"status": "Success", "message": f"Customer '{name}' created successfully!"}
    except Exception as e:
        return {"status": "Failed", "message": str(e)}


def delete_customer(connection, name):
    if not connection:
        return {"status": "Failed", "message": "No connection to router"}
    conn = connection
    resource = conn.get_resource('/ppp/secret')
    active_resource = connection.get_resource('/ppp/active')
    try:
        active = active_resource.get(name=name)
        if active:
            active_resource.remove(id=active[0]['id'])
        customer = resource.get(name=name)
        if not customer:
            return {"status": "Failed", "message": f"'{name}' does not exist"}
        customer_id = customer[0]['id']
        resource.remove(id=customer_id)
        return {"status": "Success", "message": f"Deleted Customer {name}"}
    except Exception as e:
        return {"status": "Failed", "message": str(e)}


def toggle_customer_status(connection, name, action="true"):
    if not connection:
        return {"status": "Failed", "message": "No connection to router"}
    resource = connection.get_resource('/ppp/secret')
    try:
        customer = resource.get(name=name)
        if not customer:
            return {"status": "Failed", "message": f"'{name}' does not exist"}
        resource.set(id=customer[0]['id'], disabled=action)
        if action == 'true':
            return {"status": "Success", "message": f"Disabled Customer '{name}'"}
        else:
            return {"status": "Success", "message": f"Enabled Customer '{name}'"}
    except Exception as e:
        return {"status": "Failed", "message": str(e)}