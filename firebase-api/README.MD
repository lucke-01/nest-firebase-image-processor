# Firebase API

## Description

Firebase application based on google cloud functions, which will process SERVERLESS tasks in the cloud,
this allows us to scale the application by paying based on the workload of certain functions.

### Core Framework

**ExpressJS**:

Reasons for its use:
- Allows easy integration with firebase functions
- While it is less maintainable than other frameworks like NestJS it allows us to
however a fast deployment without compilation, typescript or complex structure which for small functionalities
that will be processed in google firebase cloud provides us with optimal agility and flexibility.

# project structure

**firebaserc**: config of google firebase.
**functions**: app code.
**functions/index.js**: inits Firebase
**functions/app**: ExpressJS app inicialization
**functions/controller**: API exposition

## INIT APP

```bash
#inside of: "firebase-api/functions/"
# init in port: 5001
npm run serve
# deploy in pro
npm run deploy
```

## Example of local image processing request

curl --location --request POST 'http://localhost:5001/zara-images/us-central1/app/file-process/resize-file' --form 'file=@"/C:/tmp/testImage.jpg"'
