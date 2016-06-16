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

			var horasNoFacturadas,
				horas,
				encargados,
				group;

			group = {
				$group:{
					_id:"",
					total:{
						$sum:'$horas'
					}
				}
			}

			horasNoFacturadas = Horas.aggregate({
				$match:{
					$and:[
						{
							bufeteId:datos.bufeteId,
						},
						{
							'asunto.id':datos.asunto.id,
						},
						{
							facturado:false
						}
					]
				}
			},group)

			horas = Horas.aggregate({
				$match:{
					$and:[
						{
							bufeteId:datos.bufeteId,
						},
						{
							'asunto.id':datos.asunto.id
						}
					]
				}
			},group);

			encargados = Meteor.users.find({
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


			let asunto = Asuntos.find({_id:datos.asunto.id}).fetch()[0],
				totalHoras = Horas.find({bufeteId:datos.bufeteId,'asunto.id':datos.asunto.id}).fetch(),
				totalHorasNoCobradas = Horas.find({bufeteId:datos.bufeteId,'asunto.id':datos.asunto.id,facturado:false}).fetch(),
				cambio = Cambio.find({bufeteId:datos.bufeteId}).fetch()[0].cambio,
				costoResponsables = [],
				costoNoFacturadoResponsables = [],
				totalContable = 0,
				totalNoFacturado = 0,
				tipo_moneda = asunto.facturacion.tipo_moneda;



			totalHoras.forEach(function (hora) {

				let suma = 0;
				let costoResponsable = {}
				let tarifa = Tarifas.find({_id:asunto.facturacion.tarifa.id}).fetch()[0];

				tarifa.miembros.forEach(function (miembro) {

					if(miembro.id==hora.responsable.id){
						if(tipo_moneda=="soles") suma += hora.horas*miembro.soles;
						else suma += hora.horas*(miembro.soles/cambio)
						return;
					}

					let responsable = Meteor.users.find({_id:hora.responsable.id}).fetch()[0];
					let rol_responsable = responsable.roles.bufete[1];

					tarifa.roles.forEach(function (rol) {
						if(rol_responsable==rol.nombre){
							if (tipo_moneda=="soles") suma+= hora.horas*rol.soles
							else suma+= hora.horas*(rol.soles/cambio);
						}
					});
				});

				costoResponsable.id = hora.responsable.id;
				costoResponsable.total = suma;

				costoResponsables.push(costoResponsable);
			})

			totalHorasNoCobradas.forEach(function (hora) {
				let suma = 0;
				let costoResponsable = {}
				let tarifa = Tarifas.find({_id:asunto.facturacion.tarifa.id}).fetch()[0];
				tarifa.miembros.forEach(function (miembro) {

					if(miembro.id==hora.responsable.id){
						if(tipo_moneda=="soles") suma += hora.horas*miembro.soles;
						else suma += hora.horas*(miembro.soles/cambio)
						return;
					}

					let responsable = Meteor.users.find({_id:hora.responsable.id}).fetch()[0];
					let rol_responsable = responsable.roles.bufete[1];

					tarifa.roles.forEach(function (rol) {
						if(rol_responsable==rol.nombre){
							if (tipo_moneda=="soles") suma+= hora.horas*rol.soles
							else suma+= hora.horas*(rol.soles/cambio);
						}
					})

				})
				costoResponsable.id = hora.responsable.id;
				costoResponsable.total = suma;

				costoNoFacturadoResponsables.push(costoResponsable);

			})

			costoNoFacturadoResponsables.forEach(function (costoNoFacturadoResponsable) {
				totalNoFacturado += costoNoFacturadoResponsable.total;
			})

			costoResponsables.forEach(function (costoResponsable) {
				totalContable+= costoResponsable.total;
			})

			console.log("[total monto] " + totalContable);
			console.log("[total horas] " + horas[0].total);
			console.log("[total monto de horas no facturadas] " + totalNoFacturado);
			console.log("[total horas no facturadas] " + horasNoFacturadas[0].total);

			if(asunto.facturacion.alertas.monto<totalContable){
				Meteor.defer(function () {
					for (var i = 0; i < encargados.length; i++) {
						console.log('[Alerta Monto] Se envio el correo');
						Email.send({
							to: encargados[i].emails[0].address,
							from: "notificaciones@bunqr.pw",
							subject: "Notificacion de monto de horas de trabajo",
							html: "Hola " + encargados[i].profile.nombre + " " + encargados[i].profile.apellido + ", el cliente " + asunto.cliente.nombre + " ha superado el limite de monto de " + asunto.facturacion.alertas.monto + " " + tipo_moneda + ". Saludos"
						});
					}
				})
			}

			if(asunto.facturacion.alertas.horas<horas[0].total){
				// console.log('Entro aqui');

				// db.users.find({$or:[{'roles.bufete':'encargado comercial'},{'roles.bufete':'encargado comercial'}]})
				Meteor.defer(function () {
					for (var i = 0; i < encargados.length; i++) {
						console.log('[Alerta Horas] Se envio el correo');
						Email.send({
							to: encargados[i].emails[0].address,
							from: "notificaciones@bunqr.pw",
							subject: "Notificacion de horas de trabajo",
							html: "Hola " + encargados[i].profile.nombre + " " + encargados[i].profile.apellido + ", el cliente " + asunto.cliente.nombre + " ha superado el limite de horas de " + asunto.facturacion.alertas.horas + " horas. Saludos"
						});
					}
				})
			}

			if(asunto.facturacion.alertas.horas_no_cobradas<horasNoFacturadas[0].total){
				Meteor.defer(function () {
					for (var i = 0; i < encargados.length; i++) {
						console.log('[Alerta horas no facturadas] Se envio el correo');
						Email.send({
							to: encargados[i].emails[0].address,
							from: "notificaciones@bunqr.pw",
							subject: "Notificacion de horas no facturadas de trabajo",
							html: "Hola " + encargados[i].profile.nombre + " " + encargados[i].profile.apellido + ", el cliente " + asunto.cliente.nombre + " ha superado el limite de horas no facturadas de " + asunto.facturacion.alertas.horas_no_cobradas + " horas. Saludos"
						});
					}
				})
			}

			if(asunto.facturacion.alertas.monto_horas_no_cobradas<totalNoFacturado){

				Meteor.defer(function () {
					for (var i = 0; i < encargados.length; i++) {
						console.log('[Alerta monto de horas no facturadas] Se envio el correo');
						Email.send({
							to: encargados[i].emails[0].address,
							from: "notificaciones@bunqr.pw",
							subject: "Notificacion de monto de horas no facturadas de trabajo",
							html: "Hola " + encargados[i].profile.nombre + " " + encargados[i].profile.apellido + ", el cliente " + asunto.cliente.nombre + " ha superado el monto limite no facturado de " + asunto.facturacion.alertas.monto_horas_no_cobradas +  " " + tipo_moneda + ". Saludos"
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
