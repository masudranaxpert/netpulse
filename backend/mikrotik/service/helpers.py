from mikrotik.service.connection import MikrotikConnection
from mikrotik.service.tools import get_specific_customer

def generate_customer_comment(customer_id, customer_name, phone_number, address, zone_name):
    """Generate a clean comment string containing customer details for MikroTik"""
    return f"ID: {customer_id} | Name: {customer_name} | Phone: {phone_number} | Zone: {zone_name} | Address: {address}"

def check_pppoe_user_exists_on_router(router, pppoe_name):
    """Check if a PPPoE secret exists on the router.
    
    Raises:
        Exception: If connection or API retrieval fails.
    Returns:
        dict or None: Secret info dictionary if found, None otherwise.
    """
    pppoe_name = pppoe_name.lower()
    conn = MikrotikConnection(
        host=router.host,
        port=router.port,
        username=router.username,
        password=router.password
    )
    if not conn.api:
        raise Exception(f"Failed to connect to MikroTik router '{router.name}' at {router.host}:{router.port}. Please verify connection settings.")
    
    result = get_specific_customer(conn.api, pppoe_name)
    if result.get('status') == 'Found' and result.get('customer_info'):
        return result['customer_info']
    elif result.get('status') == 'Failed':
        raise Exception(result.get('message', 'Failed to check PPPoE user on router.'))
    return None

def create_pppoe_user_on_router(router, pppoe_name, pppoe_pass, profile, service, comment):
    """Create a new PPPoE secret on the router.
    
    Raises:
        Exception: If connection or API creation fails.
    """
    conn = MikrotikConnection(
        host=router.host,
        port=router.port,
        username=router.username,
        password=router.password
    )
    if not conn.api:
        raise Exception(f"Failed to connect to MikroTik router '{router.name}' at {router.host}:{router.port}. Please verify connection settings.")
    
    resource = conn.api.get_resource('/ppp/secret')
    try:
        resource.add(
            name=pppoe_name,
            password=pppoe_pass,
            profile=profile,
            service=service,
            disabled="false",
            comment=comment
        )
    except Exception as e:
        raise Exception(f"Router API error: {str(e)}")

def update_pppoe_comment_on_router(router, pppoe_name, comment):
    """Update comment on an existing PPPoE secret.
    
    Raises:
        Exception: If connection or API update fails.
    """
    conn = MikrotikConnection(
        host=router.host,
        port=router.port,
        username=router.username,
        password=router.password
    )
    if not conn.api:
        raise Exception(f"Failed to connect to MikroTik router '{router.name}' at {router.host}:{router.port}. Please verify connection settings.")
    
    resource = conn.api.get_resource('/ppp/secret')
    try:
        secret = resource.get(name=pppoe_name)
        if secret:
            resource.set(id=secret[0]['id'], comment=comment)
        else:
            raise Exception("PPPoE secret not found on router.")
    except Exception as e:
        raise Exception(f"Router API error during comment update: {str(e)}")

def update_pppoe_status_on_router(router, pppoe_name, disabled):
    """Enable or disable PPPoE secret on router, and remove active session if disabled.
    
    Raises:
        Exception: If connection or API update fails.
    """
    pppoe_name = pppoe_name.lower()
    conn = MikrotikConnection(
        host=router.host,
        port=router.port,
        username=router.username,
        password=router.password
    )
    if not conn.api:
        raise Exception(f"Failed to connect to MikroTik router '{router.name}' at {router.host}:{router.port}.")
    
    secret_resource = conn.api.get_resource('/ppp/secret')
    try:
        secret = secret_resource.get(name=pppoe_name)
        if secret:
            action_str = "true" if disabled else "false"
            secret_resource.set(id=secret[0]['id'], disabled=action_str)
        else:
            raise Exception("PPPoE secret not found on router.")
    except Exception as e:
        raise Exception(f"Router API error: {str(e)}")
        
    if disabled:
        active_resource = conn.api.get_resource('/ppp/active')
        try:
            active = active_resource.get(name=pppoe_name)
            if active:
                active_resource.remove(id=active[0]['id'])
        except Exception:
            pass

def update_pppoe_secret_on_router(router, pppoe_name, profile=None, password=None):
    """Update profile and/or password on an existing PPPoE secret.

    Raises:
        Exception: If connection or API update fails.
    """
    pppoe_name = pppoe_name.lower()
    conn = MikrotikConnection(host=router.host, port=router.port, username=router.username, password=router.password)
    if not conn.api:
        raise Exception(f"Failed to connect to MikroTik router '{router.name}' at {router.host}:{router.port}.")

    resource = conn.api.get_resource('/ppp/secret')
    secret = resource.get(name=pppoe_name)
    if not secret:
        raise Exception("PPPoE secret not found on router.")

    payload = {"id": secret[0]['id']}
    if profile:
        payload["profile"] = profile
    if password:
        payload["password"] = password
    if len(payload) > 1:
        resource.set(**payload)


def delete_pppoe_user_from_router(router, pppoe_name):
    """Delete PPPoE secret and remove active sessions from the router.
    
    Raises:
        Exception: If connection or API deletion fails.
    """
    pppoe_name = pppoe_name.lower()
    conn = MikrotikConnection(
        host=router.host,
        port=router.port,
        username=router.username,
        password=router.password
    )
    if not conn.api:
        raise Exception(f"Failed to connect to MikroTik router '{router.name}' at {router.host}:{router.port}.")
    
    from mikrotik.service.tools import delete_customer
    result = delete_customer(conn.api, pppoe_name)
    if result.get('status') == 'Failed':
        if "does not exist" not in result.get('message', ''):
            raise Exception(result.get('message', 'Failed to delete PPPoE user from router.'))
