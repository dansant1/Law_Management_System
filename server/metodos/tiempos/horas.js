calcularTotal = function (datos) {
	var horasNoFacturadas,
		horas,
		encargados,
		group;

	let asunto = Asuntos.find({_id:datos.asunto.id}).fetch()[0];

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
					bufeteId:asunto.bufeteId,
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
				'profile.bufeteId':asunto.bufeteId
			}
		]
	}).fetch();


		let totalHoras = Horas.find({bufeteId:asunto.bufeteId,'asunto.id':datos.asunto.id,responsable:{$exists:true}}).fetch(),
		totalHorasNoCobradas = Horas.find({bufeteId:asunto.bufeteId,'asunto.id':datos.asunto.id,facturado:false,responsable:{$exists:true}}).fetch(),
		cambio = Cambio.find({bufeteId:asunto.bufeteId}).fetch()[0].cambio,
		costoResponsables = [],
		costoNoFacturadoResponsables = [],
		totalContable = 0,
		totalNoFacturado = 0,
		tipo_moneda = asunto.facturacion.tipo_moneda;



	totalHoras.forEach(function (hora) {
		// console.log(hora);
		let suma = 0;
		let costoResponsable = {}
		let tarifa = Tarifas.find({_id:asunto.facturacion.tarifa.id}).fetch()[0];

		tarifa.miembros.forEach(function (miembro) {
			// console.log(miembro);
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

	// console.log(horasNoFacturadas);

	console.log("[total monto] " + totalContable);
	if(horas[0])	console.log("[total horas] " + horas[0].total);
	console.log("[total monto de horas no facturadas] " + totalNoFacturado);
	if(horasNoFacturadas[0]) console.log("[total horas no facturadas] " + horasNoFacturadas[0].total);

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

	if(horas.length!=0){
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
	}

	if(horasNoFacturadas.length!=0){
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


}

Meteor.methods({
	'agregarHora': function (datos) {
		let _check = {
			descripcion: String,
			bufeteId: String,
			fecha: String,
			responsable: Object,
			asunto: Object,
			horas: String,
			minutos:String,
			// precio: String,
			cobrado:Boolean,
			esTarea:Boolean,
			creador:Object
		}
		if(datos.tarea) _check.tarea = Object;
		check(datos,_check );


		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

			//  Tareas.insert({
			// 	descripcion:datos.descripcion,
			// 	vence:new Date(datos.fecha+" GMT-0500"),
			// 	responsable:datos.responsable,
			// 	asunto:datos.asunto,
			// 	bufeteId:datos.bufeteId,
			// 	createdAt: new Date(),
			// 	creador: datos.creador,
			// 	abierto:true
			// })




			datos.fecha = new Date(datos.fecha + " GMT-0500");

			datos.horas = parseInt(datos.horas);
			datos.minutos = parseInt(datos.minutos)

			if(datos.minutos>60) {
				let horas = Number(String(datos.minutos/60).split(".")[0]);
				let minutos  = datos.minutos%60;

				datos.horas = parseInt(datos.horas) + horas;
				datos.minutos = minutos
			}

			console.log(datos.asunto.id);

			let asunto = Asuntos.find({_id:datos.asunto.id}).fetch()[0]
			console.log(asunto);
			let tarifa = Tarifas.find({_id:asunto.facturacion.tarifa.id}).fetch()[0]
			let cambio = Cambio.find({bufeteId:datos.bufeteId}).fetch()[0]

			tarifa.miembros.some(function (miembro) {
				if(miembro.id==datos.responsable.id){
					let costoxminuto, costoxhora;
					costoxhora = miembro.soles*datos.horas;
					costoxminuto = (miembro.soles/60)*datos.minutos;

					return datos.precio = Number(costoxhora) + Number(costoxminuto);
				}
			})

			if(!datos.precio){
				let user = Meteor.users.find({_id:datos.responsable.id}).fetch()[0];
				tarifa.roles.some(function (roles) {
					let costoxminuto, costoxhora;
					if(user.roles.bufete.length==1)
						if(user.roles.bufete[0]==roles.nombre){

							costoxhora = roles.soles*datos.horas;
							costoxminuto = (roles.soles/60)*datos.minutos;

							return datos.precio = Number(costoxhora) + Number(costoxminuto);

							// return datos.precio = ((asunto.facturacion.tarifa.tipo_moneda=="soles")? roles.soles*datos.horas : (roles.soles/cambio.cambio)*datos.horas).toFixed(2);

						}
					else {
						if(user.roles.bufete[1]==roles.nombre){
							costoxhora = roles.soles*datos.horas;
							costoxminuto = (roles.soles/60)*datos.minutos;
							return datos.precio =  Number(costoxhora) + Number(costoxminuto);
						}
					}
				})
			}
			console.log(datos.precio);

			datos.precio = datos.precio.toFixed(2)

			// datos.precio = parseInt(datos.precio);
			datos.horasFacturables = datos.horas;
			datos.minutosFacturables = datos.minutos;
			datos.esTarea = datos.esTarea? true : false;
			datos.cobrable = datos.cobrado;

			// datos.total = datos.horas * datos.precio;
			datos.creadorId = this.userId;
			datos.createdAt = new Date();
			datos.facturado = false;
			// console.log(datos.tarea);
			if(datos.esTarea) datos.descripcion = datos.tarea.nombre;

			let tarea = datos.tarea;
			let horas = {
				hora:datos.horas,
				minutos:datos.minutos
			}
			let horaId = Horas.insert(datos);
			console.log(tarea);
			if(datos.esTarea)
				Tareas.update({_id:tarea.id},{
					$set:{
						horas:{
							id: horaId,
							hora: horas.hora,
							minutos: horas.minutos
						}
					}
				})

			Meteor.defer(function () {
				calcularTotal(datos);
			})


		} else {
			return;
		}
	},
	'eliminarHora':function (horaId) {
		check(horaId,String);
		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			Horas.remove({_id:horaId})
		}
		else {
			return
		}
	},
	'actualizarHora':function (_horaId,datos) {
		check(datos,Object)
		check(_horaId,String)

		console.log('entro aqui');
		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

			//  Tareas.insert({
			// 	descripcion:datos.descripcion,
			// 	vence:new Date(datos.fecha+" GMT-0500"),
			// 	responsable:datos.responsable,
			// 	asunto:datos.asunto,
			// 	bufeteId:datos.bufeteId,
			// 	createdAt: new Date(),
			// 	creador: datos.creador,
			// 	abierto:true
			// })




			datos.fecha = new Date(datos.fecha + " GMT-0500");

			datos.horas = parseInt(datos.horas);
			datos.minutos = parseInt(datos.minutos)

			if(datos.minutos>60) {
				let horas = Number(String(datos.minutos/60).split(".")[0]);
				let minutos  = datos.minutos%60;

				datos.horas = parseInt(datos.horas) + horas;
				datos.minutos = minutos
			}

			console.log(datos.asunto.id);

			let asunto = Asuntos.findOne({_id:datos.asunto.id});
			// console.log(asunto);

			let tarifa = Tarifas.findOne({_id:asunto.facturacion.tarifa.id});
			let cambio = Cambio.findOne({bufeteId:datos.bufeteId})
			console.log("[ID RESPONSABLE] "+ datos.responsable.id);
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
				console.log("[USUARIO]",user);
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
			console.log("[HORA ID] " + _horaId);
			console.log("[PRECIO] " +datos.precio);

			datos.precio = datos.precio.toFixed(2)

			// datos.precio = parseInt(datos.precio);
			datos.horasFacturables = datos.horas;
			datos.minutosFacturables = datos.minutos;
			datos.esTarea = datos.esTarea? true : false;
			datos.cobrable = datos.cobrado;

			// datos.total = datos.horas * datos.precio;
			datos.creadorId = this.userId;
			datos.createdAt = new Date();
			datos.facturado = false;
			// console.log(datos.tarea);
			if(datos.esTarea) datos.descripcion = datos.tarea.nombre;

			let tarea = datos.tarea;
			let horas = {
				hora:datos.horas,
				minutos:datos.minutos
			}

			let horaId = Horas.update({
				_id:_horaId
			},{
				$set:datos
			});

			console.log(tarea);
			if(datos.esTarea)
				Tareas.update({_id:tarea.id},{
					$set:{
						horas:{
							id: horaId,
							hora: horas.hora,
							minutos: horas.minutos
						}
					}
				})

			Meteor.defer(function () {
				calcularTotal(datos);
			})


		} else {
			return;
		}


	},
	'agregarHoraSinDetalles': function (datos) {
		check(datos, {
			bufeteId: String,
			fecha: Date,
			// responsable: Object,
			horas: String,
			minutos:String,
			// precio: String,
			creador:Object,
			responsable:Object
		});


		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			datos.fecha = new Date();


			datos.horas = parseInt(datos.horas);
			datos.minutos = parseInt(datos.minutos)
			// datos.precio = parseInt(datos.precio);
			datos.horasFacturables = datos.horas;
			datos.minutosFacturables = datos.minutos;
			// datos.tarea = datos.tarea? true : false;
			// datos.cobrable = datos.cobrado;

			// datos.total = datos.horas * datos.precio;
			datos.creadorId = this.userId;
			datos.createdAt = new Date();
			datos.facturado = false;

			Horas.insert(datos);

		}
	},
	'actualizarDescripcion' : function (datos) {
		check(datos,Object);

		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

			Horas.update({_id:datos.id},{$set:{
				descripcion:datos.descripcion
			}})


		} else {
			return;
		}

	},
	'actualizarAsunto':function (_datos) {
		check(_datos,Object)

		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

			Horas.update({_id:_datos.id},{$set:{
				asunto:_datos.asunto
			}})

			let asunto = Asuntos.findOne({_id:_datos.asunto.id});
			// console.log(asunto);

			let tarifa = Tarifas.findOne({_id:asunto.facturacion.tarifa.id});
			let cambio = Cambio.findOne({bufeteId:_datos.bufeteId})
			let datos = Horas.findOne({_id:_datos.id});

			console.log("[ID RESPONSABLE] "+ datos.responsable.id);
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
			console.log('SE ESTA GUARDANDO');
			Horas.update({_id:datos._id},{
				$set:{
					precio: datos.precio
				}
			})

			calcularTotal(datos)

		} else {
			return;
		}

	},
	'agregarGastoAdministrativo': function (datos) {
		check(datos,{
			descripcion: String,
			bufeteId: String,
			fecha: String,
			monto:String
		})

		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {



			datos.monto = parseInt(datos.monto);
			datos.administrativo = true;
			datos.creadorId = this.userId;
			datos.createdAt = new Date();


			return {
				gastoId: Gastos.insert(datos)
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
			datos.administrativo = false
			datos.creadorId = this.userId;
			datos.createdAt = new Date();


			return {
				gastoId: Gastos.insert(datos)
			}
		} else {
			return;
		}
	}
});
