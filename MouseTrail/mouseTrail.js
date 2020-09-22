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
				this.trailsEnabled = !this.trailsEnabled;
				for (var t of this.particleTrails) {
					t.reset();
				}
				break;
			case 'c' :
				this.collisionsEnabled = !this.collisionsEnabled;
				break;
		}
	}
}