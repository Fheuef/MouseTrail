class Firework extends Particle {
	static minFuse = 0.3;
	static maxFuse = 0.6;
	static gravity = new Vector2(0, 0.5);
	static minFuseForce = Firework.gravity.y * 1.1;
	static maxFuseForce = Firework.gravity.y * 1.7;
	static maxHeight = 0;

	constructor(x=0, radius = defaultRadius, speed = defaultSpeed, fuse = Firework.randomFuse(), fuseForce = Firework.randomFuseForce()) {
		super(x, Firework.maxHeight, radius, speed);

		if (radius == defaultRadius && speed == defaultSpeed) {
			this.random();

			this.pos.y = Firework.maxHeight + this.radius;
		}

		this.boundsCollision = false;
		this.particleCollision = false;

		this.fuse = fuse;
		this.fuseForce = fuseForce;

		this.vel.y = -fuseForce * 8;

		this.active = true;
	}

	updatePos() {
		this.addMovement(Firework.gravity);

		if (this.active) {
			if (this.pos.y < this.fuse * Firework.maxHeight) {
				this.active = false;
			}
			else {
				this.addMovement(new Vector2(0, -this.fuseForce));
			}
		}

		super.updatePos();
	}

	static randomFuse() {
		return Math.random() * (Firework.maxFuse - Firework.minFuse) + Firework.minFuse;
	}

	static randomFuseForce() {
		return Math.random() * (Firework.maxFuseForce - Firework.minFuseForce) + Firework.minFuseForce;
	}
}