# Firebase API

## Descripción

Aplicacion firebase basada en google cloud functions, que procesará en la nube tareas SERVERLESS,
esto nos permite escalar la aplicación pagando en base a la carga de trabajo de determinadas funciones.

# Estructura de proyecto

**firebaserc**: configuracion de google firebase.
**functions**: Código de la aplicación.
**functions/index.js**: Inicializa Firebase
**functions/app**: ExpressJS app inicialization
**functions/controller**: Exposición de APIS

## Iniciar Aplicación

```bash
#Dentro de: "firebase-api/functions/"
# iniciar en local puerto: 5001
npm run serve
# desplegar en producción
npm run deploy
```

## Ejemplo de petición de procesamiento de imagen en local

curl --location --request POST 'http://localhost:5001/zara-images/us-central1/app/file-process/resize-file' --form 'file=@"/C:/tmp/testImage.jpg"'