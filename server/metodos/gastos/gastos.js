Meteor.methods({
    'agregarGastoAdministrativo': function (datos) {
		check(datos,{
			descripcion: String,
			bufeteId: String,
			fecha: String,
			monto:String
		})

		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {


            datos.fecha = new Date(datos.fecha + " GMT-0500")
			datos.monto = parseInt(datos.monto);
			datos.administrativo = true;
			datos.creadorId = this.userId;
			datos.createdAt = new Date();


			return {
				gastoId: Gastos.insert(datos)
			}
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

            datos.fecha = new Date(datos.fecha + " GMT-0500")


			datos.monto = parseInt(datos.monto);
			datos.administrativo = false
			datos.creadorId = this.userId;
			datos.createdAt = new Date();


			return {
				gastoId: Gastos.insert(datos)
			}
		} else {
			return;
		}
	},
	'actualizarGasto':function (datos,gastoId) {
		check(datos,Object);
		check(gastoId,String)

		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {



			datos.monto = parseInt(datos.monto);
			datos.administrativo = false
			datos.creadorId = this.userId;
			datos.createdAt = new Date();


			return {
				gastoId: Gastos.update({_id:gastoId},{
					$set:datos
				})
			}
		} else {
			return;
		}
	},
	'actualizarGastoAdministrativo':function (datos,gastoId) {

        check(datos,Object)
        check(gastoId,String)

		if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {


            datos.fecha = new Date(datos.fecha + " GMT-0500")

			datos.monto = parseInt(datos.monto);
			datos.administrativo = true
			datos.creadorId = this.userId;
			datos.createdAt = new Date();


			return {
				gastoId: Gastos.update({_id:gastoId},{
					$set:datos
				})
			}
		} else {
			return;
		}
	},
    'eliminarGasto':function (gastoId) {

        check(gastoId,String)

        if ( Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' ) ) {

            Gastos.remove({_id:gastoId})

		} else {
			return;
		}
    }
})
