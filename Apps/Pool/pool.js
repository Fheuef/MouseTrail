class mouseTrail extends particleManager {
	start() {
		this.trailsEnabled = false;
		defaultLength = 2;
		minRadius = 12;
		maxRadius = 50;

		this.pushMult = 20000;

		this.pushing = false;

		this.gravity = 1;
		this.gravVec = new Vector2(0, this.gravity);

		this.addParticles(300);
	}

	update() {
		for (var p of this.particles) {
			p.addMovement(this.gravVec);
		}

		if (this.pushing)
			this.pushParticles();
	}

	pushParticles() {
		for (var p of this.particles) {
			var vec = p.pos.subtract(this.mousePos);
			var len = vec.length();
			p.addForce(vec.multiply(this.pushMult / Math.pow(len, 3)));
		}
	}

	keyBinds(event) {
		switch(event.key) {
			case 't' :
				this.enableTrails(!this.trailsEnabled);
				break;
			case 'c' :
				this.collisionsEnabled = !this.collisionsEnabled;
				break;
			case 'p' :
				this.pause = !this.pause;
				break;
		}
	}

	mouseDown(event) {
		switch(event.button) {
			case 0:
				this.pushing = true;
				break;
		}
	}

	mouseUp(event) {
		switch(event.button) {
			case 0:
				this.pushing = false;
				break;
		}
	}
}