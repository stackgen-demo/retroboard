import os
import boto3
from typing import Final

sts_client = boto3.client('sts')

AWS_REGION: Final[str] = os.environ["AWS_REGION"]
AWS_ACCOUNT_ID = sts_client.get_caller_identity()['Account']

DYNAMODB_TABLE_NAME: Final[str] = "boards"
EMAILS_SQS_QUEUE: Final[str] = "retroboard-emails"
SLACK_ALERTS_SNS_TOPIC: Final[str] = "retroboard-alerts"

SNS_TOPIC_SLACK_ALERTS_ARN: Final[str] = f"arn:aws:sns:{AWS_REGION}:{AWS_ACCOUNT_ID}:{SLACK_ALERTS_SNS_TOPIC}"
SQS_SEND_EMAIL_QUEUE_URL: Final[str] = f"https://sqs.{AWS_REGION}.amazonaws.com/{AWS_ACCOUNT_ID}/{EMAILS_SQS_QUEUE}"

S3_APP_URL: Final[str] = os.environ["S3_APP_URL"]
