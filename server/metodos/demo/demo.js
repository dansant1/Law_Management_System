Meteor.methods({
	solicitarDemo: function (datos) {
		
		check(datos, {
			nombre: String,
			apellido: String,
			email: String,
			telefono: String,
			pais: String,
			firma: String,
			mensaje: String
		});

		if (this.userId) {
			
			let lead = Leads.insert({
				nombre: datos.nombre,
				apellido: datos.apellido,
				contacto: {
					email: datos.email,
					telefono: datos.telefono,
				},
				pais: datos.pais,
				firma: datos.firma,
				tipo: 'lead'
			});

			if (lead) {

				Meteor.defer(function() {

					Email.send({
  						to: "daniel@grupoddv.com",
  						from: datos.email,
  						subject: "Solicitar demo",
  						text: datos.mensaje
					});

				});
			
			} else {
				return;
			}

		} else {
			return;
		}

	},
	contactanos: function (datos) {
		
		check(datos, {
			nombre: String,
			apellido: String,
			email: String,
			telefono: String,
			pais: String,
			firma: String,
			mensaje: String
		});

		if (this.userId) {
			let lead = Leads.insert({
				nombre: datos.nombre,
				apellido: datos.apellido,
				contacto: {
					email: datos.email,
					telefono: datos.telefono,
				},
				pais: datos.pais,
				firma: datos.firma,
				tipo: 'contacto'
			});

			if (lead) {

				Meteor.defer(function() {

					Email.send({
  						to: "daniel@grupoddv.com",
  						from: datos.email,
  						subject: "Contacto",
  						text: datos.mensaje
					});

				});
			
			} else {
				return;
			}
		} else {
			return;
		}
	}
});