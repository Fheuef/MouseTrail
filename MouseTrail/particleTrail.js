var defaultLength = 3;
var debug = false;

class ParticleTrail {
	constructor(particle, length = defaultLength) {
		this.particle = particle;
		this.positions = [];
		this.maxLength = length;
		this.cursor = 0;
	}

	moveCursor() {
		this.cursor = mod(this.cursor - 1, this.length);
		if (!debug) {
			debug = true;
		}
		if (debug) {
			console.log(this.cursor);
		}
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
		var n = this.length * 2;
		var i = n;
		var oldAlpha = ctx.globalAlpha;

		ctx.fillStyle = part.color;

		for (var pos of this.move()) {
			var avgPos = lastPos.add(pos).divide(2);
			ctx.globalAlpha = i--/n;
			ctx.beginPath();
			ctx.arc(avgPos.x, avgPos.y, part.radius, 0, 2*Math.PI);
			ctx.fill();

			ctx.globalAlpha = i--/n;
			ctx.beginPath();
			ctx.arc(pos.x, pos.y, part.radius, 0, 2*Math.PI);
			ctx.fill();

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