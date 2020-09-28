var defaultLength = 4;
var trailPrecision = 2;
var trailFadeOut = true;

class ParticleTrail {
	constructor(particle, length = defaultLength) {
		this.particle = particle;
		this.positions = [];
		this.maxLength = length;
		this.cursor = 0;
		this.fadeOut = trailFadeOut;
		this.precision = trailPrecision;
	}

	moveCursor() {
		this.cursor = mod(this.cursor - 1, this.length);
	}

	addPosition(pos) {
		if (this.length < this.maxLength) {
			this.positions.unshift(pos);
		}
		else {
			this.moveCursor();
			this.positions[this.cursor] = pos;
		}
	}

	getTrail() {
		return this.positions.slice(this.cursor+1).concat(this.positions.slice(0, this.cursor+1));
	}

	get length() {
		return this.positions.length;
	}

	move() {
		this.addPosition(this.particle.pos);
		return this.getTrail();
	}

	draw(ctx) {
		var part = this.particle;
		var lastPos = part.pos;
		var n = this.length * this.precision;
		var i = n;
		var oldAlpha = ctx.globalAlpha;

		ctx.fillStyle = part.color;

		for (var pos of this.move()) {
			let step = new Vector2();
			for (let j = 1; j <= this.precision; j++) {
				if (this.fadeOut)
					ctx.globalAlpha = i--/n;

				let radMult = 0.5*(i/n) + 0.5;
				ctx.beginPath();
				step = lastPos.lerp(pos, j / this.precision);
				ctx.arc(step.x, step.y, part.radius * radMult, 0, 2*Math.PI);
				ctx.fill();
			}

			lastPos = pos;
		}

		ctx.globalAlpha = oldAlpha;
	}

	reset() {
		this.positions = [];
		this.cursor = -1;
	}
}

function mod(n, m) {
	return ((n % m) + m) % m;
}