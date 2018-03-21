echo "Starting publish process"
rm alexa_server.zip
echo "Compressing.."
zip -r alexa_server.zip Alexa_Server/*
echo "Created alexa_server.zip"
aws s3 cp alexa_server.zip s3://smart-reception
echo "Uploaded to s3 https://s3.amazonaws.com/smart-reception/alexa_server.zip"
aws lambda update-function-code --function-name smart reception --s3-bucket smart-reception --s3-key alexa_server.zip
echo "Publish Successful!"