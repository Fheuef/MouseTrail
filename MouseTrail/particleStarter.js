var updateInterval;
var partMan;

function init() {
	partMan = new mouseTrail();
	partMan.init();

	updateInterval = setInterval(update, partMan.tickMs);

	document.addEventListener("keydown", function(event) {
		partMan.keyBinds(event).bind(partMan); //error ?
	});
}

function update() {
	partMan.updateBase();
}
