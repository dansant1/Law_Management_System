Meteor.methods({
	agregarCaso: function (datos) {
		check(datos, {
			nombre: String,
			descripcion: String,
			bufeteId: String,
			createdAt: Date,
			contacto: Object,
			creador: Object
		});

		datos.estatus = "abierto";


		

		if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			
			if ( Clientes.findOne({_id: datos.contacto.id}).estatus === "contacto" ) {
				Clientes.update({_id: datos.contacto.id}, {
					$set: {
						estatus: 'prospecto'
					}
				});
			}

			let caso = Casos.insert(datos);
			
			if (caso) {
				
				NewsFeedCasos.insert({
					descripcion: datos.creador.nombre + " agrego un nuevo caso para el contacto " + datos.contacto.nombre,
					creador: {
						nombre: datos.creador.nombre,
						id: datos.creador.id
					},
					caso: {
						nombre: datos.nombre,
						id: caso
					},
					contacto: {
						nombre: datos.contacto.nombre,
						id: datos.contacto.id
					},
					bufeteId: datos.bufeteId,
					createdAt: new Date()
				});
			}

		} else {
			return;
		}
	},
	'agregarNotaCaso': function (datos) {
		check(datos, {			
			descripcion: String,
			bufeteId: String,
			createdAt: Date,
			caso: Object,
			creador: Object
		});


		if (Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			

			let casoNota = NotasCasos.insert(datos);
			
			if (casoNota) {
				
				NewsFeedCasos.insert({
					descripcion: datos.creador.nombre + " agrego una nota al caso " + datos.caso.nombre,
					creador: {
						nombre: datos.creador.nombre,
						id: datos.creador.id
					},
					caso: {
						nombre: datos.caso.nombre,
						id: datos.caso.id
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