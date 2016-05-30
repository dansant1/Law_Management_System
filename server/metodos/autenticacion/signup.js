Meteor.methods({
	crearUsuario: function (datos)  {
		check(datos, {
			email: String,
			password: String,
			profile: {
				nombre: String,
				apellido: String,
				bufete: String
			}
		});

		let bufeteId = Bufetes.insert({
			nombre: datos.profile.bufete
		});

		datos.profile.bufeteId = bufeteId;

		let usuarioId = Accounts.createUser(datos);

		Roles.addUsersToRoles(usuarioId, ['administrador'], 'bufete');
	
	},
	agregarUsuarioEquipo: function (datos) {

		check(datos, {
			email: String,
			password: String,
			profile: {
				nombre: String,
				apellido: String,
				bufete: String,
				bufeteId: String
			}	
		});

		let usuarioId = Accounts.createUser(datos);

		Roles.addUsersToRoles(usuarioId, ['abogado'], 'bufete');
	

	}
});