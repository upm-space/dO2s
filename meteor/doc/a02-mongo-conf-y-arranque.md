## Arranque de la aplicación con otra base de datos en modo desarrollo

Primeramente instalamos `mongodb` desde la [página oficial de mongodb](https://docs.mongodb.com/master/administration/install-community/).

Instalamos [MongoDB compass](https://www.mongodb.com/download-center?jmp=nav#compass), que un interfaz de usuario para la gestión de esquemas

Antes de arrancar Mongo, crea la carpeta a la que los procesos de Mongo van a escribir datos. Por defecto `mongodb` usa la carpeta `/data/db`, si creas in directorio distinto debes especificarlo al ejecutar `mongodb`. Con el siguiente comando creas el directorio por defecto:

```bash
mkdir -p /data/db
```
> `-p` flag will create nested directories, but only if they don't exist already.

Para arrancar el servicio de mongodb

```bash
mongod
```

MongoDB se ejecuta por defecto en el puerto `27017`.

Finalmente para arrancar meteor con otra base de datos:

```bash
MONGO_URL='mongodb://localhost:27017/dO2s' meteor
```

Para la creación de colecciones y publicaciones leemos el siguiente [Defining MongoDB Collections](https://themeteorchef.com/tutorials/defining-mongodb-collections).
