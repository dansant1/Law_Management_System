 Meteor.methods({
	crearCliente: function (datos) {

        let dataCheck = {
            nombre: String,
			apellido: String,
			bufeteId: String,
			email: String,
			identificacion: String,
			direccion: String,
			telefono: String,
			celular: String,
			provincia: String,
			pais: String,
			autor: String
        }

        if(datos.facturacion) dataCheck.facturacion = Object

		check(datos, dataCheck);

		datos.nombreCompleto = datos.nombre + " " + datos.apellido;
		datos.createdAt = new Date();
		datos.creadorId = this.userId;
		datos.estatus = "contacto";

		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			datos.archivado = false;
			let clienteId = Clientes.insert(datos);

			let creador = Meteor.users.findOne({_id: this.userId}).profile;

			if (clienteId) {
				NewsFeed.insert({
					descripcion: 'agregó al cliente ' + datos.nombre + ' ' + datos.apellido,
					tipo: 'Cliente',
					creador: {
						nombre: creador.nombre + ' ' + creador.apellido,
						id: this.userId
					},
					bufeteId: datos.bufeteId,
					createdAt: new Date()
				});
			}

		} else {
			return;
		}


	}
});


Meteor.methods({
	crearEmpresa: function (datos) {
		check(datos, {
			nombre: String,
			bufeteId: String,
			email: String,
			identificacion: String,
			direccion: String,
			telefono: String,
			celular: String,
			provincia: String,
			pais: String,
			autor: String
		});

		datos.createdAt = new Date();
		datos.creadorId = this.userId;

		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			datos.archivado = false;
			let empresaId = Empresas.insert(datos);

			let creador = Meteor.users.findOne({_id: this.userId}).profile;

			if (empresaId) {
				NewsFeed.insert({
					descripcion: creador.nombre + ' ' + creador.apellido + ' agregó la empresa ' + datos.nombre ,
					tipo: 'Empresa',
					creador: {
						nombre: creador.nombre + ' ' + creador.apellido,
						id: this.userId
					},
					bufeteId: datos.bufeteId,
					createdAt: new Date()
				});
			}

		} else {
			return;
		}


	}
});
