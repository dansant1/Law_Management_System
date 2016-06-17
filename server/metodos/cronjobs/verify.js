enviarNotificacionTareasYEventos = function () {

    let hoy = new Date()
    hoy.setHours(0,0,0,0);

    let mañana = new Date();
    mañana.setDate(mañana.getDate()+1)
    mañana.setHours(0,0,0,0)

    // console.log(hoy,mañana)

    var tareas = Tareas.aggregate({
        $match:{
            asignado:{$exists:true},
            vence:{
                $exists:true,
                $gte:hoy,
                $lt:mañana
            }
        }
    },{
        $project:
        {
            'responsable':'$asignado.id',
            'nombre_responsable':'$asignado.nombre',
            'descripcion':'$descripcion'
        }
    });

    var eventos = MiCalendario.aggregate({
        $match:{
            end: {
                $gte:hoy,
                $lt:mañana
            }
        }
    }, {
        $project:{
            'userId':'$userId',
            'title':'$title',
        }
    })

    let eventosAgrupados = _.groupBy(eventos,'userId');
    for (var key in eventosAgrupados) {
        if (eventosAgrupados.hasOwnProperty(key)) {
            // console.log(key);
            let asignado = Meteor.users.find({_id:key}).fetch()[0]
            if(asignado){
                let message ="<p>Tiene " + eventosAgrupados[key].length + " evento(s) pendiente(s) que vencen hoy: </p> ";
                let listaEventos = "<ul>";

                for (var i = 0; i < eventosAgrupados[key].length; i++) {
                    let item = "<li>Evento: " + eventosAgrupados[key][i].title+"</li>"
                    listaEventos += item;
                }

                message += (listaEventos+"</ul>");
                console.log("[Eventos] Se enviara el correo a" + asignado.emails[0].address);
                Email.send({
                    from: 'notificaciones@bunqr.pw',
                    to: asignado.emails[0].address,
                    subject: 'Notificacion de eventos por vencer',
                    html:'Hola ' + asignado.profile.nombre + " " + asignado.profile.apellido + '<br> ' +"\n"+ message
                });

            }
        }
    }



    let group = _.groupBy(tareas,"responsable");
    // console.log(group)
    for (var key in group) {
        if (group.hasOwnProperty(key)) {
            // console.log(key);
            let asignado = Meteor.users.find({_id:key}).fetch()[0];

            if(asignado){
                // let eventos = MiCalendario.find({userId:asignado._id}).fetch()
                let message ="<p>Tiene " + group[key].length + " tarea(s) pendiente(s) que vencen hoy: </p> ";
                let listaTareas = "<ul>";

                for (var i = 0; i < group[key].length; i++) {
                    let item = "<li>Tarea: " + group[key][i].descripcion+"</li>"
                    listaTareas += item;
                }



                message += (listaTareas+"</ul>");

                console.log('[Tareas] Se enviara el correo a ' + asignado.emails[0].address);
                Email.send({
                    from: 'notificaciones@bunqr.pw',
                    to: asignado.emails[0].address,
                    subject: 'Notificacion de tareas por vencer',
                    html:'Hola ' + asignado.profile.nombre + " " + asignado.profile.apellido + ' ' +"\n"+ message
                });
            }
        }
    }

}
