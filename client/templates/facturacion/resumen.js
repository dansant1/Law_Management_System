Template.resumenHorasPersonal.onRendered(function () {
    function chartLine(){

        var dynamicColors = function() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return "rgb(" + r + "," + g + "," + b + ")";
        }

        var ctx4 = document.getElementById("pieChartHoras").getContext("2d");
        //
        // var mañana = new Date()
        // mañana.setDate(mañana.getDate()+1);
        // mañana.setHours(0,0,0,0)
        //
        // var hoy = new Date()
        // hoy.setHours(0,0,0,0)

        debugger;
        var horas = Horas.find({$and:[{'asunto':{$exists:true}},{'responsable.id':Meteor.user()._id},Session.get('filtro-hora')]}).fetch();

        var grupos = _(horas).groupBy(function (hora) {
            return hora.asunto.id;
        })
        // debugger;
        var tiempoxAsunto = _(grupos).map(function (g,key) {
            return {
                    type:key,
                    horas: _(g).reduce(function (m,x) {
                        return m + x.horas;
                    },0),
                    minutos: _(g).reduce(function (m,x) {
                        debugger
                        return m + x.minutos;
                    },0)
                }
        })

        debugger;

        for (var i = 0; i < tiempoxAsunto.length; i++) {

            if(tiempoxAsunto[i].minutos>60){
                let horas = Number(String(tiempoxAsunto[i].minutos/60).split(".")[0]);
                tiempoxAsunto[i].horas += horas;
                tiempoxAsunto[i].minutos  = tiempoxAsunto[i].minutos%60;
            }
        }

        var out = _(tiempoxAsunto).map(function (obj) {
            return {
                value: obj.horas,
                color: dynamicColors(),
                label:Asuntos.find({_id:obj.type}).fetch()[0].caratula
            }
        })

        var data4 = out;

        let myPieChart = new Chart(ctx4).Pie(data4,{
                animateScale: true
        });

    }

    Tracker.autorun(chartLine);

})

Template.resumenHorasPersonal.onCreated(function () {

    var mañana = new Date()
    mañana.setDate(mañana.getDate()+1);
    mañana.setHours(0,0,0,0)

    var hoy = new Date()
    hoy.setHours(0,0,0,0)
    Session.set('filtro-hora',{fecha:{$lt:mañana,$gte:hoy}})

    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        Meteor.subscribe('horas',bufeteId);
    })

})


Template.resumenHorasPersonal.events({
    'change [name="rangos"]'(event,template){
        if(event.target.value=="dia"){
            var mañana = new Date()
            mañana.setDate(mañana.getDate()+1);
            mañana.setHours(0,0,0,0)

            var hoy = new Date()
            hoy.setHours(0,0,0,0)

            return Session.set('filtro-hora',{fecha:{$lt:mañana,$gte:hoy}})
        }
        if(event.target.value=="semana"){
            debugger;
            function getMonday(d) {
    		  d = new Date(d);
    		  var day = d.getDay(),
    		      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    		  return new Date(d.setDate(diff));
    		}

    		var monday = getMonday(new Date())
    		monday.setHours(0,0,0,0)
    		var sunday = getMonday(new Date())
    		sunday.setDate(sunday.getDate()+6)
    		sunday.setHours(0,0,0,0)

    		let filtro = {
    			fecha:{
    				$gte:monday,
    				$lt:sunday
    			}
    		}
    		// Session.set('tipo-tarea',true)
    		return Session.set('filtro-hora',filtro)
        }

        if(event.target.value=="mes"){
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            let filtro = {
                fecha:{
                    $gte:firstDay,
                    $lt:lastDay
                }
            }

            return Session.set('filtro-hora',filtro)
        }

        if(event.target.value=="año"){
            var firstDay = new Date(new Date().getFullYear(), 0, 1);
            var lastDay = new Date(new Date().getFullYear(), 11, 31);

            let filtro = {
                fecha:{
                    $gte:firstDay,
                    $lt:lastDay
                }
            }

            return Session.set('filtro-hora',filtro)

        }
    }
})

Template.resumenHorasPersonal.helpers({
    horas(){

        debugger;
        var horas = Horas.find({$and:[{'asunto':{$exists:true}},{'responsable.id':Meteor.userId()},Session.get('filtro-hora')]}).fetch();

        var grupos = _(horas).groupBy(function (hora) {
            return hora.asunto.id;
        })
        // debugger;
        var tiempoxAsunto = _(grupos).map(function (g,key) {
            return {
                    type:key,
                    horas: _(g).reduce(function (m,x) {
                        return m + x.horas;
                    },0),
                    minutos: _(g).reduce(function (m,x) {
                        debugger
                        return m + x.minutos;
                    },0)
                }
        })

        debugger;

        for (var i = 0; i < tiempoxAsunto.length; i++) {

            if(tiempoxAsunto[i].minutos>60){
                let horas = Number(String(tiempoxAsunto[i].minutos/60).split(".")[0]);
                tiempoxAsunto[i].horas += horas;
                tiempoxAsunto[i].minutos  = tiempoxAsunto[i].minutos%60;
            }

            tiempoxAsunto[i].nombre = Asuntos.find({_id:tiempoxAsunto[i].type}).fetch()[0].caratula;
        }

        return tiempoxAsunto;
        //
        // var mañana = new Date()
        // mañana.setDate(mañana.getDate()+1);
        // mañana.setHours(0,0,0,0)
        //
        // var hoy = new Date()
        // hoy.setHours(0,0,0,0)
        //
        // var horas = Horas.find({'responsable.id':Meteor.user()._id}).fetch();
        //
        // var groups = _(horas).groupBy(function (hora) {
        //     return hora.asunto.id;
        // })
        //
        // var out = _(groups).map(function (g,key) {
        //     return {type:key,
        //             val: _(g).reduce(function (m,x) {
        //                 return m + x.horas;
        //             },0)
        //         }
        // })

    },
    total(){
        var horas = Horas.find({$and:[{'asunto':{$exists:true}},{'responsable.id':Meteor.userId()},Session.get('filtro-hora')]}).fetch();

        var groups = _(horas).groupBy(function (hora) {
            return hora.asunto.id;
        })

        var tiempoxAsunto = _(groups).map(function (g,key) {
            return {
                    id:key,
                    horas: _(g).reduce(function (m,x) {
                        return m + x.horas;
                    },0),
                    minutos: _(g).reduce(function (m,x) {
                        return m + x.minutos
                    },0)
                }
        })

        let totalHoras = 0;
        let totalMinutos = 0;

        for (var i = 0; i < tiempoxAsunto.length; i++) {
            if(tiempoxAsunto[i].minutos>60){
                let horas = Number(String(tiempoxAsunto[i].minutos/60).split(".")[0]);
                tiempoxAsunto[i].horas += horas;
                tiempoxAsunto[i].minutos  = tiempoxAsunto[i].minutos%60;
            }

            totalHoras += tiempoxAsunto[i].horas;
            totalMinutos += tiempoxAsunto[i].minutos;
        }

        if(totalMinutos>=60){
            totalHoras += Number(String(totalMinutos/60).split(".")[0]);;
            totalMinutos = totalMinutos%60;
        }

        debugger;

        return totalHoras + "h " + totalMinutos +"m " ;

    }
})
