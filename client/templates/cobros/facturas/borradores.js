Template.borradores.events({

})

function formatoDeFecha(fecha) {
	let dias = ["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo"],
	 	meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"],
		diaActual = dias[fecha.getDay()],
		fechaActual = fecha.getDate(),
		mesActual = meses[fecha.getMonth()+1],
		añoActual = fecha.getFullYear(),
		horaActual = fecha.getHours(),
		minutosActual = fecha.getMinutes()

	return (String(diaActual).length>1? diaActual:"0"+diaActual) +" " + fechaActual  + " de " + mesActual + " del " + añoActual + " a las "
			+ (String(horaActual).length>1? horaActual:"0"+horaActual) + ":"
			+ (String(minutosActual).length>1? minutosActual: "0"+minutosActual ) + " " + ((fecha.getHours() >= 12) ? "PM" : "AM");
}


Template.borradores.helpers({
	email() {
		return Meteor.user().emails[0].address;
	}
})

Template.listaClientesBorradores.helpers({
    facturas(){
        return Facturas.find({borrador:true});
    }
})

Template.borradores.onCreated(function () {
    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        self.subscribe('facturas',bufeteId);
    })
})

Template.borradores.onRendered(function () {

})

Template.borradoresxCliente.helpers({
	ultimaModificacion(){
		debugger;
		let mensaje = "Ultima modificación ";
		let fechaFormateada = formatoDeFecha(this.ultimaModificacion);
		return mensaje + fechaFormateada + " por " + this.modificadoPor + " en la sección " + this.estado.paso.nombre;
	}
})

Template.borradoresxCliente.events({
	'click .guardar-cobro'(){
		Session.set("factura-id",this._id);
		Modal.show('generarCobroFacturaModal',this)
	}
})
