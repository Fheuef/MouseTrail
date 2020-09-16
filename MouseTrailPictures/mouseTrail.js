var tickMs = 22;
var friction = 0.1;

var trailCanvas;
var particles;
var mousePos;
var updateInterval;
var img;

function init() {
	trailCanvas = document.getElementById("trailCanvas");
	trailCanvas.width = window.innerWidth;
	trailCanvas.height = window.innerHeight;
	particles = [];
	img = document.getElementById("source");
	mousePos = new Vector2();

	trailCanvas.onmousemove = updateMouse;

	addParticles(6);

	updateInterval = setInterval(update, tickMs);
	//si on clique
	trailCanvas.addEventListener('click', event => {
		for (var p of particles) {
			var truc = p.pos.subtract(mousePos);
			var len = truc.length();
			truc = truc.normalized().multiply(500 / (len + 10));
			p.addForce(truc);
		}
	});
	trailCanvas.addEventListener('contextmenu', event => {
		event.preventDefault();
		for (var p of particles) {
			p.addForce(p.pos.subtract(mousePos).divide(10));
		}
	});
}

function addParticle(part) {
	particles.push(part);
}

function addParticles(n) {
	for (let i = 0; i < n; i++) {
		addParticle(new Particle(Math.random() * 500, Math.random() * 500, Math.random() * 5 + 5));
	}
}

function updateMouse(e) {
	mousePos.set(e.pageX, e.pageY);
}

function moveParticles() {
	for (var p of particles) {
		p.addForce(mousePos.subtract(p.pos).divide(500));
		p.addMovement(p.vel.multiply(-friction));
		if (p.pos.x > trailCanvas.width) {
			p.vel.x = -Math.abs(p.vel.x);
		} else if (p.pos.x < 0) {
			p.vel.x = Math.abs(p.vel.x);
		}
		if (p.pos.y > trailCanvas.height) {
			p.vel.y = -Math.abs(p.vel.y);
		} else if (p.pos.y < 0) {
			p.vel.y = Math.abs(p.vel.y);
		}
	}
}

function updateParticles() {
	for (var p of particles) {
		p.updatePos();
	}
}

function drawParticles() {
	var ctx = trailCanvas.getContext("2d");
	ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
	ctx.fillStyle = "#000000";

	for (var p of particles) {
		// ctx.beginPath();
		// ctx.arc(p.pos.x, p.pos.y, 20, 0, 2 * Math.PI);
		// ctx.fill();
		ctx.drawImage(img, p.pos.x, p.pos.y);
	}
}

function update() {
	moveParticles();
	updateParticles();
	drawParticles();
}