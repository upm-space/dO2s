## Instalación de la aplicación

Un tuto que hay que leer para todo el sistema de enrutamiento está en este [link](https://css-tricks.com/learning-react-router/)

Seguir el proceso de instalación de meteor para React

     meteor create ipsilum
     cd ipsilum
     meteor npm install
     meteor npm install --save react react-dom
     meteor npm install font-awesome
     #meteor add kadira:flow-router
     meteor add twbs:bootstrap
     #npm i --save react-mounter react react-dom
     
Para la instalación y puesta a punto del react router seguimos los pasos del [artículo de themeteorchef](https://themeteorchef.com/tutorials/react-router-basics)

     npm i --save react react-dom react-router@3.0.2
     
* **OJO!** En la instalación hemos forzado la versión de react-router ya que la actual en ese momento daba problemas con el browse history

En el directorio client el main.html queda de la siguiente manera

```html
    <head>
        <title>ipsilum</title>
    </head>

    <body>
       <div id="react-root"></div>
    </body>
```
En el directorio client el main.js queda de la siguiente manera

    import './main.html';
    import '/imports/startup/client';
    



En el directorio client borramos el main.js (el main.css está vacio) y el main html lo modificamos, dejando en el body un simple <div id="root" />

Creamos la carpeta lib y le metemos el fichero routes.jsx

## definición de colecciones

EL patrón que seguimos para la definición de colecciones lo tenemos en el siguiente [link](https://themeteorchef.com/tutorials/defining-mongodb-collections)