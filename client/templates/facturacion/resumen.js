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

        // debugger;
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
                        // debugger
                        return m + x.minutos;
                    },0)
                }
        })

        // debugger;

        for (var i = 0; i < tiempoxAsunto.length; i++) {

            if(tiempoxAsunto[i].minutos>=60){
                let horas = Number(String(tiempoxAsunto[i].minutos/60).split(".")[0]);
                tiempoxAsunto[i].horas += horas;
                tiempoxAsunto[i].minutos  = tiempoxAsunto[i].minutos%60;
            }
        }

        var out = _(tiempoxAsunto).map(function (obj) {
            return {
                value: Number(obj.horas+"."+ (String(obj.minutos)[1]=="0"? Number(obj.minutos+"11"): obj.minutos)),
                color: dynamicColors(),
                label:Asuntos.find({_id:obj.type}).fetch()[0].caratula
            }
        })

        var data4 = out;

        let myPieChart = new Chart(ctx4).Pie(data4,{
            animateScale: true,
            tooltipTemplate: function (l) {
                let tiempo = String(l.value).split(".");

                return l.label + " : " + tiempo[0] + " h " + (tiempo[1]? (tiempo[1][2]==="1"? tiempo[1][0] + "0"  :  tiempo[1] ) : 0 )+" m";
            },
    // String - Template string for multiple tooltips
            multiTooltipTemplate: function (l) {
                return l.label + " : " + String(l.value).split(".")[0] + " h " + String(l.value).split(".")[1]+" m";
            },
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

});

Template.resumenGastos.onCreated(function () {
  var self = this;
  var bufeteId = Meteor.user().profile.bufeteId;
  self.autorun(function () {
      self.subscribe('totalGastos',bufeteId);
      self.subscribe('gastos',bufeteId);
  })
});

Template.horaMiembrosChart.onCreated(function () {
    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId;

    self.autorun(function () {
        self.subscribe('horas',bufeteId);
        self.subscribe('equipo',bufeteId)
    })
})

Template.horaMiembrosChart.onRendered(function () {
    function chartLine() {
        // var dynamicColors = function() {
        //     var r = Math.floor(Math.random() * 255);
        //     var g = Math.floor(Math.random() * 255);
        //     var b = Math.floor(Math.random() * 255);
        //     return "rgb(" + r + "," + g + "," + b + ")";
        // }
        //

        var dynamicColors = function() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return "rgba(" + r + "," + g + "," + b + ",0.2)";
        }


        let horasxmiembro = _(_(Horas.find({'responsable':{$exists:true}}).map(function (hora) {
            let mes = hora.fecha.getMonth()
            return {
                _id:hora._id,
                horas:hora.horas,
                minutos:hora.minutos,
                responsable:hora.responsable,
                mes:mes+1
            }
        })).groupBy(function (hora) {
            return hora.responsable.id + "-"+ hora.mes;
        })).map(function (g,key) {
            return {
                id:key.split("-")[0],
                horas: _(g).reduce(function (m,x) {
                    return m + x.horas;
                },0),
                minutos: _(g).reduce(function (m,x) {
                    return m + x.minutos
                },0),
                mes: Number(key.split("-")[1])
            }
        })

        let responsablexhorasxmes = _(horasxmiembro).groupBy(function (responsable) {
            return responsable.id;
        })

        // debugger;
        let datasets = []

        for (var responsable in responsablexhorasxmes ) {
            if (responsablexhorasxmes.hasOwnProperty(responsable)) {
                let info = {}
                let data = []
                let backgroundColors = []
                let color = dynamicColors();

                info.label = Meteor.users.findOne(responsable).profile.nombre + " " + Meteor.users.findOne(responsable).profile.apellido ;
                for (var i = 1; i <= 12; i++) {
                    let query = _.where(responsablexhorasxmes[responsable],{mes:i});
                    // if(query.length>0){
                    //
                    // }
                    let horas = query.length>0? query[0].horas:0;
                    data.push(horas)
                    backgroundColors.push(color)
                }
                info.data = data;
                info.fillColor= backgroundColors;
                info.color = backgroundColors;
                info.borderColor = backgroundColors;
                datasets.push(info)
            }
        }


        // for (var gastos in gastosxasunto) {
        //     if (gastosxasunto.hasOwnProperty(gastos)) {
        //         let mes = gastos.groupBy(function (gasto) {
        //             return gasto.mes
        //         })
        //         meses.push(mes);
        //     }
        // }



        debugger

        var ctx = document.getElementById("horasMiembrosChart").getContext("2d");

        let meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

        let myPieChart = new Chart(ctx).Bar({
            labels: meses,
            datasets: datasets
        },{
            animateScale: true,
            legendTemplate : '<ul style=\"display: flex; width: 85%; margin: 0 auto; flex-wrap: wrap; justify-content: center;\">'
                  +'<% for (var i=0; i<datasets.length; i++) { %>'
                    +'<li style=\" margin-right: 10px;\" >'
                    +'<div style=\"display: inline-block;\"><div style=\"background-color:<%=datasets[i].fillColor[0]%>;width:20px;height:20px;  border-radius: 70%; display: inline-block; margin-right: 2.5px;\"></div><span><% if (datasets[i].label) { %><%= datasets[i].label %><% } %></span></div>'
                    +'</p>'
                  +'</li>'
                +'<% } %>'
              +'</ul>'
        });

        document.getElementById("legendDivhorasmiembros").innerHTML = myPieChart.generateLegend();
    }

    Tracker.autorun(chartLine);

})



Template.gastosChart.onRendered(function () {
    function chartLine() {
        // var dynamicColors = function() {
        //     var r = Math.floor(Math.random() * 255);
        //     var g = Math.floor(Math.random() * 255);
        //     var b = Math.floor(Math.random() * 255);
        //     return "rgb(" + r + "," + g + "," + b + ")";
        // }
        //

        var dynamicColors = function() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return "rgba(" + r + "," + g + "," + b + ",0.5)";
        }


        let gastosxasunto = _(_(Gastos.find({'asunto':{$exists:true}}).map(function (gasto) {
            let mes = gasto.fecha.getMonth()
            return {
                _id:gasto._id,
                monto:gasto.monto,
                asunto:gasto.asunto,
                mes:mes+1
            }
        })).groupBy(function (gasto) {
            return gasto.asunto.id + "-"+gasto.mes;
        })).map(function (g,key) {
            return {
                    id:key.split("-")[0],
                    monto: _(g).reduce(function (m,x) {
                        return m + x.monto;
                    },0),
                    mes: Number(key.split("-")[1])
                }
        })

        let gastosxasuntoxmes = _(gastosxasunto).groupBy(function (asunto) {
            return asunto.id;
        })

        let datasets = []

        for (var asunto in gastosxasuntoxmes) {
            if (gastosxasuntoxmes.hasOwnProperty(asunto)) {
                let info = {}
                let data = []
                info.label = Asuntos.findOne(asunto).caratula;
                // info.fill = false
                let backgroundColors = []
                let color = dynamicColors();

                for (var i = 1; i <= 12; i++) {
                    backgroundColors.push(color)
                    let query = _.where(gastosxasuntoxmes[asunto],{mes:i});
                    let monto = query.length>0? query[0].monto:0;
                    data.push(monto)
                }
                info.data = data;
                info.fillColor= dynamicColors();
                info.highlightFill = "rgba(220,220,220,0.75)"
                info.highlightStroke = "rgba(220,220,220,1)"
                info.strokeColor= "rgba(220,220,220,0.8)",

                datasets.push(info)
            }
        }


        // for (var gastos in gastosxasunto) {
        //     if (gastosxasunto.hasOwnProperty(gastos)) {
        //         let mes = gastos.groupBy(function (gasto) {
        //             return gasto.mes
        //         })
        //         meses.push(mes);
        //     }
        // }



        //debugger

        // var gastosxasunto = _(Gastos.find({'asunto':{$exists:true}}).fetch()).groupBy(function (gasto) {
        //     return gastos.asunto.id;
        // })
        //
        //
        //
        // .map(function (g,key) {
        //     return {
        //             type:key,
        //             monto: _(g).reduce(function (m,x) {
        //                 return m + x.horas;
        //             },0),
        //             minutos: _(g).reduce(function (m,x) {
        //                 debugger
        //                 return m + x.minutos;
        //             },0)
        //         }
        // })



        var ctx = document.getElementById("gastosChart").getContext("2d");

        let meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

        let myPieChart = new Chart(ctx).Line({
            labels: meses,
            datasets: datasets
        },{
            animateScale: true,
            legendTemplate : '<ul style=\"display: flex; width: 90%; margin: 0 auto; flex-wrap: wrap; justify-content: center;\">'
                  +'<% for (var i=0; i<datasets.length; i++) { %>'
                    +'<li style=\"margin-right: 10px;\">'
                    +'<div style=\"display: inline-block;\"><div style=\"background-color:<%=datasets[i].fillColor%>;width:20px;height:20px; border-radius: 70%; display: inline-block; margin-right: 2.5px;\"></div><span><% if (datasets[i].label) { %><%= datasets[i].label %><% } %></span></div>'
                    +'</p>'
                  +'</li>'
                +'<% } %>'
              +'</ul>'
        });

        document.getElementById("legendDivGastos").innerHTML = myPieChart.generateLegend();
    }

    Tracker.autorun(chartLine);
})

Template.gastosChart.onCreated(function () {
    let self = this;
    let bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        self.subscribe('asuntos',bufeteId)
    })
})

Template.gastosChart.helpers(function () {

})

Template.resumenGastos.helpers({
  gastos() {
    let suma = 0;

    Gastos.find().forEach(function (index) {
      suma = suma + index.monto;
    });
    return suma;
    },
    gastosxasunto(){
        let asuntos = Asuntos.find().fetch();
        let gastos = Gastos.find({'asunto.id':{$exists:true}}).fetch();
        let grupos = _(gastos).groupBy(function (gasto) {
            return gasto.asunto.id;
        })



    }
});


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
            // debugger;
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

        // debugger;
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
                        // debugger
                        return m + x.minutos;
                    },0)
                }
        })

        // debugger;

        for (var i = 0; i < tiempoxAsunto.length; i++) {

            if(tiempoxAsunto[i].minutos>=60){
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
            if(tiempoxAsunto[i].minutos>=60){
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

        // debugger;

        return totalHoras + "h " + totalMinutos +"m " ;

    }
})

Template.ultimosGastos.onCreated(function () {
    var self = this;
    var bufeteId = Meteor.user().profile.bufeteId;
    self.autorun(function () {
        self.subscribe('ultimosGastos', bufeteId);
    })
});

Template.ultimosGastos.helpers({
    gastos: function () {
        return Gastos.find({}, {sort: {fecha: -1}});
    }
});
