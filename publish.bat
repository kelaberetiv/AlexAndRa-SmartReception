echo "Starting publish process"
del D:\Projects\AISG\SmartReception\AISG_SmartReception\alexa_server.zip 
echo "Compressing.."
7z a D:\Projects\AISG\SmartReception\AISG_SmartReception\alexa_server.zip D:\Projects\AISG\SmartReception\AISG_SmartReception\Alexa_Server\*
echo "Created alexa_server.zip"

aws s3 cp D:\Projects\AISG\SmartReception\AISG_SmartReception\alexa_server.zip s3://smart-reception
echo "Uploaded to s3 https://s3.amazonaws.com/smart-reception/alexa_server.zip"

aws lambda update-function-code --function-name SmartReception --s3-bucket smart-reception --s3-key alexa_server.zip
echo "Publish Successful!"