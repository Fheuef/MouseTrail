var fwpMinRadius = 2;
var fwpMaxRadius = 4;

class FireworkPart extends Particle {
	static gravity = new Vector2(0, 0.5);

	constructor(x=0, y=0, radius = -1, speed = defaultSpeed) {
		super(x, y, radius, speed);

		if (radius == -1) {
			this.random();
		}
	}

	updatePos() {
		this.addMovement(FireworkPart.gravity);

		super.updatePos();
	}

	random() {
		this.radius = Math.random() * (fwpMaxRadius - fwpMinRadius) + fwpMinRadius
	}
}