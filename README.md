# Zara Images NodeJS

## Descripción

Aplicación NodeJS que recoge peticiones con imagenes, y manda estas peticiones a un servicio serverless para obtener imagenes redimensionadas

# Estructura de proyecto

## ficheros configuración Entornos

**.env, .env.test, .env.local, .env.pro**: 
ficheros de configuración segun entornos, incluyen cadena de conexión a base de datos, carpeta de output de imagenes y mas configuraciones

## ficheros configuración Proyecto

**.eslintrc.js**: fichero de configuración de calidad de código

**package.json**: fichero para gestionar configuraciones de proyecto, dependencias, ejecuciones etc...

**tsconfig.json, tsconfig.build.json, nest-cli.json**: 
Ficheros usados a la hora de compilar código de typescript y javascript. siendo nest-cli.json especifico del framework nestjs con otras configuraciones

## Ficheros Servicios externos

**/mongodb**: almacena configuración docker-compose para levantar una instancia de mongodb

## Ficheros Reporte de covertura de código

**/coverage/index.html**: generado al realizar el comando: "npm run test:cov" permite ver la cobertura de nuestros test en formato html.

## Ficheros Testing

**/test**: Ficheros test End to End (http).

**/*/*.spec.ts**: Ficheros test

## Ficheros Aplicación

**/src/**: Ficheros de código

# Modelado de datos 

## Ejemplo de modelo de peticion en mongodb

```json
{
    "_id": "626805177a7ff98cb8fe7466",
    "creationDate": "2022-04-26T14:43:35.586Z",
    "priority": 3,
    "state": "created",
    "images": [
        {
            "md5": "487f7b22f68312d2c1bbc93b1aea445b",
            "filePath": "626805177a7ff98cb8fe7466/500/487f7b22f68312d2c1bbc93b1aea445b.jpg",
            "creationDate": "2022-04-26T14:43:35.586Z",
            "width": 500,
            "height": 334,
            "original": true
        }
    ],
}
```

# Stack Tecnologíco

### Lenguaje Principal

**NodeJS (Javascript y TypeScript)**:
Motivos de su uso:
- Pensado para procesar muchas peticiones por segundo
- evita creación de hilos por cada petición agilizando las peticiones
- TypeScript permite crear código potencilamente mas escalable y con menos errores "runtime" que javascript

### Framework Principal

**NestJS**:
Motivos de su uso:
- NestJS está construido en typescript, permite inyección de dependencias,
- Combina programación orientada a objetos con programación orientada a funciones
- highly testable, scalable, loosely coupled, and easily maintainable applications
- Si bien nos aporta la escalabilidad y herramientas propias de un framework completo, no añade excesiva complejidad y permite trabajar agilmente
- Permite validad datos usando anotaciones constraint en lugar de por ejemplo: ifs

### Motor Base de datos

**MongoDB**:
Motivos de su uso:
- Dada la topología de la aplicación, al no tener complejas relaciones y no necesitar en principio operaciones con transacciones
se elige MongoDB como motor de base de datos con el fin de optimizar la velocidad de lectura de datos al no tener que manejar relaciones sino documentos.
- Mayor velocidad de lectura, aunque se pierde los principios ACID tipicos de una base de datos SQL

### Libreria Acceso datos

**Mongosee**:
Motivos de su uso:
- Permite realizar consultas y operaciones sobre mongoDB de manera facil y rápida

### Libreria Testing

**Jest**:
Motivos de su uso:
- Permite creación de test de manera simple
- Permite generación de reporte de cobertura de tests en formato html

### Libreria Testing End To End

**supertest**:
Motivos de su uso:
- Permitede peticiones HTTP de manera sencilla, para luego testear los valores recibidos

### Libreria Variables de entorno o ficheros de configuración segun el entorno de ejecución

**env-cmd**:
Motivos de su uso:
- Permite crear varios ficheros de configuración los cuales serán cargados en base al entorno de ejecución

### Calidad de Código

**EsLint**:
Motivos de su uso:
- Ayuda a unificar la manera de crear código en un mismo proyecto.
- Ayuda a crear código con buenas prácticas y limpio.

### Base de datos en memoria para testing

**mongodb-memory-server**:
Motivos de su uso:
- Permite realizar test de integración como si fuera una base de datos real pero sin requerir de servicios externos que pueden estar o no operativos.
- Entorno no mutable, es decir los test siempre atacarán los mismos datos evitando asi que den errores según los datos que haya en ese momento.

### Virtualización de servicios externos

**docker**:
Motivos de su uso:
- Permite levantar cualquier servicio en local, de esta manera se puede trabajar en el proyecto independientemente de las configuraciones y Sistemas Operativos de los integrantes.

## Instalación

```bash
npm install
```

## Iniciar Aplicación Local
```bash
#Antes de iniciar se requiere una instancia de mongodb en localhost
cd ./mongodb && docker-compose up
# desarrollo
npm run start
# modo watch
npm run start:dev
# producción
npm run start:prod
```

## Iniciar Aplicación Docker
```bash
#IMPORTANTE Antes de empezar tener libres los siguientes puertos: 27017, 3000 y 9229
#Iniciar en modo desarrollo/debug
docker-compose up dev
#Iniciar en modo produccion
docker-compose up prod
#iniciar con acceso terminal
docker-compose up -d prod
```

## Test
```bash
# todos los tests
npm run test:all
# unit tests
npm run test 
# e2e tests
npm run test:e2e
# covertura de tests
npm run test:cov
```