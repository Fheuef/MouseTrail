var defaultRadius = 20;
var defaultSpeed = 10;
var defaultFriction = 0.007;
var movementSmoothness = 1000;

class Particle {
	constructor(x=0, y=0, radius = defaultRadius, speed = defaultSpeed) {
		this.pos = new Vector2(x, y);
		this.vel = new Vector2();
		this.forces = new Vector2();
		this.radius = radius;
		this.speed = speed;
		this.friction = defaultFriction;
		this.target = new Vector2();
		this.color = "hsl(" + Math.random()*360 + ", 100%, 50%)";
		this.boundsCollision = true;
		this.ballCollision = true;
	}

	initForces() {
		this.forces = new Vector2();
	}

	addForce(vel) {
		this.forces = this.forces.add(vel);
	}

	addMovement(vec) {
		this.vel = this.vel.add(vec);
	}

	applyFriction(f = this.friction) {
		this.addForce(this.vel.multiply(-f));
	}

	updatePos() {
		this.addMovement(this.forces.multiply(this.speed));
		this.pos = this.pos.add(this.vel);
	}

	moveToTarget(target = null) {
		if (target != null)
			this.target = target;

		this.addForce(this.target.subtract(this.pos).divide(movementSmoothness));
		this.applyFriction();
	}
}