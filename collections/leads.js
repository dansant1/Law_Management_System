Leads = new Mongo.Collection('leads');

Leads.allow({
	insert: () => {
		return false;
	},
	update: () => {
		return false;
	},
	remove: () => {
		return false;
	}
});

Leads.deny({
	insert: () => {
		return true;
	},
	update: () => {
		return true;
	},
	remove: () => {
		return true;
	}
});

EsquemaLeads = new SimpleSchema({
	nombre: {
    	type: String
  	},
  	apellido: {
  		type: String
  	},
  	'contacto': {
  		type: Object
  	},
  	'contacto.email': {
  		type: String
  	},
  	'contacto.telefono': {
  		type: String,
  		optional: true
  	},
  	'contacto.celular': {
  		type: String,
  		optional: true
  	},
  	pais: {
  		type: String
  	},
  	firma: {
  		type: String
  	},
  	tipo: {
  		type: String,
  		allowedValues: ['lead', 'cliente', 'contacto']
  	}
});

Leads.attachSchema(EsquemaLeads);
