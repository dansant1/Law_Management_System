chronometer = {}
chronometer.t = null;
chronometer.seconds = 0;
chronometer.minutes = 0;
chronometer.hours = 0;

chronometer.timer = function () {
	localStorage.startCr =  1;
    localStorage.pause = 1;

	localStorage.seconds = chronometer.seconds;
	localStorage.minutes = chronometer.minutes;
	localStorage.hours = chronometer.hours;
	chronometer.t = setTimeout(chronometer.add, 1000);
}

chronometer.add = function() {
	chronometer.seconds++;
	if (chronometer.seconds >= 60) {
		chronometer.seconds = 0;
		chronometer.minutes++;
		if (chronometer.minutes >= 60) {
			chronometer.minutes = 0;
			chronometer.hours++;
		}
	}
	//debugger;

	$(chronometer.element)[0].textContent = (chronometer.hours ? (chronometer.hours > 9 ? chronometer.hours : "0" + chronometer.hours) : "00") + ":" + (chronometer.minutes ? (chronometer.minutes > 9 ? chronometer.minutes : "0" + chronometer.minutes) : "00");

	chronometer.timer();
}

chronometer.addMinutes = function (minutes) {

    chronometer.minutes += minutes;
    if (chronometer.minutes >= 60) {
        chronometer.minutes = 0;
        chronometer.hours++;
    }

    $(chronometer.element)[0].textContent = (chronometer.hours ? (chronometer.hours > 9 ? chronometer.hours : "0" + chronometer.hours) : "00") + ":" + (chronometer.minutes ? (chronometer.minutes > 9 ? chronometer.minutes : "0" + chronometer.minutes) : "00");

}

chronometer.removeMinutes = function (minutes) {

    chronometer.minutes -= minutes;
    if (chronometer.minutes <= 0) {
        if(chronometer.hours==0) chronometer.minutes= 0;
        else{
            chronometer.minutes = 59;
            if(chronometer.hours>=1)   chronometer.hours--;
        }
    }

	$(chronometer.element)[0].textContent = (chronometer.hours ? (chronometer.hours > 9 ? chronometer.hours : "0" + chronometer.hours) : "00") + ":" + (chronometer.minutes ? (chronometer.minutes > 9 ? chronometer.minutes : "0" + chronometer.minutes) : "00");
}

chronometer.stop = function () {
    localStorage.pause = 0;
    clearTimeout(chronometer.t);
}

chronometer.reset = function () {
    localStorage.startCr= 0;
    clearTimeout(chronometer.t)
    chronometer.minutes = 0;
    chronometer.seconds = 0;
    chronometer.hours = 0;
    $(chronometer.element)[0].textContent = (chronometer.hours ? (chronometer.hours > 9 ? chronometer.hours : "0" + chronometer.hours) : "00") + ":" + (chronometer.minutes ? (chronometer.minutes > 9 ? chronometer.minutes : "0" + chronometer.minutes) : "00");

}
