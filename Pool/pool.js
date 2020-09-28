class mouseTrail extends particleManager {
	start() {
		defaultLength = 2;
		minRadius = 8;
		maxRadius = 40;

		this.gravity = 1;
		this.gravVec = new Vector2(0, this.gravity);

		this.addParticles(400);
	}

	update() {
		for (var p of this.particles) {
			p.addMovement(this.gravVec);
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
}