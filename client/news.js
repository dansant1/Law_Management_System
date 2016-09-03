Template.tareasYeventos.onCreated(function () {
	var self = this;

	self.autorun(function () {
		self.subscribe('tareasxhoy');
		self.subscribe('eventosxhoy')
	});
});

Template.tareasYeventos.helpers({
	eventos(){
		return MiCalendario.find();
	},
	totalEventos(){
		return MiCalendario.find().count()
	},
	tareas(){
		let hoy = new Date();
		hoy.setHours(0,0,0,0);
		let mañana = new Date();
		mañana.setDate(mañana.getDate()+1);
		mañana.setHours(0,0,0,0)

		return Tareas.find({'vence':{$gte:hoy,$lt:mañana},'asignado.id': Meteor.userId(), abierto: true});
	},
	totalTareas(){
		return Tareas.find().count()
	}
});

Template.newsfeed.onCreated(function () {
	var self = this;
	this.limite = new ReactiveVar(7);
	self.autorun(function () {
		let bufeteId = Meteor.user().profile.bufeteId;	
		self.subscribe('news', bufeteId, self.limite.get());
	});

});

Template.newsfeed.helpers({
	
	dia() {
		var d = new Date(),
    	minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    	hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    	ampm = d.getHours() >= 12 ? 'pm' : 'am',
    	months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Dec'],
    	days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
		return days[d.getDay()]+', ' + d.getDate() + ' de ' + months[d.getMonth()] + ' del ' + d.getFullYear();
	},
	esAdministrador: () => {
		if ( Roles.userIsInRole( Meteor.userId(), ['administrador'], 'bufete' ) ) {
			return true;
		} else {
			return false;
		}
	},
	news: () => {
		return NewsFeed.find({}, {sort: {createdAt: -1} });
	},
	haynews: () => {
		if ( NewsFeed.find().fetch().length > 10 ) {
			return true;
		} else {
			return false;
		}
	},
	type: (tipo) => {
		if (tipo === "Expediente") {
			return 'amarillo-flat';
		} else if (tipo === "Documentos") {
			return 'rojo-flat';
		} else if (tipo === "Evento") {
			return 'verde-flat';
		} else if (tipo === "Hito") {
			return 'morado-flat';
		} else if (tipo === "Tarea") {
			return 'azul-flat';
		} else if (tipo === "Cliente") {
			return 'naranja-flat';
		} else if (tipo === "Estado") {
			return 'turquesa-flat';
		} else {
			return 'azul-empresa'
		}
	},
	sucedio(createdAt) {

		var d =  createdAt,
        dformat = [	d.getDate().padLeft(),
        			(d.getMonth()+1).padLeft(),
                    d.getFullYear()].join('/')+
                    ' ' +
                  [ d.getHours().padLeft(),
                    d.getMinutes().padLeft()].join(':');

    	return dformat;
	}
});

Number.prototype.padLeft = function(base,chr){
   var  len = (String(base || 10).length - String(this).length)+1;
   return len > 0? new Array(len).join(chr || '0')+this : this;
}

Template.newsfeed.events({
	'click .evento': () => {
		Modal.show('evento');
	},
	'click .hora': () => {
		Modal.show('agregarHoras');
	},
	'click .gasto': () => {
		Modal.show('agregarGasto');
	},
	'click .archivo': () => {
		Modal.show('archivoModal');
	},
	'click .cargar': (event, template) => {
		let cargar = template.limite.get() + 10;
		template.limite.set(cargar);

	}
});
