## Running the Meteor App with another Database in Development Mode.

First we install `mongodb` from [Mongo's official website].

We install [MongoDB compass], which is a user interface for Schema editing.

Before running Mongo, you need to create the folder to which the Mongo processes are going to write data. By default `mongodb` uses `/data/db`, is you create a different folder you need to specify it when you run `mongodb`. Use the next command to create the default directory.

```bash
mkdir -p /data/db
```
> `-p` flag will create nested directories, but only if they don't exist already.

To start up the mongo service run this command.

```bash
mongod --dbpath <path to data directory>
```

MongoDB runs by default on port `27017`.

Finally if we want to run our meteor app with a database other than the default, which is useful if you want to share data across apps, you star meteor like this:

```bash
env MONGO_URL='mongodb://localhost:27017/myAppDB' meteor
```

For setting this up automatically for you, you can add a script to your `package.json` like this:

```json
/*...*/
"scripts": {
  "db" : "mongod --dbpath <path to data directory>",
  "start": "env MONGO_URL=mongodb://localhost:27017/myAppDB meteor run"
}
/*...*/
```
The to start your app you can run these commands on the terminal, the first one to run the database and the second one to run meteor with your custom database. They have to be executed on two different terminal windows.

```bash
meteor npm run db
meteor npm start
```

For the creation of collections and publishing we read this tutorial [Defining MongoDB Collections].

[Mongo's official website]: https://docs.mongodb.com/master/administration/install-community/
[MongoDB compass]: https://www.mongodb.com/download-center?jmp=nav#compass
[Robo 3T (aka Robomongo)]: https://robomongo.org
[Defining MongoDB Collections]: https://themeteorchef.com/tutorials/defining-mongodb-collections
