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




    SyncedCron.add({
        name: Random.id(),
        schedule: function(parser) {
            return parser.recur().on('08:00:00').time();
        },
        job: function() {

            enviarNotificacionTareasYEventos();
            return;
        }
    });


    SyncedCron.start();

});
