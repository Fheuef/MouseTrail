class particleManager {
	constructor() {

	}

	init() {
		this.tickMs = 22;
		this.bounceMult = 0.8;
		this.trailsEnabled = true;
		this.collisionsEnabled = true;
		this.backgroundColor = "#222";

		this.trailCanvas = document.getElementById("trailCanvas");
		this.trailCanvas.width = window.innerWidth;
		this.trailCanvas.height = window.innerHeight;
		this.particles = [];
		this.particleTrails = [];
		this.mousePos = null;
		this.pause = false;
		this.clearOnUpdate = true;

		this.trailCanvas.addEventListener("mousemove", this.updateMouse.bind(this));

		document.addEventListener("keydown", this.keyBinds.bind(this));

		this.drawBackground();

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

	enableTrails(on) {
		if (this.trailsEnabled != on) {
			this.trailsEnabled = on;
			for (var t of this.particleTrails) {
				t.reset();
			}
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

	drawBackground(ctx = this.trailCanvas.getContext("2d")) {
		ctx.fillStyle = "#222";
		ctx.fillRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);
	}
	
	clearScreen() {
		var ctx = this.trailCanvas.getContext("2d");
		ctx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);
		this.drawBackground(ctx);
	}
	
	draw() {
		var ctx = this.trailCanvas.getContext("2d")

		if (this.clearOnUpdate) {
			this.clearScreen();
		}
	
		if (this.trailsEnabled) {
			this.drawTrails(ctx);
		}
	
		this.drawParticles(ctx);
	}
	
	drawParticles(ctx = this.trailCanvas.getContext("2d")) {	
		for (var p of this.particles) {
			p.draw(ctx)
		}
	}
	
	drawTrails(ctx = this.trailCanvas.getContext("2d")) {
		for (var trail of this.particleTrails) {
			trail.draw(ctx);
		}
	}
	
	updateBase() {
		if (!this.pause) {
			this.update();
			this.checkBoundsCollisions();
		
			if (this.collisionsEnabled)
				this.checkParticleCollisions();
		
			this.updateParticles();

			this.draw();
		}
	}

	update() {

	}
}