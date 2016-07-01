formatearFecha = function(fecha) {
    fecha = new Date(fecha);
    fecha = fecha.getFullYear() + "-" + ((String(fecha.getMonth()+1)).length>1? String(fecha.getMonth()+1): "0"+fecha.getMonth())+ "-" +((String(fecha.getDate())).length>1? fecha.getDate(): "0"+fecha.getDate())
    return fecha;
}
