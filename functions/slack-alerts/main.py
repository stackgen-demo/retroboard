import os
import urllib3
import json

WEBHOOK_URL = os.environ["SLACK_WEBHOOK_URL"]

http = urllib3.PoolManager()
def send_slack_alert(event, context):
    msg = {
        "text": event['Records'][0]['Sns']['Message']
    }
    
    encoded_msg = json.dumps(msg).encode('utf-8')
    resp = http.request('POST', WEBHOOK_URL, body=encoded_msg)
    print({
        "message": event['Records'][0]['Sns']['Message'], 
        "status_code": resp.status, 
        "response": resp.data
    })
