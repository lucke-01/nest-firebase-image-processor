# Firebase API

## Descripción

Aplicacion firebase basada en google cloud functions, que procesará en la nube tareas SERVERLESS,
esto nos permite escalar la aplicación pagando en base a la carga de trabajo de determinadas funciones.

### Framework Principal

**ExpressJS**:

Motivos de su uso:
- Permite facil integración con firebase functions
- Mientras que es menos mantenible que otros frameworks como NestJS nos permite 
no obstante un rápido despliege sin compilado, typescript o una estructura compleja lo cual para pequeñas funcionalidades
que serán procesadas en google firebase cloud nos proporcina la agilidad y flexibilidad optima.

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