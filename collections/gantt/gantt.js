TasksCollection = new Mongo.Collection("tasks");
LinksCollection = new Mongo.Collection("links");

TasksCollection.allow({
    insert: function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return true; 
    }
});

LinksCollection.allow({
    insert: function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return true; 
    }
});
