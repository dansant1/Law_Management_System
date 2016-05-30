Meteor.methods({
	crearEvento: function (datos) {
		check(datos, {
			title: String,
			start: String,
			end: String,
			asunto: Object,
			bufeteId: String,
			creador: Object,

		});

		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {
			
			datos.createdAt = new Date();
			datos.color = '#2ECC71';
			//console.log(datos);
			Eventos.insert(datos);
			NewsFeed.insert({
					descripcion: 'creó el evento ' + datos.title,
					tipo: 'Evento',
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
				});
		}
	}
});