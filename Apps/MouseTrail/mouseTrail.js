class mouseTrail extends particleManager {
	start() {
		this.addParticles(30);
	}

	update() {
		if (this.mousePos != null) {
			for (var p of this.particles) {
				p.moveToTarget(this.mousePos);
			}
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