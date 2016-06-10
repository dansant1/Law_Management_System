
scheduleMail= function(tarea,tareaId) {
    let date = new Date(tarea.vence);
    date.setDate(date.getDate()-1);

    if ( date.getDate() === (new Date()).getDate()) {
		sendMail(tarea);
	} else {
		addTask(tareaId, tarea);
	}
	return true;
}

addTask = function(id, tarea) {

   SyncedCron.add({
       name: id,
       schedule: function(parser) {

           let date = new Date(tarea.vence)
           date.setDate(date.getDate()-1);

           return parser.recur().on(date).fullDate();
       },
       job: function() {
           sendMail(tarea);
           FutureTasks.remove(id);
           SyncedCron.remove(id);
           return id;
       }
   });

}


sendMail = function(tarea) {
   let asignado = Meteor.users.find({_id:tarea.asignado.id}).fetch()[0];

   Email.send({
       from: 'notificaciones@bunqr.pw',
       to: asignado.emails[0].address,
       subject: 'Notificacion',
       html:'Hola ' + asignado.profile.nombre + " " + asignado.profile.apellido + ', La tarea ' + tarea.descripcion + ' esta a un dia de vencer. Saludos,'
   });

}
