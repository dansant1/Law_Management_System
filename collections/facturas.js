Facturas = new Mongo.Collection('facturas');

Facturas.allow({
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

Facturas.deny({
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

/*EsquemaFacturas = new SimpleSchema({
    cliente:{
        type:Object
    },
	codigo:{
		type:String
	},
    'cliente.id':{
        type:String
    },
    'cliente.nombre':{
        type:String
    },
    asuntos:{
        type:[Object],
		optional:true
    },
    'asuntos.$.id':{
        type:String
    },
    'asuntos.$.caratula':{
        type:String
    },
    'asuntos.$.horas':{
        type:[Object]
    },
    'asuntos.$.horas.$.id':{
        type:String
    },
    'asuntos.$.horas.$.descripcion':{
        type:String
    },
    'asuntos.$.gastos.$.id':{
        type:String
    },
    'asuntos.$.gastos.$.descripcion':{
        type:String
    },
    borrador:{
        type:Boolean
    },
    facturarPor:{
        type:String
    },
    tipo: {
    	type: String,
    	optional: true
    },
	bufeteId:{
		type:String
	},
	estado:{
		type:Object,
		optional:true
	},
	'estado.asuntos':{
		type:[String],
		optional:true
	},
	'estado.horas':{
		type:[String],
		optional:true
	},
	'estado.gastos':{
		type:[String],
		optional:true
	},
	'estado.paso':{
		type:Object,
		optional: true
	},
	'estado.paso.nro':{
		type:Number,
		optional: true
	},
	'estado.paso.nombre':{
		type:String,
		optional: true
	},
	ultimaModificacion:{
		type: Date,
		optional:true
	},
	modificadoPor:{
		type:String,
		optional:true
	}
});

Facturas.attachSchema(EsquemaFacturas);*/
