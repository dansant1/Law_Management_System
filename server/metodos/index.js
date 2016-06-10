Meteor.startup(function() {


    Tareas.find({asignado:{$exists:true},vence:{$exists:true}}).forEach(function(tarea) {

            let date = new Date(tarea.vence);
            date.setDate(date.getDate()-1);

    		if ( date.getDate() === (new Date()).getDate()) {
    			sendMail(tarea)
    		} else {
    			addTask(tarea._id, tarea);
    		}
	});

    SyncedCron.start();

});
