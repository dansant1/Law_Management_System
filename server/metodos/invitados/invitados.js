Meteor.methods({
	invitar: function (datos) {
		check(datos, {
			nombre: String,
			apellido: String,
			area: Object,
			tipo: String,
			email: String
		});

		if (this.userId) {

			let usuario = Meteor.users.findOne({_id: this.userId})
			datos.bufeteId = usuario.profile.bufeteId;
			datos.bufete = Bufetes.findOne({_id: datos.bufeteId}).nombre;
			
			let invitadoId = Invitados.insert(datos);

			const urls = {
  				development: 'http://localhost:3000/signup/',
  				production: 'https://bunqr.grupoddv.com/signup/'
			};

			if (invitadoId) {
				Meteor.defer(function () {

					SSR.compileTemplate( 'invitacion', Assets.getText( 'invitacion.html' ) );
					
					var emailData = {
  						nombre: datos.nombre + " " + datos.apellido,
  						persona: usuario.profile.nombre + " " + usuario.profile.apellido,
        				urlWithoutHash: urls[ 'production' ] + invitadoId,
        				supportEmail: "daniel@grupoddv.com"
					};

					Email.send({
						to: datos.email,
      					from: usuario.emails[0].address,
      					subject: 'Invitación',
      					html: SSR.render( 'invitacion', emailData )
					});
				});
			}

		}
	}
});