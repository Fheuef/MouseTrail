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
		this.collisionMult = 1.7;
		this.collisionsPushMult = 0.00005;

		this.trailCanvas.addEventListener("mousemove", this.updateMouse.bind(this));

		document.addEventListener("keydown", this.keyBinds.bind(this));

		document.addEventListener("mousedown", this.mouseDown.bind(this));
		document.addEventListener("mouseup", this.mouseUp.bind(this));

		this.drawBackground();

		this.start();
	}

	start() {

	}

	keyBinds(event) {

	}

	mouseDown(event) {

	}

	mouseUp(event) {

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

	remove(part) {
		var ind = this.particles.indexOf(part);

		if (ind != -1) {
			let trails = this.particleTrails;
			for (let i = 0; i < trails.length; i++) {
				if (trails[i].particle == part) {
					this.particleTrails.splice(i, 1);
					break;
				}
			}

			this.particles.splice(ind, 1);
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
		let bMult = this.bounceMult * 0.85;
		for (var p of this.particles) {
			if (!p.boundsCollision)
				continue;

			let nextPos = p.pos.add(p.vel);
	
			if (nextPos.x < p.radius && p.vel.x < 0) {
				p.pos.x = p.radius;
				p.vel.x = Math.abs(p.vel.x) * bMult;
			}
			else if (nextPos.x > trailCanvas.width - p.radius && p.vel.x > 0){
				p.pos.x = trailCanvas.width - p.radius;
				p.vel.x = -Math.abs(p.vel.x) * bMult;
			}
			
			if (nextPos.y < p.radius && p.vel.y < 0) {
				p.pos.y = p.radius;
				p.vel.y = Math.abs(p.vel.y) * bMult;
			}
			else if (nextPos.y > trailCanvas.height - p.radius && p.vel.y > 0) {
				p.pos.y = trailCanvas.height - p.radius;
				p.vel.y = -Math.abs(p.vel.y) * bMult;
			}
		}
	}
	
	checkParticleCollisions() {
		var i = 0;
		for (var p of this.particles) {
			i++;
	
			if (!p.particleCollision)
				continue;

			let pNext = p.pos.add(p.vel);
			let m1 = 1/p.speed;
	
			let others = this.particles.slice(i);
			for (var o of others) {
				if (!o.particleCollision)
					continue;

				let oNext = o.pos.add(o.vel);
	
				let dif = oNext.subtract(pNext);
				// let dif = o.pos.subtract(p.pos);
				if (dif.length2() <= Math.pow(p.radius + o.radius, 2)) {
					let distance = dif.length();
					let difDir = dif.divide(distance);
					let velDif = o.vel.subtract(p.vel);
					let pushAway = distance - p.radius - o.radius;
					let force = velDif.dot(dif) / distance;

					if (force < 0) {
						let forceVec = difDir.multiply(force);
						let m2 = 1/o.speed;
						let r = this.collisionMult/(m1+m2);
		
						p.addMovement(forceVec.multiply(m2*r));
						o.addMovement(forceVec.multiply(-m1*r));
					}

					let pushVec = difDir.multiply(Math.pow(pushAway, 2) * this.collisionsPushMult);
					p.addForce(pushVec.negative());
					o.addForce(pushVec);
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