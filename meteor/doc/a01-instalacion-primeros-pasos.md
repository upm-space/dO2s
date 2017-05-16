## Instalación de la aplicación

Un tuto que hay que leer para todo el sistema de enrutamiento está en este link, [Leveling Up With React: React Router](https://css-tricks.com/learning-react-router/). Esta es la versión 3 de ReactRouter, este tutorial explica muy bien la filosofía del `react-router` se recomienda mucho leerlo, pero la versión 4 no funciona igual. Estos son los links para la versión 4:

-   [Meteor Chef - Getting Started with React Router 4](https://themeteorchef.com/tutorials/getting-started-with-react-router-v4)
-   [React Router Documentation](https://reacttraining.com/react-router/web/guides/quick-start)
-   [Nesting in ReactRouter v4](https://teamtreehouse.com/community/warning-you-should-not-use-route-component-and-route-children-in-the-same-route-route-children-will-be-ignored)
-   [Quick tut to ReactRouter 4](https://medium.com/@pshrmn/a-simple-react-router-v4-tutorial-7f23ff27adf˚)


Seguir el proceso de instalación de meteor para React

```bash
meteor create ipsilum
cd ipsilum
meteor npm install
meteor npm install --save react react-dom
meteor npm install --save font-awesome
meteor add twbs:bootstrap
```

Para la instalación y puesta a punto del react router seguimos los pasos del artículo de themeteorchef, [React Router Basics](https://themeteorchef.com/tutorials/react-router-basics)

```bash
meteor npm install --save react-router react-router-dom
```

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

```javascript
// import './main.html';
import '/imports/startup/client';
```

En el directorio client borramos el `main.js` (el main.css está vacio) y el `main.html` lo modificamos, dejando en el body un simple

```html
<div id="root" />
```

Creamos las carpetas `/imports/startup/client/` le metemos el fichero `routes.jsx`.

## Definición de Colecciones

El patrón que seguimos para la definición de colecciones lo tenemos en el siguiente link,  [Defining MongoDB Collections](https://themeteorchef.com/tutorials/defining-mongodb-collections).
