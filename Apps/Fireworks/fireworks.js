class mouseTrail extends particleManager {
	start() {
		this.addParticles(30);
	}

	update() {
		// if (this.mousePos != null) {
		// 	for (var p of this.particles) {
		// 		p.moveToTarget(this.mousePos);
		// 	}
		// }
	}

	keyBinds(event) {
		switch(event.key) {
			case 'p' :
				this.pause = !this.pause;
				break;
		}
	}
}