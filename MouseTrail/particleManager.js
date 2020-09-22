class particleManager {
	constructor() {

	}

	init() {
		this.tickMs = 22;
		this.bounceMult = 0.8;
		this.trailsEnabled = true;
		this.collisionsEnabled = true;

		this.trailCanvas = document.getElementById("trailCanvas");
		this.trailCanvas.width = window.innerWidth;
		this.trailCanvas.height = window.innerHeight;
		this.particles = [];
		this.particleTrails = [];
		this.mousePos = null;

		this.trailCanvas.addEventListener("mousemove", this.updateMouse.bind(this));

		this.start();
	}

	start() {

	}

	keyBinds(event) {

	}

	addParticle(part, trail = true) {
		this.particles.push(part);
		if (trail)
			this.addPartTrail(part);
	}
	
	addPartTrail(p) {
		this.particleTrails.push(new ParticleTrail(p));
	}
	
	addPartTrailToAll() {
		for (var p of this.particles) {
			this.addPartTrail(p);
		}
	}
	
	addParticles(n) {
		for (let i = 0; i < n; i++) {
			let x = Math.random()*this.trailCanvas.width;
			let y = Math.random()*this.trailCanvas.height;
			this.addParticle(new Particle(x, y).random());
		}
	}
	
	updateMouse(e) {
		if (this.mousePos == null)
			this.mousePos = new Vector2();
		
		var rect = this.trailCanvas.getBoundingClientRect();
		this.mousePos.set(e.clientX - rect.left, e.clientY - rect.top);
	}
	
	updateParticles() {
		for (var p of this.particles) {
			p.updatePos();
		}
	}
	
	checkBoundsCollisions() {
		for (var p of this.particles) {
			if (!p.boundsCollision)
				continue;
	
			if (p.pos.x < p.radius && p.vel.x < 0)
				p.vel.x = Math.abs(p.vel.x) * this.bounceMult;
			else if (p.pos.x > trailCanvas.width - p.radius && p.vel.x > 0)
				p.vel.x = -Math.abs(p.vel.x) * this.bounceMult;
			
			if (p.pos.y < p.radius && p.vel.y < 0)
				p.vel.y = Math.abs(p.vel.y) * this.bounceMult;
			else if (p.pos.y > trailCanvas.height - p.radius && p.vel.y > 0)
				p.vel.y = -Math.abs(p.vel.y) * this.bounceMult;
		}
	}
	
	checkParticleCollisions() {
		var i = 0;
		for (var p of this.particles) {
			i++;
	
			if (!p.particleCollision)
				continue;
	
			let others = this.particles.slice(i);
			for (var o of others) {
				if (!o.particleCollision)
					continue;
	
				let dif = o.pos.subtract(p.pos);
				let distance = dif.length();
				if (distance <= p.radius + o.radius) {
					let velDif = o.vel.subtract(p.vel).multiply(this.bounceMult);
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
	
	clearScreen() {
		var ctx = this.trailCanvas.getContext("2d");
		ctx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);
	}
	
	draw() {
		this.clearScreen();
	
		if (this.trailsEnabled) {
			this.drawTrails();
		}
	
		this.drawParticles();
	}
	
	drawParticles() {
		var ctx = this.trailCanvas.getContext("2d");
	
		for (var p of this.particles) {
			ctx.beginPath();
			ctx.arc(p.pos.x, p.pos.y, p.radius, 0, 2*Math.PI);
			ctx.fillStyle = p.color;
			ctx.fill();
		}
	}
	
	drawTrails() {
		var ctx = this.trailCanvas.getContext("2d");
	
		for (var trail of this.particleTrails) {
			var part = trail.particle;
			var lastPos = part.pos;
			var i = 0;
			var n = trail.length();
			var colorS = part.color.replace("hsl", "hsla");
	
			for (var pos of trail.move().reverse()) {
				ctx.fillStyle = colorS.replace("%)", "%, " + (1-(i++/n)) + ")");
				ctx.beginPath();
				ctx.arc(pos.x, pos.y, part.radius, 0, 2*Math.PI);
	
				var avgPos = lastPos.add(pos).divide(2);
				ctx.beginPath();
				ctx.arc(avgPos.x, avgPos.y, part.radius, 0, 2*Math.PI);
				ctx.fill();
			}
		}
	}
	
	updateBase() {
		this.update();
		this.checkBoundsCollisions();
	
		if (this.collisionsEnabled)
			this.checkParticleCollisions();
	
		this.updateParticles();

		this.draw();
	}

	update() {

	}
}