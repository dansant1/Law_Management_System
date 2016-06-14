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

    }
})
