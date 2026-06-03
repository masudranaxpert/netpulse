"""Query-string / form based Bangladeshi SMS gateways."""
from .base import RequestSpec, f, register


@register("bulksmsbd", "BulkSMS BD", [f("api_key", "API key", secret=True), f("senderid", "Sender ID")])
def bulksmsbd(c, mobile, message):
    return RequestSpec(
        url="https://bulksmsbd.net/api/smsapi", method="get",
        params={"api_key": c["api_key"], "senderid": c["senderid"], "type": "text", "number": mobile, "message": message},
    )


@register("smsnetbd", "SMS.net.bd", [f("api_key", "API key", secret=True), f("sender_id", "Sender ID", required=False)])
def smsnetbd(c, mobile, message):
    params = {"api_key": c["api_key"], "msg": message, "to": mobile}
    if c.get("sender_id"):
        params["sender_id"] = c["sender_id"]
    return RequestSpec(url="https://api.sms.net.bd/sendsms", method="post", data=params)


@register("bulksmsdhaka", "BulkSMS Dhaka", [f("api_key", "API key", secret=True), f("callerID", "Caller ID / Mask")])
def bulksmsdhaka(c, mobile, message):
    return RequestSpec(
        url="https://bulksmsdhaka.net/api/sendtext", method="get",
        params={"api_key": c["api_key"], "number": mobile, "message": message, "callerID": c["callerID"]},
    )


@register("boomcast", "BoomCast", [f("masking", "Masking"), f("username", "Username"), f("password", "Password", secret=True)])
def boomcast(c, mobile, message):
    return RequestSpec(
        url="https://api.boom-cast.com/boomcast/WebFramework/boomCastWebService/OTPMessage.php", method="get",
        params={"masking": c["masking"], "userName": c["username"], "password": c["password"], "MsgType": "TEXT", "receiver": mobile, "message": message},
    )


@register("dianahost", "DianaHost", [f("api_key", "API key", secret=True), f("type", "Type (text/unicode)"), f("senderid", "Sender ID")])
def dianahost(c, mobile, message):
    return RequestSpec(
        url="http://esms.dianahost.com/smsapi", method="get",
        params={"api_key": c["api_key"], "type": c["type"], "senderid": c["senderid"], "contacts": mobile, "msg": message},
    )


@register("mobireach", "Mobireach", [f("Username", "Username"), f("Password", "Password", secret=True), f("From", "From / Sender")])
def mobireach(c, mobile, message):
    return RequestSpec(
        url="https://api.mobireach.com.bd/SendTextMessage", method="get",
        params={"Username": c["Username"], "Password": c["Password"], "From": c["From"], "To": mobile, "Message": message},
    )


@register("smsinbd", "SMSinBD", [f("api_token", "API token", secret=True), f("senderid", "Sender ID")])
def smsinbd(c, mobile, message):
    return RequestSpec(
        url="https://api.smsinbd.com/sms-api/sendsms", method="post",
        data={"api_token": c["api_token"], "senderid": c["senderid"], "contact_number": mobile, "message": message},
    )


@register("tense", "Tense", [f("user", "User"), f("password", "Password", secret=True), f("campaign", "Campaign"), f("masking", "Masking")])
def tense(c, mobile, message):
    return RequestSpec(
        url="http://sms.tense.com.bd/api-sendsms", method="get",
        params={"user": c["user"], "password": c["password"], "campaign": c["campaign"], "masking": c["masking"], "number": mobile, "text": message},
    )


@register("adn", "ADN SMS", [f("api_key", "API key", secret=True), f("api_secret", "API secret", secret=True), f("request_type", "Request type"), f("message_type", "Message type"), f("senderid", "Sender ID", required=False)])
def adn(c, mobile, message):
    return RequestSpec(
        url="https://portal.adnsms.com/api/v1/secure/send-sms", method="post", headers={"Accept": "application/json"},
        data={"api_key": c["api_key"], "api_secret": c["api_secret"], "request_type": c.get("request_type", "SINGLE_SMS"),
              "message_type": c.get("message_type", "TEXT"), "senderid": c.get("senderid", ""), "mobile": mobile, "message_body": message},
    )
