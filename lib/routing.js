// Rutas para autenticaciones

FlowRouter.route('/', {
  name: 'login',
  action(params, queryParams) {
    BlazeLayout.render('login');
  }
});


FlowRouter.route('/login', {
  name: 'login',
  action(params, queryParams) {
    BlazeLayout.render('login');
  }
});

FlowRouter.route('/signup', {
  name: 'login',
  action(params, queryParams) {
    BlazeLayout.render('signup');
  }
});

FlowRouter.route('/signup/estudioId', {
  name: 'login',
  action(params, queryParams) {
    BlazeLayout.render('signup');
  }
});


// Rutas para multisuario

FlowRouter.route('/usuarios', {
  name: 'Usuarios',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "usuarios"});
  }
});

FlowRouter.route('/usuarios/nuevo', {
  name: 'Usuarios',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "usuarioForm"});
  }
});


FlowRouter.route('/dashboard', {
  name: 'Dashboard',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "newsfeed"});
  }
});

FlowRouter.route('/dashboard2', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "contenidoDashboard2"});
  }
});

FlowRouter.route('/dashboard2/bienvenido', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "contenidoDashboard2Bienvenido"});
  }
});

// Rutas para conversaciones

FlowRouter.route('/conversaciones', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "Conversaciones"});
  }
});

// Rutas para tareas

let tareas = FlowRouter.group({
    prefix: "/tareas"
});

tareas.route('/', {
  name: 'Tareas',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "tareas"});
  }
});

tareas.route('/cerradas', {
  name: 'Tareas.cerradas',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "tareasCerradas"});
  }
});

tareas.route('/gantt', {
  name: 'Tareas.gantt',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "tareasGantt"});
  }
});

tareas.route('/nuevo', {
  name: 'Tareas.nuevo',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "nuevaTarea"});
  }
});

// Rutas para asuntos

let asuntos2 = FlowRouter.group({
    prefix: "/asuntos2"
});

asuntos2.route('/', {
  action() {
    BlazeLayout.render('dashboard', {content: 'asuntos2'});
  }
});

asuntos2.route('/d/:asuntoId', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "detalleAsunto2"});
  }
});

asuntos2.route('/d/:asuntoId/tarea/:tareaId', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "detalleTareaAsunto"});
  }
});

asuntos2.route('/d/:asuntoId/tarea/:tareaId/f', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "fullScreenTareaAsunto"});
  }
});

asuntos2.route('/d/:asuntoId/tarea/:tareaId/f/docs', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "fullScreenTareaAsuntoDocs"});
  }
});

asuntos2.route('/d/:asuntoId/tarea/:tareaId/f/subtareas', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "fullScreenTareaAsuntoSubtareas"});
  }
});

asuntos2.route('/d/:asuntoId/calendario', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "detalleCalendario2"});
  }
});

asuntos2.route('/d/:asuntoId/conversacion', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "detalleConversacion2"});
  }
});

asuntos2.route('/d/:asuntoId/facturacion', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "detalleFacturacion"});
  }
});

asuntos2.route('/d/:asuntoId/notas', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "detalleNotas2"});
  }
});

asuntos2.route('/d/:asuntoId/documentos', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "asuntosDocs3"});
  }
});

asuntos2.route('/d/:asuntoId/documentos/:documentoId', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "asuntosDocsDetalle"});
  }
});

asuntos2.route('/d/:asuntoId/documentos/c/:carpetaId', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "asuntosSubDocs3"});
  }
});

asuntos2.route('/d/:asuntoId/informacion', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "asuntoInformacion"});
  }
});


/*let asuntos = FlowRouter.group({
    prefix: "/asuntos"
});

asuntos.route('/', {
  name: 'Asuntos',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "asuntos"});
  }
});

asuntos.route('/nuevo', {
  name: 'Asunto.nuevo',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "asuntoForm"});
  }
});


asuntos.route('/d/:asuntoId', {
  name: 'Asunto.detalle',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "detalleAsunto"});
  }
});

asuntos.route('/d/:asuntoId/tareas', {
  name: 'Asunto.detalle',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "TareasAsunto"});
  }
});

asuntos.route('/d/:asuntoId/estados', {
  name: 'Asunto.estados',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "detalleEstados"});
  }
});

asuntos.route('/d/:asuntoId/calendario', {
  name: 'Asunto.calendario',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "detalleCalendario"});
  }
});

asuntos.route('/d/:asuntoId/n/:estadoId', {
  name: 'Asunto.estado',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "notas"});
  }
});

asuntos.route('/d/:asuntoId/chat', {
  name: 'Asunto.chat',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "chat"});
  }
});

asuntos.route('/d/:asuntoId/documentos', {
  name: 'Asuntos.documentos',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "asuntosDocs"});
  }
});

asuntos.route('/d/:asuntoId/documentos/c/:carpetaId', {
  name: 'Asuntos.documentos',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "asuntosSubDocs"});
  }
});

asuntos.route('/d/:asuntoId/tiempos', {
  name: 'Asunto.tiempos',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "finanzasAsunto"});
  }
});

asuntos.route('/d/:asuntoId/tiempos/horas', {
  name: 'Asunto.horas',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "finanzasAsuntoHoras"});
  }
});

asuntos.route('/d/:asuntoId/tiempos/gastos', {
  name: 'Asunto.gastos',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "finanzasAsuntoGastos"});
  }
});

asuntos.route('/d/:asuntoId/tiempos/facturas', {
  name: 'Asunto.facturas',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "finanzasAsunto"});
  }
});

asuntos.route('/d/:asuntoId/tiempos/pagos', {
  name: 'Asunto.pagos',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "finanzasAsunto"});
  }
});*/

FlowRouter.route('/equipo',{
  name:'equipo',
  action(params,queryParams){
    BlazeLayout.render('dashboard',{content:'equipo'});
  }
})



// Rutas para Clientes

let clientes2 = FlowRouter.group({
    prefix: "/clientes2"
});

clientes2.route('/', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "clientes2"});
  }
});

clientes2.route('/contactos', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "contactos2"});
  }
});

clientes2.route('/contactos/personas', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "contactos2"});
  }
});

clientes2.route('/contactos/empresas', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "listaEmpresas"});
  }
});

clientes2.route('/casos', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "casos"});
  }
});

clientes2.route('/d/:_id', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "detalleClientes2"});
  }
});

clientes2.route('/d/:_id/info', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "detalleClientesInfo"});
  }
});

clientes2.route('/d/:_id/casos', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "detalleClientesCasos"});
  }
});

clientes2.route('/d/:_id/asuntos', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "detalleClientesAsuntos"});
  }
});

clientes2.route('/d/:_id/facturacion', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "detalleClientesFacturacion"});
  }
});

// Fin de clientes 2

/*let clientes = FlowRouter.group({
    prefix: "/clientes"
});

clientes.route('/', {
  name: 'Clientes',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "clientes"});
  }
});

clientes.route('/nuevo', {
  name: 'Clientes',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "clienteNuevo"});
  }
});

clientes.route('/d/:_id', {
  name: 'Clientes',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "detalleCliente"});
  }
});

clientes.route('/d/:_id/asuntos', {
  name: 'Clientes',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "asuntoxCliente"});
  }
});

clientes.route('/d/:_id/notas', {
  name: 'Clientes',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "detalleCliente"});
  }
});

clientes.route('/d/:_id/finanzas', {
  name: 'Clientes',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "detalleCliente"});
  }
});

clientes.route('/d/:_id/mensajes', {
  name: 'Clientes',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "detalleCliente"});
  }
});*/


// Rutas para calendario

FlowRouter.route('/calendario2', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "calendario2"});
  }
});

FlowRouter.route('/calendario', {
  name: 'Dshboard',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "calendario"});
  }
});

FlowRouter.route('/calendario/nuevo', {
  name: 'Dshboard',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "evento"});
  }
});




// Rutas para horas y gastos

let horas = FlowRouter.group({
    prefix: "/tiempos"
});

horas.route('/', {
  name: 'Tiempos',
  action(params, queryParams) {
    BlazeLayout.render('app', {
      contenido: 'horas'
    });
  }
});

horas.route('/horas', {
  name: 'Tiempos.horas',
  action(params, queryParams) {
    BlazeLayout.render('app', {
      contenido: 'horas'
    });
  }
});

horas.route('/gastos', {
  name: 'Tiempos.gastos',
  action(params, queryParams) {
    BlazeLayout.render('app', {
      contenido: 'horas'
    });
  }
});

horas.route('/facturas', {
  name: 'Tiempos.facturas',
  action(params, queryParams) {
    BlazeLayout.render('app', {
      contenido: 'horas'
    });
  }
});

/*let documentos = FlowRouter.group({
    prefix: "/documentos"
});

documentos.route('/', {
  name: 'Documentos',
  action(params, queryParams) {
    BlazeLayout.render('app', {
      contenido: 'documentos'
    });
  }
});

documentos.route('/c/:carpetaId', {
  name: 'Carpeta',
  action(params, queryParams) {
    BlazeLayout.render('app', {
      contenido: 'carpetas'
    });
  }
});

documentos.route('/a/:archivoId', {
  name: 'Carpeta',
  action(params, queryParams) {
    BlazeLayout.render('app', {
      contenido: 'detalleArchivo'
    });
  }
});*/
