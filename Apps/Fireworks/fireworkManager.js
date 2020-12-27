var fireworkInterval = 600;
var fwkMinForce = 15;
var fwkMaxForce = 20;

class mouseTrail extends particleManager {
	start() {
		minRadius = 5;
		maxRadius = 8;
		
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

			if (p instanceof Firework && !p.active) {
				toDelete.push(p);
				this.addFireworkBoom(p.pos.x, p.pos.y, 10);
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

	mouseDown() {
		this.addFireworkBoom(this.mousePos.x, this.mousePos.y, 15);
	}

	addFirework() {
		if (!this.pause)
			this.addParticle(new Firework(Math.random() * this.trailCanvas.width));
	}

	addFireworkBoom(x, y, count) {
		for (let i = 0; i < count; i++) {
			var force = Math.random() * (fwkMaxForce - fwkMinForce) + fwkMinForce;

			var ang = Math.random() * Math.PI * 2;

			var part = new FireworkPart(x, y);
			part.vel = new Vector2(Math.cos(ang), Math.sin(ang)).multiply(force);
			part.boundsCollision = false;

			this.addParticle(part);
		}
	}
}