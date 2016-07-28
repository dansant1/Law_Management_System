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
		

		if (usuarioId) {
			Accounts.sendVerificationEmail( usuarioId );
			Areas.insert({
				nombre: "General",
				bufeteId: datos.profile.bufeteId
			});

			Cambio.insert({
				bufeteId: datos.profile.bufeteId,
				cambio: 3.33
			});

			Roles.addUsersToRoles(usuarioId, ['abogado', 'administrador'], 'bufete');

			Leads.insert({
				nombre: datos.profile.nombre,
				apellido: datos.profile.apellido,
				firma: datos.profile.bufete,
				contacto: {
					email: datos.email
				},
				tipo: 'prueba'
			});

		} else {
			return
		}

		

		

		Meteor.defer(function() {
  			SSR.compileTemplate( 'htmlEmail', Assets.getText( 'bienvenido.html' ) );

			var emailData = {
  				nombre: datos.profile.nombre + " " + datos.profile.apellido
			};

			Email.send({
  				to: datos.email,
  				from: "daniel@grupoddv.com",
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
				tipo: String,
				area:Object
			}
		});


		let usuarioId = Accounts.createUser(datos);

		if (usuarioId) {
			Accounts.sendVerificationEmail( usuarioId );
			if (datos.profile.tipo === "encargado comercial") {
				Roles.addUsersToRoles(usuarioId, [datos.profile.tipo], 'bufete');
			} else if (datos.profile.tipo === "socio") {
				Roles.addUsersToRoles(usuarioId, ['abogado', datos.profile.tipo], 'bufete');
			} else {
				Roles.addUsersToRoles(usuarioId, ['abogado', datos.profile.tipo], 'bufete');
			}

			Leads.insert({
				nombre: datos.profile.nombre,
				apellido: datos.profile.apellido,
				firma: datos.profile.bufete,
				contacto: {
					email: datos.email,
					telefono: datos.profile.telefono
				},
				tipo: 'prueba'
			});

			Meteor.defer(function() {
  				SSR.compileTemplate( 'htmlEmail', Assets.getText( 'bienvenido.html' ) );

				var emailData = {
  					nombre: datos.profile.nombre + " " + datos.profile.apellido
				};

				Email.send({
  					to: datos.email,
  					from: "daniel@grupoddv.com",
  					subject: "Bienvenido a BUNQR",
  					html: SSR.render( 'htmlEmail', emailData )
				});
			});

		} else {
			return;
		}

		

	}
});
