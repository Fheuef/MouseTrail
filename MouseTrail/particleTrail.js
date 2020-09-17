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

	reset() {
		this.positions = [];
		this.cursor = -1;
	}
}