# AlexAndRa Smart Reception

Smart Reception for AI Singapore is a voice assisted AI Receptionist using Alexa.

### Architecture

![alt Architecture](https://github.com/kelaberetiv/SmartReception/blob/master/SmartReceptionArchitecture.png)

### Project Description

The AISG Smart Reception Project has 3 sub-projects.
1. Alexa Server (AWS lambda function for the alexa logic)
2. Console Web App (Web app to manage people and devices )
3. Standalone Routing Server (Bluetooth routing server to communicate with alexa devices)

### Setup Notes
- Open the Console Web App (index.html) and add users. This automatically updates the database (https://alexandra-smart-reception.firebaseio.com).
- Add the physical address for the device associated with each user.

Go through the code for better understanding!
