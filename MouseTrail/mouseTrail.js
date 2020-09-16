var tickMs = 22;
var bounceMult = 0.8;

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
	
	addParticles(20);

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

function updateParticles() {
	for (var p of particles) {
		p.updatePos();
	}
}

function checkBoundsCollisions() {
	for (var p of particles) {
		if (!p.boundsCollision)
			continue;

		if (p.pos.x < p.radius && p.vel.x < 0)
			p.vel.x = Math.abs(p.vel.x) * bounceMult;
		else if (p.pos.x > trailCanvas.width - p.radius && p.vel.x > 0)
			p.vel.x = -Math.abs(p.vel.x) * bounceMult;
		
		if (p.pos.y < p.radius && p.vel.y < 0)
			p.vel.y = Math.abs(p.vel.y) * bounceMult;
		else if (p.pos.y > trailCanvas.height - p.radius && p.vel.y > 0)
			p.vel.y = -Math.abs(p.vel.y) * bounceMult;
	}
}

function checkParticleCollisions() {
	var i = 0;
	for (var p of particles) {
		i++;

		if (!p.particleCollision)
			continue;

		let others = particles.slice(i);
		for (var o of others) {
			if (!o.particleCollision)
				continue;

			let dif = o.pos.subtract(p.pos);
			let distance = dif.length();
			if (distance <= p.radius + o.radius) {
				let velDif = o.vel.subtract(p.vel).multiply(bounceMult);
				let pushAway = distance - p.radius - o.radius;
				let force = velDif.dot(dif) / (distance);
				let forceVec = dif.divide(distance).multiply(force + pushAway/10);

				let maxSpeed = Math.max(p.speed, o.speed);

				p.addForce(forceVec.divide(maxSpeed));
				o.addForce(forceVec.divide(-maxSpeed));
			}
		}
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
	moveParticles();
	checkBoundsCollisions();
	checkParticleCollisions();
	updateParticles();
	drawParticles();
}