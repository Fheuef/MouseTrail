class FireworkPart extends Particle {
	static gravity = new Vector2(0, 0.5);

	constructor(x=0, y=0, radius = defaultRadius, speed = defaultSpeed) {
		super(x, y, radius, speed);
	}
}