var defaultLength = 4;

class ParticleTrail {
	constructor(particle, length = defaultLength) {
		this.particle = particle;
		this.positions = [];
		this.maxLength = length;
		this.cursor = -1;
	}

	moveCursor() {
		this.cursor = (this.cursor + 1) % this.maxLength;
	}

	addPosition(pos) {
		if (this.positions.length < length) {
			this.positions.add(pos);
			this.moveCursor();
		}
		else {
			this.moveCursor();
			this.positions[this.cursor] = pos;
		}
	}

	getTrail() {
		return this.positions.slice(this.cursor+1).concat(this.positions.slice(0, this.cursor+1));
	}

	length() {
		return this.positions.length;
	}

	move() {
		this.addPosition(this.particle.pos);
		return this.getTrail();
	}

	draw(ctx) {
		var part = this.particle;
		var lastPos = part.pos;
		var i = 0;
		var n = this.length();
		var colorS = part.color.replace("hsl", "hsla");

		for (var pos of this.move().reverse()) {
			ctx.fillStyle = colorS.replace("%)", "%, " + (1-(i++/n)) + ")");
			ctx.beginPath();
			ctx.arc(pos.x, pos.y, part.radius, 0, 2*Math.PI);

			var avgPos = lastPos.add(pos).divide(2);
			ctx.beginPath();
			ctx.arc(avgPos.x, avgPos.y, part.radius, 0, 2*Math.PI);
			ctx.fill();
		}
	}

	reset() {
		this.positions = [];
		this.cursor = -1;
	}
}