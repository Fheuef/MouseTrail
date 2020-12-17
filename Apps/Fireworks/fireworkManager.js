var fireworkInterval = 800;

class mouseTrail extends particleManager {
	start() {
		var maxHeight = this.trailCanvas.height
		Firework.maxHeight = maxHeight;

		defaultLength = 8;

		setInterval(this.addFirework.bind(this), fireworkInterval);
	}

	update() {
		var toDelete = [];

		for (var p of this.particles) {
			if (p.pos.y > this.trailCanvas.height + p.radius + 150) {
				toDelete.push(p);
			}
		}

		for (var p of toDelete) {
			this.remove(p);
		}
	}

	keyBinds(event) {
		switch(event.key) {
			case 'p' :
				this.pause = !this.pause;
				break;
		}
	}

	addFirework() {
		this.addParticle(new Firework(Math.random() * this.trailCanvas.width));
	}
}