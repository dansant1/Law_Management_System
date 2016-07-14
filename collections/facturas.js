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

EsquemaFacturas = new SimpleSchema({
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
		type:Object
	},
	'estado.paso.nro':{
		type:Number
	},
	'estado.paso.nombre':{
		type:String
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

Facturas.attachSchema(EsquemaFacturas);
