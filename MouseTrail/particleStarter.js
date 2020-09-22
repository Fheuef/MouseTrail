var updateInterval;
var partMan;

function init() {
	partMan = new mouseTrail();
	partMan.init();

	updateInterval = setInterval(update, partMan.tickMs);
}

function update() {
	partMan.updateBase();
}
