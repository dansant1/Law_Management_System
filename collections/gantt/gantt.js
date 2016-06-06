TasksCollection = new Mongo.Collection("tasks");
LinksCollection = new Mongo.Collection("links");

TasksCollection.allow({
    insert: function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return true; 
    },
    update: function (userId,doc) {
      return true;
    },
    remove: function (userId,doc) {
      return true;
    }
});

LinksCollection.allow({
    insert: function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return true; 
    },
    update: function (userId,doc) {
      return true;
    },
    remove: function (userId,doc) {
      return true;
    }
});
