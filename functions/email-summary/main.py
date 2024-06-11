import json
import os
import boto3

from botocore.errorfactory import ClientError

SENDER_EMAIL = os.environ["SES_SENDER_EMAIL_ADDRESS"]
TEMPLATE_NAME = "retroboard-summary"

def send_email(event, context):
    ses_client = boto3.client("ses")

    for record in event["Records"]:
        print(record["body"])
        payload = json.loads(record["body"])
        print("type(payload)", type(payload))

        send_args = {
            "Source": SENDER_EMAIL,
            "Template": TEMPLATE_NAME,
            "Destination": {"ToAddresses": [payload["to"]]},
            "TemplateData": record["body"],
        }

        try:
            ses_response = ses_client.send_templated_email(**send_args)
            message_id = ses_response["MessageId"]
            print(f"Email sent to {payload['to']} with message id {message_id}")
        except ClientError as e:
            print(e.response["Error"]["Message"])
            raise e
