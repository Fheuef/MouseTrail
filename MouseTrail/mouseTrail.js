var tickMs = 22;

var trailCanvas;
var particles;
var mousePos;
var updateInterval;

function init() {
	trailCanvas = document.getElementById("trailCanvas");
	trailCanvas.width = window.innerWidth;
	trailCanvas.height = window.innerHeight;
	particles = [];
	//mousePos = new Vector2(trailCanvas.width/2, trailCanvas.height/2);
	mousePos = null;

	trailCanvas.onmousemove = updateMouse;
	
	addParticles(15);

	updateInterval = setInterval(update, tickMs);
}

function addParticle(part) {
	particles.push(part);
}

function addParticles(n) {
	for (let i = 0; i < n; i++) {
		let x = Math.random()*trailCanvas.width;
		let y = Math.random()*trailCanvas.height;
		addParticle(new Particle(x, y, Math.random()*20+10, Math.random()*8+1.25));
	}
}

function updateMouse(e) {
	if (mousePos == null)
		mousePos = new Vector2();
	
	mousePos.set(e.pageX, e.pageY);
}

function moveParticles() {
	if (mousePos != null) {
		for (var p of particles) {
			p.moveToTarget(mousePos);
		}
	}
}

function startParticlesUpdate() {
	for (var p of particles) {
		p.initForces();
	}
}

function updateParticles() {
	for (var p of particles) {
		p.updatePos();
	}
}

function checkBoundsCollisions() {
	for (var p of particles) {
		if (!p.boundsCollision)
			continue;

		if (p.pos.x < p.radius)
			p.vel.x = Math.abs(p.vel.x);
		else if (p.pos.x > trailCanvas.width - p.radius)
			p.vel.x = -Math.abs(p.vel.x);
		
		if (p.pos.y < p.radius)
			p.vel.y = Math.abs(p.vel.y);
		else if (p.pos.y > trailCanvas.height - p.radius)
			p.vel.y = -Math.abs(p.vel.y);
	}
}

function drawParticles() {
	var ctx = trailCanvas.getContext("2d");
	ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

	for (var p of particles) {
		ctx.beginPath();
		ctx.arc(p.pos.x, p.pos.y, p.radius, 0, 2*Math.PI);
		ctx.fillStyle = p.color;
		ctx.fill();
	}
}

function update() {
	startParticlesUpdate();

	moveParticles();
	checkBoundsCollisions();
	updateParticles();
	drawParticles();
}