Users = new Mongo.Collection( 'users2' );

Users.allow({
    insert() { return false; },
    update() { return false; },
    remove() { return false; }
});

Users.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});
