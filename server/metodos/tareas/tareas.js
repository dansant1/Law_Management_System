function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
Meteor.methods({
	crearTarea: function (datos) {
		console.log('Entro aqui');
		let _check = {
			asunto: Object,
			bufeteId: String,
			creador: Object
		}
		if(datos.tipo) 	_check.tipo = String;
		if(datos.fecha)  _check.fecha = String;
		if(datos.descripcion) _check.descripcion = String;
		if(datos.asignado) _check.asignado = Object;
		if(datos.etapa) _check.etapa = Object;
		check(datos, _check);

		if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {

			datos.createdAt = new Date();
			datos.vence	= new Date(datos.fecha+" GMT-0500");
			datos.abierto = true;
			console.log(datos);

			let tarea = Tareas.insert(datos);

			// Modulo para crear evento sobre que se ha creado una tarea
			if (tarea) {
				var date = moment(datos.fecha);


				let evento = {
					title: datos.descripcion,
					start: formatDate(datos.vence),
					asunto: datos.asunto,
					bufeteId: datos.bufeteId,
					creador: datos.creador,
					createdAt: datos.createdAt,
					color: '#34495e',
					tarea: {
						nombre: datos.descripcion,
						id: tarea
					}
				}

				scheduleMail(datos,tarea);
				Eventos.insert(evento);
				MiCalendario.insert(evento);

				/*NewsFeed.insert({
					descripcion: datos.creador.nombre + ' asignado a la tarea ' + datos.descripcion + ' en el asunto ' + datos.asunto.nombre,
					tipo: 'Tarea',
					creador: {
						nombre: datos.creador.nombre,
						id: datos.creador.id
					},
					asunto: {
						nombre: datos.asunto.nombre,
						id: datos.asunto.id
					},
					bufeteId: datos.bufeteId,
					createdAt: new Date()
				});*/

				return {
					_id: tarea
				}
			} else {
				return;
			}



		} else {

			return;

		}
	},
	editarTareas: function (datos,tareaId) {
		check(datos,Object)
		check(tareaId,String)

		datos.vence = new Date(datos.fecha+" GMT-0500");

		var date = moment(datos.fecha);
		date.toISOString();
		//console.log(date.toISOString());

		Tareas.update({_id:tareaId},{
			$set:datos
		});

	},
	eliminarTarea:function (tareaId) {
		check(tareaId,String)
        MiCalendario.remove({'tarea.id':tareaId})
        Eventos.remove({'tarea.id':tareaId});
		Tareas.remove({_id:tareaId})

	},
	agregarHoraTarea: function (datos) {
		check(datos,Object)
		console.log(datos);
		let tarea = Tareas.find({_id:datos.id}).fetch()[0]
		if(!tarea.vence)	datos.fecha = new Date();
		else datos.fecha = new Date(tarea.vence + " GMT-0500");

		datos.horas = parseInt(datos.horas);
		datos.minutos = parseInt(datos.minutos)
		// datos.precio = parseInt(datos.precio);
		datos.horasFacturables = datos.horas;
		datos.minutosFacturables = datos.minutos;

		datos.esTarea = true;
		datos.cobrable = true;

		// datos.total = datos.horas * datos.precio;
		datos.creadorId = this.userId;
		datos.createdAt = new Date();
		datos.facturado = false;
		datos.descripcion = tarea.descripcion;

		let tareaId = datos.id;

		if(datos.minutos>=60) {
			let horas = Number(String(datos.minutos/60).split(".")[0]);
			let minutos  = datos.minutos%60;

			datos.horas = parseInt(datos.horas) + horas;
			datos.minutos = minutos
		}

		// if(datos.asunto){
		// 	let asunto = Asuntos.findOne({_id:datos.asunto.id})
		// 	console.log(asunto);
		// 	let tarifa = Tarifas.findOne({_id:asunto.facturacion.tarifa.id})
		// 	let cambio = Cambio.findOne({bufeteId:datos.bufeteId})
        //
		// 	tarifa.miembros.some(function (miembro) {
		// 		if(miembro.id==datos.responsable.id){
		// 			let costoxminuto, costoxhora;
		// 			costoxhora = miembro.soles*datos.horas;
		// 			costoxminuto = (miembro.soles/60)*datos.minutos;
        //
		// 			return datos.precio = Number(costoxhora) + Number(costoxminuto);
		// 		}
		// 	})
        //
		// 	if(!datos.precio){
		// 		let user = Meteor.users.findOne({_id:datos.responsable.id});
		// 		tarifa.roles.some(function (roles) {
		// 			let costoxminuto, costoxhora;
		// 			if(user.roles.bufete.length==1)
		// 				if(user.roles.bufete[0]==roles.nombre){
        //
		// 					costoxhora = roles.soles*datos.horas;
		// 					costoxminuto = (roles.soles/60)*datos.minutos;
        //
		// 					return datos.precio = Number(costoxhora) + Number(costoxminuto);
        //
		// 					// return datos.precio = ((asunto.facturacion.tarifa.tipo_moneda=="soles")? roles.soles*datos.horas : (roles.soles/cambio.cambio)*datos.horas).toFixed(2);
        //
		// 				}
		// 			else {
		// 				if(user.roles.bufete[1]==roles.nombre){
		// 					costoxhora = roles.soles*datos.horas;
		// 					costoxminuto = (roles.soles/60)*datos.minutos;
		// 					return datos.precio =  Number(costoxhora) + Number(costoxminuto);
		// 				}
		// 			}
		// 		})
		// 	}
		// 	// console.log(datos.precio);
        //
		// 	datos.precio = datos.precio.toFixed(2)
		// }

		let horaId = Horas.insert(datos);
		console.log(horaId);
		Tareas.update({_id:tareaId},{
			$set:{
				horas:{
					id:horaId,
					hora: datos.horas,
					minutos: datos.minutos
				}
			}
		})


		// Modulo para crear evento sobre que se ha creado una tarea




	},
	crearTareaEtapa:function (datos) {
		check(datos,Object)

		if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {

			datos.createdAt = new Date();
			datos.vence	= new Date();
			datos.abierto = true;

			let tarea = Tareas.insert(datos);
			// Modulo para crear evento sobre que se ha creado una tarea

		} else {

			return;

		}
	},

	actualizarAsuntoTarea(datos){
		check(datos,Object)


		Tareas.update({_id:datos.tareaId}, {
			$set: {
				asunto: datos.asunto,
				etapa: datos.etapa
			}
		})

		let tarea = Tareas.findOne({_id:datos.tareaId})

		if(tarea.horas){

			Horas.update({_id:tarea.horas.id},{
				$set:{
					asunto:tarea.asunto
				}
			})

			let asunto = Asuntos.findOne({_id:tarea.asunto.id});
			// console.log(asunto);
			console.log(tarea);
			let tarifa = Tarifas.findOne({_id:asunto.facturacion.tarifa.id});
			let cambio = Cambio.findOne({bufeteId:tarea.bufeteId})
			let datos = Horas.findOne({_id:tarea.horas.id});

			console.log("[ID RESPONSABLE] "+ tarea.asignado.id);
			console.log("[TARIFA] ",tarifa._id);
			tarifa.miembros.some(function (miembro) {
				if(miembro.id==datos.responsable.id){
					let costoxminuto, costoxhora;
					costoxhora = miembro.soles*datos.horas;
					costoxminuto = (miembro.soles/60)*datos.minutos;

					return datos.precio = Number(costoxhora) + Number(costoxminuto);
				}
			})

			if(!datos.precio){
				let user = Meteor.users.findOne({_id:datos.responsable.id});
				// console.log("[USUARIO]",user);
				tarifa.roles.some(function (roles) {
					let costoxminuto, costoxhora;
					console.log("[ROL T]",user.roles.bufete.length);
					if(user.roles.bufete.length==1){

						if(user.roles.bufete[0]==roles.nombre){
							costoxhora = roles.soles*datos.horas;
							costoxminuto = (roles.soles/60)*datos.minutos;

							return datos.precio = Number(costoxhora) + Number(costoxminuto);
							// return datos.precio = ((asunto.facturacion.tarifa.tipo_moneda=="soles")? roles.soles*datos.horas : (roles.soles/cambio.cambio)*datos.horas).toFixed(2);
						}
					}
					else {
						console.log("[ROLE]",user.roles.bufete[1]);
						if(user.roles.bufete[1]==roles.nombre){
							costoxhora = roles.soles*datos.horas;
							costoxminuto = (roles.soles/60)*datos.minutos;
							return datos.precio =  Number(costoxhora) + Number(costoxminuto);
						}
					}
				})
			}
			// console.log("[HORA ID] " + _horaId);
			console.log("[PRECIO] " +datos.precio);

			datos.precio = datos.precio.toFixed(2)

			Horas.update({_id:tarea.horas.id},{
				$set:{
					precio: datos.precio
				}
			})
		}
	},
	actualizarMiembroTarea(tareaId,asignado){
		check(tareaId,String)
		check(asignado,{
			nombre: String,
			id: String
		});


		Tareas.update({_id:tareaId}, {
			$set: {
				asignado: asignado
			}
		})

		var tareas = Tareas.find({_id:tareaId,vence:{$exists:true},asignado:{$exists:true}}).fetch()
		if(tareas.length!=0) scheduleMail(tareas[0],tareas[0]._id);

	},

	actualizarFechaTarea(tareaId,fecha){
		check(tareaId,String)
		check(fecha,String)

        let tarea = Tareas.findOne({_id:tareaId});

		Tareas.update({_id:tareaId},{
			$set:{
				vence: new Date(fecha+" GMT-0500")
			}
		})

        var date = moment(datos.fecha);


        // let evento = {
        //     title: tarea.descripcion,
        //     start: formatDate(datos.vence),
        //     asunto: tarea.asunto,
        //     bufeteId: tarea.bufeteId,
        //     creador: tarea.creador,
        //     createdAt: tarea.createdAt,
        //     color: '#34495e',
        //     tarea: {
        //         nombre: tarea.descripcion,
        //         id: tareaId
        //     }
        // }
        Eventos.update({'tarea.id':tareaId},{
            $set:{
                start: formatDate(fecha)
            }
        })


        MiCalendario.update({'tarea.id':tareaId},{
            $set:{
                start: formatDate(fecha)
            }
        });


        // Eventos.insert(evento);
        // MiCalendario.insert(evento);


		/*var date = moment(fecha).toISOString();

		if (MiCalendario.findOne({'tarea.id': tareaId})) {
			MiCalendario.update({'tarea.id': tareaId}, {
				$set: {
					start: formatDate(new Date(fecha+" GMT-0500"))
				}
			});
		} else {
			MiCalendario.insert({
				title: 'Vence la tarea ' + Tareas.findOne({_id: tareaId}).descripcion,
				start: formatDate(new Date(fecha+" GMT-0500")),
				bufeteId: Meteor.users.findOne({_id: this.userId}).profile.bufeteId,
				creador: {
					nombre: Meteor.users.findOne({_id: this.userId}).profile.nombre + " " + Meteor.users.findOne({_id: this.userId}).profile.apellido,
					id: this.userId
				},
				userId: this.userId,
				type: 'Tarea'
			});
		}*/



		var tareas = Tareas.find({_id:tareaId,vence:{$exists:true},asignado:{$exists:true}}).fetch()
		if(tareas.length!=0) scheduleMail(tareas[0],tareas[0]._id);

	},
	cerrarTarea: function (tareaId) {
		check(tareaId, String);

		if (this.userId) {
			Tareas.update({_id: tareaId}, {
				$set: {
					abierto: false
				}
			});
		} else {
			return;
		}
	},
	abrirTarea: function (tareaId) {
		check(tareaId, String);
		if (this.userId) {
			Tareas.update({_id: tareaId}, {
				$set: {
					abierto: true
				}
			});
		} else {
			return;
		}
	},
	agregarComentarioATarea: function (datos) {
		check(datos, {
			comentario: String,
			tareaId: String,
			creador: Object,
			bufeteId: String
		});



		if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

			// console.log('Entro aqui');
			datos.createdAt = new Date();
			ComentariosDeTareas.insert(datos);

			let tarea = Tareas.find({_id:datos.tareaId}).fetch()[0];
			if(tarea.asunto){

				let asunto = Asuntos.find({_id:tarea.asunto.id}).fetch()[0];

				for (var i = 0; i < asunto.abogados.length; i++) {
					let miembro = Meteor.users.find({_id:asunto.abogados[i].id}).fetch()[0];

					//if(miembro._id===datos.creador.id) return;

					var fechaFormateada = datos.createdAt.getDate() + "/" + (datos.createdAt.getMonth()+1) + "/" + datos.createdAt.getFullYear();

					Email.send({
						to: miembro.emails[0].address,
						from: "notificacion@bunqr.pw",
						subject: 'Notificacion BUNQR',
						html: datos.creador.nombre + " comento la tarea " + tarea.descripcion + " a las " + fechaFormateada + " en el asunto " + asunto.caratula
					})
				}
			}


		} else {
			return;
		}

	},
	crearSubtarea: function (datos) {
		check(datos, {
			descripcion: String,
			tareaId: String,
			bufeteId: String
		});

		if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			datos.createdAt = new Date();
			datos.creadorId = this.userId;
			datos.abierto = true;
			Subtareas.insert(datos);
		} else {
			return;
		}
	},
	agregarTarea: function (datos) {

		let _check = {
			descripcion: String,
			bufeteId: String,
			creador: Object
		}
		if(datos.etapa) _check.etapa = Object;
		if(datos.asunto) _check.asunto = Object;

		check(datos, _check );

		if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {

			datos.createdAt = new Date();
			datos.abierto = true;
			datos.asignado = datos.creador

			let tarea = Tareas.insert(datos);



			// Modulo para crear evento sobre que se ha creado una tarea
			if (tarea) {

				return {
					_id: tarea
				}

			} else {
				return;
			}



		} else {

			return;

		}
	},
	agregarTareaAsunto: function (datos) {

		check(datos, {
			descripcion: String,
			bufeteId: String,
			creador: Object,
			asunto: Object
		});

		if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {

			datos.createdAt = new Date();
			datos.abierto = true;
			datos.asignado = datos.creador
			datos.asunto.nombre = Asuntos.findOne({_id: datos.asunto.id}).caratula

			let tarea = Tareas.insert(datos);



			// Modulo para crear evento sobre que se ha creado una tarea
			if (tarea) {

				return {
					_id: tarea
				}

			} else {
				return;
			}



		} else {

			return;

		}
	},
	crearTareaKanban: function (datos) {
		check(datos, {
			descripcion: String,
			etapa: Object,
			bufeteId: String,
			creador: Object,
			asunto: Object
		});

		if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {

			datos.creador.id = this.userId,
			datos.asignado = {
				nombre: datos.creador.nombre,
				id: this.userId
			}

			datos.asunto.nombre = Asuntos.findOne({_id: datos.asunto.id}).caratula;


			datos.abierto = true;
			datos.tipo = 'General';
			datos.createdAt = new Date();


			let tarea = Tareas.insert(datos);

			if (tarea) {
				NewsFeed.insert({
					descripcion: " " + datos.asignado.nombre + ' asignado a la tarea ' + datos.descripcion + ' en el asunto ' + datos.asunto.nombre,
					tipo: 'Tarea',
					creador: {
						nombre: datos.creador.nombre,
						id: datos.creador.id
					},
					asunto: {
						nombre: datos.asunto.nombre,
						id: datos.asunto.id
					},
					bufeteId: datos.bufeteId,
					createdAt: datos.createdAt
				});
			}
		}
	},
	cerrarSubTarea: function (SubtareaId) {
		check(SubtareaId, String);

		if (this.userId) {
			Subtareas.update({_id: SubtareaId}, {
				$set: {
					abierto: false
				}
			});
		}
	},
	abrirSubtarea: function (SubtareaId) {
		check(SubtareaId, String);

		if (this.userId) {
			Subtareas.update({_id: SubtareaId}, {
				$set: {
					abierto: true
				}
			});
		}
	},
	abrirTarea: function (tareaId) {
		check(tareaId, String);

		if (this.userId) {
			Tareas.update({_id: tareaId}, {
				$set: {
					abierto: true
				}
			});
		}
	},
	cerrarEtapa: function (etapaId) {
		check(etapaId, String);
		if (this.userId) {
			Etapas.update({_id: etapaId}, {
				$set: {
					abierto: false
				}
			});
		}
	},
	abrirEtapa: function (etapaId) {
		check(etapaId, String);
		if (this.userId) {
			Etapas.update({_id: etapaId}, {
				$set: {
					abierto: true
				}
			});
		} else {
      return;
    }
	},
  actualizarNombreEtapa: function (datos) {
    check(datos, {
      nombre: String,
      id: String
    });

    if (this.userId) {
      Etapas.update({_id: datos.id}, {
        $set: {
          nombre: datos.nombre
        }
      });
    } else {
      return;
    }
  }
});
