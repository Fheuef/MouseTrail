class mouseTrail extends particleManager {
	start() {
		defaultLength = 2;
		trailPrecision = 15;
		trailFadeOut = false;
		this.clearOnUpdate = false;

		this.addParticles(3);
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
			case 'c' :
				this.collisionsEnabled = !this.collisionsEnabled;
				break;

			case 'r' :
				this.clearScreen();
				break;

			case 'p' :
				this.pause = !this.pause;
				break;
		}
	}
}