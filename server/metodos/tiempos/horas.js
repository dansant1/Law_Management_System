Meteor.methods({
	'agregarHora': function (datos) {
		check(datos, {
			descripcion: String,
			bufeteId: String,
			fecha: String,
			responsable: Object,
			asunto: Object,
			horas: String,
			minutos:String,
			// precio: String,
			cobrado:Boolean,
			tarea:Boolean,
			creador:Object
		});


		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

			console.log(datos)
			if(datos.tarea) Tareas.insert({
				descripcion:datos.descripcion,
				vence:new Date(datos.fecha+" GMT-0500"),
				responsable:datos.responsable,
				asunto:datos.asunto,
				bufeteId:datos.bufeteId,
				createdAt: new Date(),
				creador: datos.creador,
				abierto:true
			})




			datos.fecha = new Date(datos.fecha + " GMT-0500");

			datos.horas = parseInt(datos.horas);
			datos.minutos = parseInt(datos.minutos)
			// datos.precio = parseInt(datos.precio);
			datos.horasFacturables = datos.horas;
			datos.minutosFacturables = datos.minutos;
			datos.tarea = datos.tarea? true : false;
			datos.cobrable = datos.cobrado;

			datos.total = datos.horas * datos.precio;
			datos.creadorId = this.userId;
			datos.createdAt = new Date();
			datos.facturado = false;

			Horas.insert(datos);

			var horas = Horas.aggregate({
					$match:{
						bufeteId:datos.bufeteId
					}
				},{
					$group:{
						_id:"",
						total:{
							$sum:'$horas'
						}
					}
				});
			console.log(horas);
			let asunto = Asuntos.find({_id:datos.asunto.id}).fetch()[0];
			console.log(asunto.facturacion.alertas.horas);

			// let totalHoras = Horas.find({bufeteId:datos.bufeteId}).fetch()
			//
			// for (var i = 0; i < totalHoras.length; i++) {
			// 	totalHoras
			// }

			if(asunto.facturacion.alertas.horas<horas[0].total){
				// console.log('Entro aqui');
				let encargados = Meteor.users.find({
					$and:[
						{
							$or:[
								{
									"roles.bufete":'administrador'
								},
								{
									"roles.bufete":'encargado comercial'
								}
							]
						},
						{
							'profile.bufeteId':datos.bufeteId
						}
					]
				}).fetch();

				// db.users.find({$or:[{'roles.bufete':'encargado comercial'},{'roles.bufete':'encargado comercial'}]})
				Meteor.defer(function () {
					console.log(encargados.length);
					for (var i = 0; i < encargados.length; i++) {
						console.log('se envio el correo');
						console.log(encargados[i].emails[0].address);
						Email.send({
							to: encargados[i].emails[0].address,
							from: "daniel@grupoddv.pw",
							subject: "Notificacion de horas de trabajo",
							html: "Hola " + encargados[i].profile.nombre + " " + encargados[i].profile.apellido + ", el cliente " + asunto.cliente.nombre + " ha superado el limite de horas de " + asunto.facturacion.alertas.horas + " horas. Saludos"
						});
					}
				})
			}


		} else {
			return;
		}
	},
	'agregarGasto': function (datos) {
		check(datos, {
			descripcion: String,
			bufeteId: String,
			fecha: String,
			responsable: Object,
			asunto: Object,
			monto: String
		});

		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {



			datos.monto = parseInt(datos.monto);

			datos.creadorId = this.userId;
			datos.createdAt = new Date();


			Gastos.insert(datos);

		} else {
			return;
		}
	}
});
