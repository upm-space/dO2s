## Running the Meteor App with another Database in Development Mode.

First we install `mongodb` from [Mongo's official website](https://docs.mongodb.com/master/administration/install-community/).

We install [MongoDB compass](https://www.mongodb.com/download-center?jmp=nav#compass), which is a user interface for Schema editing.

Before running Mongo, you need to create the folder to which the Mongo processes are going to write data. By default `mongodb` uses `/data/db`, is you create a different folder you need to specify it when you run `mongodb`. Use the next command to create the default directory.

```bash
mkdir -p /data/db
```
> `-p` flag will create nested directories, but only if they don't exist already.

To start up the mongo service run this command.

```bash
mongod
```

MongoDB runs by default on port `27017`.

Finally if we want to run our meteor app with a database other than the default, which is useful if you want to share data across apps, you star meteor like this:

```bash
MONGO_URL='mongodb://localhost:27017/dO2s' meteor
```
For the creation of collections and publishing we read this tutorial [Defining MongoDB Collections](https://themeteorchef.com/tutorials/defining-mongodb-collections).
