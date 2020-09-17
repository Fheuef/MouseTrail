var tickMs = 22;
var bounceMult = 0.8;
var trailsEnabled = true;
var collisonsEnabled = true;

var trailCanvas;
var particles;
var particleTrails;
var mousePos;
var updateInterval;

function init() {
	trailCanvas = document.getElementById("trailCanvas");
	trailCanvas.width = window.innerWidth;
	trailCanvas.height = window.innerHeight;
	particles = [];
	particleTrails = [];
	//mousePos = new Vector2(trailCanvas.width/2, trailCanvas.height/2);
	mousePos = null;

	trailCanvas.onmousemove = updateMouse;
	
	addParticles(30);

	updateInterval = setInterval(update, tickMs);

	document.addEventListener("keydown", (event) => {
		switch(event.key) {
			case 't' :
				trailsEnabled = !trailsEnabled;
				for (var t of particleTrails) {
					t.reset();
				}
				break;
			case 'c' :
				collisonsEnabled = !collisonsEnabled;
				break;
		}
	});
}

function addParticle(part, trail = true) {
	particles.push(part);
	if (trail)
		addPartTrail(part);
}

function addPartTrail(p) {
	particleTrails.push(new ParticleTrail(p));
}

function addPartTrailToAll() {
	for (var p of particles) {
		addPartTrail(p);
	}
}

function addParticles(n) {
	for (let i = 0; i < n; i++) {
		let x = Math.random()*trailCanvas.width;
		let y = Math.random()*trailCanvas.height;
		addParticle(new Particle(x, y).random());
	}
}

function updateMouse(e) {
	if (mousePos == null)
		mousePos = new Vector2();
	
	var rect = trailCanvas.getBoundingClientRect();
	mousePos.set(e.clientX - rect.left, e.clientY - rect.top);
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

function clearScreen() {
	var ctx = trailCanvas.getContext("2d");
	ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
}

function drawParticles() {
	var ctx = trailCanvas.getContext("2d");

	for (var p of particles) {
		ctx.beginPath();
		ctx.arc(p.pos.x, p.pos.y, p.radius, 0, 2*Math.PI);
		ctx.fillStyle = p.color;
		ctx.fill();
	}
}

function drawTrails() {
	var ctx = trailCanvas.getContext("2d");
	var oldWidth = ctx.lineWidth;

	for (var trail of particleTrails) {
		var part = trail.particle;
		//var lastPos = part.pos;
		var i = 0;
		var n = trail.length();
		var colorS = part.color.replace("hsl", "hsla");
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(part.pos.x, part.pos.y);
		for (var pos of trail.move().reverse()) {
			
			ctx.lineTo(pos.x, pos.y);
			ctx.strokeStyle = colorS.replace("%)", "%, " + (1-(i++/n)) + ")");
			ctx.stroke();
			//lastPos = pos;
		}
	}

	ctx.lineWidth = oldWidth;
}

function drawSimpleTrails() {
	var ctx = trailCanvas.getContext("2d");

	for (var trail of particleTrails) {
		var part = trail.particle;
		var i = 0;
		var n = trail.length();
		var colorS = part.color.replace("hsl", "hsla");

		for (var pos of trail.move().reverse()) {
			ctx.beginPath();
			ctx.arc(pos.x, pos.y, part.radius, 0, 2*Math.PI);
			ctx.fillStyle = colorS.replace("%)", "%, " + (1-(i++/n)) + ")");
			ctx.fill();
		}
	}

	ctx.lineWidth = oldWidth;
}

function update() {
	moveParticles();
	checkBoundsCollisions();

	if (collisonsEnabled)
		checkParticleCollisions();

	updateParticles();

	clearScreen();

	if (trailsEnabled) {
		//drawTrails();
		drawSimpleTrails();
	}

	drawParticles();
}