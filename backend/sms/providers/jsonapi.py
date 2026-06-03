"""JSON-body based Bangladeshi SMS gateways."""
from .base import RequestSpec, f, register


@register("mimsms", "Mim SMS", [f("ApiKey", "API key", secret=True), f("UserName", "Username"), f("SenderName", "Sender name")])
def mimsms(c, mobile, message):
    return RequestSpec(
        url="https://api.mimsms.com/api/SmsSending/SMS", method="post",
        json={"ApiKey": c["ApiKey"], "SenderName": c["SenderName"], "UserName": c["UserName"],
              "TransactionType": c.get("TransactionType", "T"), "CampaignId": "null",
              "MobileNumber": mobile, "Message": message},
    )


@register("dianasms", "DianaSMS / Esms", [f("api_token", "API token", secret=True), f("sender_id", "Sender ID")])
def dianasms(c, mobile, message):
    recipient = mobile if str(mobile).startswith("+88") else f"+88{mobile}"
    return RequestSpec(
        url="https://login.dianasms.com/api/v3/sms/send", method="post",
        headers={"Authorization": f"Bearer {c['api_token']}", "Content-Type": "application/json"},
        json={"sender_id": c["sender_id"], "recipient": recipient, "message": message},
    )


@register("smsq", "SmsQ", [f("sender_id", "Sender ID"), f("client_id", "Client ID"), f("api_key", "API key", secret=True)])
def smsq(c, mobile, message):
    return RequestSpec(
        url="https://api.smsq.global/api/v2/SendSMS", method="post", headers={"Content-Type": "application/json"},
        json={"SenderId": c["sender_id"], "ApiKey": c["api_key"], "ClientId": c["client_id"],
              "Message": message, "MobileNumbers": mobile},
    )


@register("dhorolasms", "Dhorola SMS", [f("apikey", "API key", secret=True), f("sender", "Sender")])
def dhorolasms(c, mobile, message):
    return RequestSpec(
        url="https://api.dhorolasms.net/smsapiv3", method="post", headers={"Content-Type": "application/json"},
        json={"apikey": c["apikey"], "sender": c["sender"], "msisdn": mobile, "smstext": message},
    )
