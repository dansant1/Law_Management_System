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

FlowRouter.route( '/verify-email/:token', {
  name: 'verify-email',
  action( params ) {
    Accounts.verifyEmail( params.token, ( error ) =>{
      if ( error ) {
        FlowRouter.go( '/login' );
        Bert.alert( 'Hubo un error', 'danger' );
      } else {
        FlowRouter.go( '/dashboard2' );
        Bert.alert( 'Email verificado ¡gracias!', 'success' );
      }
    });
  }
});

// Rutas para area legal de servicios
FlowRouter.route('/terminos-condiciones', {
  name: 'Legal.terminos-condiciones',
  action(params, queryParams) {
    BlazeLayout.render('terminosCondiciones');
  }
});

FlowRouter.route('/politicas-privacidad', {
  name: 'Legal.politicas-privacidad',
  action(params, queryParams) {
    BlazeLayout.render('politicasPrivacidad');
  }
});

/* Rutas de bienvenido y configuración inicial */

FlowRouter.route('/bienvenido', {
  name: 'Bienvenido.empecemos',
  action(params, queryParams) {
    BlazeLayout.render('empecemos');
  }
});

FlowRouter.route('/bienvenido/yo', {
  name: 'Bienvenido.configuracion-perfil-inicial',
  action(params, queryParams) {
    BlazeLayout.render('configuracionPerfilInicial');
  }
});

FlowRouter.route('/bienvenido/mi-firma', {
  name: 'Bienvenido.configuración-firma-inicial',
  action(params, queryParams) {
    BlazeLayout.render('configuracionFirmaInicial');
  }
});

// Rutas para multisuario

FlowRouter.route('/usuarios', {
  name: 'Usuarios',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "usuarios"});
  }
});

FlowRouter.route('/equipo/d/:miembroId', {

  action(params, queryParams) {
    BlazeLayout.render('dashboard', {contenido: "detalleMiembroEquipo"});
  }
});

FlowRouter.route('/administracion', {
  name: 'Usuarios.administracion',
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {contenido: "administracionDeUsuarios"});
  }
});

FlowRouter.route('/usuarios/nuevo', {
  name: 'Usuarios',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "usuarioForm"});
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

FlowRouter.route('/conversaciones/:asuntoId', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "conversacionesPorAsunto"});
  }
});

// Rutas para tareas

let tareas = FlowRouter.group({
    prefix: "/tareas"
});

tareas.route('/', {
  name: 'Tareas',
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "tareas2"});
  }
});

tareas.route('/:tareaId', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "tareasDetalle2"});
  }
});

tareas.route('/:tareaId/f', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "tareasDetalle2"});
  }
});

tareas.route('/t/r', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "trelloLikeTareas"});
  }
});

tareas.route('/documentos/d', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "documentosDeTareas"});
  }
});

FlowRouter.route('/diagrama',{
  name:'Tareas.Gantt',
  action(params,queryParams){
    BlazeLayout.render('dashboard', {content:'Gantt'});
  }
})


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
    BlazeLayout.render('dashboard', {content: "detalleEtapaAsunto2"});
  }
});

asuntos2.route('/d/:asuntoId/etapa/:etapaId',{
    action(params,queryParams){
        BlazeLayout.render('dashboard',{content:"detalleAsunto2"})
    }
})

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

asuntos2.route('/d/:asuntoId/t/k', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "trelloLikeTareas"});
  }
});


FlowRouter.route('/equipo',{
  name:'equipo',
  action(params,queryParams){
    BlazeLayout.render('dashboard',{content:'equipo'});
  }
});

FlowRouter.route('/equipo/equipos',{
  name:'equipo',
  action(params,queryParams){
    BlazeLayout.render('dashboard',{content:'equipos'});
  }
});

FlowRouter.route('/equipo/equipos/e/:equipoId',{
  name:'equipo',
  action(params,queryParams){
    BlazeLayout.render('dashboard',{content:'miembrosxequipo'});
  }
});



// Rutas para modulo Facturacion

let facturacion = FlowRouter.group({
    prefix: "/facturacion"
});

facturacion.route('/',{
  name:'Facturacion',
  action(params,queryParams){
    //BlazeLayout.render('dashboard',{content:'facturacion'});
    BlazeLayout.render('dashboard',{content:'resumenFacturacion'});
  }
})

facturacion.route('/horas',{
  name:'Facturacion.Horas',
  action(params,queryParams){
    BlazeLayout.render('dashboard',{ content:'facturacion'})
  }
});

facturacion.route('/cobros',{
  name:'Facturacion.Cobros',
  action(params,queryParams){
    BlazeLayout.render('dashboard',{ content:'cobros'})
  }
});

facturacion.route('/cobros/borradores',{
  name:'Facturacion.Cobros',
  action(params,queryParams){
    BlazeLayout.render('dashboard',{ content:'borradores'})
  }
});

facturacion.route('/cobros/emitidos',{
  name:'Facturacion.Cobros',
  action(params,queryParams){
    BlazeLayout.render('dashboard',{ content:'cobros'})
  }
});



facturacion.route('/gastos',{
    name:'Facturacion.Gastos',
    action(params,queryParams){
        BlazeLayout.render('dashboard',{content:'gastos'})
    }
});

facturacion.route('/reportes',{
    name:'Facturacion.Reportes',
    action(params,queryParams){
        BlazeLayout.render('dashboard',{content:'reportesFacturacion'})
    }
});

FlowRouter.route('/facturacion/configuracion-facturacion', {
  name:'Facturacion.config',
  action(params,queryParams){
    BlazeLayout.render('dashboard',{ content:'facturacionConfiguracion'})
  }
});

FlowRouter.route('/facturacion/configuracion-facturacion/cambio', {
  name:'Facturacion.config',
  action(params,queryParams){
    BlazeLayout.render('dashboard',{ content:'cambioConfiguracion'})
  }
})


facturacion.route('/tarifas/nuevo', {
  name:'Facturacion.tarifanuevo',
  action(params,queryParams){
    BlazeLayout.render('dashboard',{ content:'formularioParaCrearTarifa'})
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

clientes2.route('/empresas/', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "empresas"});
  }
});

clientes2.route('/contactos/prospectos', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "Prospectos"});
  }
});

clientes2.route('/contactos/clientes', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "clientesOficial"});
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



clientes2.route('/casos/:casoId', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "casoDetalle"});
  }
});

clientes2.route('/casos/:casoId/notas', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "casoNotas"});
  }
});

clientes2.route('/casos/:casoId/tareas', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "casoTareas"});
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

clientes2.route('/negociaciones', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "casos"});
  }
});

clientes2.route('/tareas', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "casos"});
  }
});

clientes2.route('/campanias', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "casos"});
  }
});

// Fin de clientes 2


// Rutas para calendario

FlowRouter.route('/calendario2', {
  action(params, queryParams) {
    BlazeLayout.render('dashboard', {content: "miCalendario"});
  }
});

FlowRouter.route('/calendario', {
  name: 'Dshboard',
  action(params, queryParams) {
    BlazeLayout.render('app', {contenido: "calendario"});
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
