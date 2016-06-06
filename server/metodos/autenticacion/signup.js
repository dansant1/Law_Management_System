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
		Accounts.sendVerificationEmail( usuarioId );

		Roles.addUsersToRoles(usuarioId, ['administrador'], 'bufete');

		Meteor.defer(function() {
  			SSR.compileTemplate( 'htmlEmail', Assets.getText( 'bienvenido.html' ) );

			var emailData = {
  				nombre: datos.profile.nombre + " " + datos.profile.apellido
			};

			Email.send({
  				to: datos.email,
  				from: "daniel@grupoddv.pw",
  				subject: "Bienvenido a BUNQR",
  				html: SSR.render( 'htmlEmail', emailData )
			});
		}); 



		return {
			userId: usuarioId
		}
	
	},
	agregarUsuarioEquipo: function (datos) {
		check(datos, {
			email: String,
			password: String,
			profile: {
				nombre: String,
				apellido: String,
				telefono: String,
				bufete: String,
				bufeteId: String,
				tipo: String
			}	
		});

	
		let usuarioId = Accounts.createUser(datos);

		Roles.addUsersToRoles(usuarioId, ['abogado',datos.profile.tipo], 'bufete');
	

	}
});