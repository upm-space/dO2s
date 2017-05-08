## Arranque de la aplicación con otra base de datos en modo desarrollo

Primeramente instalamos mongodb desde la página oficial de mongodb

Instalamos MongoDB compass, que un interfaz de usuario para la gestión de esquemas

Para arrancar el servicio de mongodb

    sudo service mongod start
    
Para arrancar meteor con otra base de datos

    MONGO_URL='mongodb://localhost:27017/igs' meteor
    
Para la creación de colecciones y publicaciones leemos el siguiente [artículo](https://themeteorchef.com/tutorials/defining-mongodb-collections)