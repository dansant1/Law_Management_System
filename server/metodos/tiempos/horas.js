Meteor.methods({
	'agregarHora': function (datos) {
		check(datos, {
			descripcion: String,
			bufeteId: String,
			fecha: String,
			responsable: Object,
			asunto: Object,
			horas: String,
			precio: String
		});

		

		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

			//datos.horas = datos.horas.toFixed(2);
			datos.horas = parseInt(datos.horas);
			datos.precio = parseInt(datos.precio);

			datos.total = datos.horas * datos.precio;
			datos.creadorId = this.userId;
			datos.createdAt = new Date();


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