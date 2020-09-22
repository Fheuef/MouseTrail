var defaultRadius = 20;
var minRadius = 3;
var maxRadius = 20;
var defaultSpeed = 10;
var minSpeed = 1.25;
var maxSpeed = 9;
var defaultFriction = 0.007;
var movementSmoothness = 1000;

class Particle {
	constructor(x=0, y=0, radius = defaultRadius, speed = defaultSpeed) {
		this.pos = new Vector2(x, y);
		this.vel = new Vector2();
		this.radius = radius;
		this.speed = speed;
		this.friction = defaultFriction;
		this.target = new Vector2();
		this.color = "hsl(" + Math.random()*360 + ", 100%, 50%)";
		this.boundsCollision = true;
		this.particleCollision = true;
	}

	addForce(vel) {
		this.addMovement(vel.multiply(this.speed));
	}

	addMovement(vec) {
		this.vel = this.vel.add(vec);
	}

	applyFriction(f = this.friction) {
		this.addForce(this.vel.multiply(-f));
	}

	updatePos() {
		this.pos = this.pos.add(this.vel);
	}

	draw(ctx, x = this.pos.x, y = this.pos.y, opacity = 1) {
		//TODO save opacity
		ctx.beginPath();
		ctx.arc(x, y, this.radius, 0, 2*Math.PI);
		if (opacity == 1)
			ctx.fillStyle = this.color;
		else
			ctx.fillStyle = this.color.replace("hsl", "hsla").replace("%)", "%, " + (1-(i++/n)) + ")");
		ctx.fill();
	}

	moveToTarget(target = null) {
		if (target != null)
			this.target = target;

		this.addForce(this.target.subtract(this.pos).divide(movementSmoothness));
		this.applyFriction();
	}

	random() {
		this.radius = Math.random() * (maxRadius - minRadius) + minRadius;
		this.speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;

		return this;
	}
}