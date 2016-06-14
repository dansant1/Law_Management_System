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
