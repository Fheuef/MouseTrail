var defaultSpeed = 10;

class Particle {
	constructor(x=0, y=0, speed = defaultSpeed) {
		this.pos = new Vector2(x, y);
		this.vel = new Vector2(0, 0);
		this.speed = speed;
	}

	addForce(vel) {
		this.addMovement(vel.multiply(this.speed));
	}

	addMovement(vec) {
		this.vel = this.vel.add(vec);
	}

	updatePos() {
		this.pos = this.pos.add(this.vel);
	}
}