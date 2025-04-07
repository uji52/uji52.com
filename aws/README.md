### API Gatewayデプロイのサンプル

```
aws cloudformation deploy --template-file ./aws/templates/api-gateway.yml --stack-name uji52com-dev-apigw --parameter-overrides EmailSNSTopicArn=arn:aws:sns:ap-northeast-1:xxxxxxxxxxxx:SendEmail Environment=dev --capabilities CAPABILITY_IAM
aws cloudformation deploy --template-file ./aws/templates/api-gateway.yml --stack-name uji52com-prd-apigw --parameter-overrides EmailSNSTopicArn=arn:aws:sns:ap-northeast-1:xxxxxxxxxxxx:SendEmail Environment=prd --capabilities CAPABILITY_IAM
```

### Cognitoデプロイのサンプル

```
aws cloudformation deploy --template-file ./aws/templates/cognito.yml --stack-name uji52com-dev-cognito --parameter-overrides Environment=dev GoogleClientId=xxx GoogleClientSecret=xxx CertificateArn=xxx HostedZoneId=xxx --capabilities CAPABILITY_IAM
aws cloudformation deploy --template-file ./aws/templates/cognito.yml --stack-name uji52com-prd-cognito --parameter-overrides Environment=prd GoogleClientId=xxx GoogleClientSecret=xxx CertificateArn=xxx HostedZoneId=xxx --capabilities CAPABILITY_IAM
```
