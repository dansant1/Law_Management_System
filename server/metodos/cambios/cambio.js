Meteor.methods({
    'insertarCambio'(data){

        check(data,Object);

        Cambio.update({bufeteId:data.bufeteId},{
            $set:{
                cambio:data.cambio,
                bufeteId:data.bufeteId
            }
        },{upsert:true},function (err) {
            console.log(err);
        });

    },
    actualizarCambio: function (datos) {
      check(datos, Object);

      Cambio.update({bufeteId: datos.id}, {
        $set: {
          cambio: datos.cambio
        }
      });
    }
})
