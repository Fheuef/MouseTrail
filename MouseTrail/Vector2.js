class Vector2 {
	constructor(x=0, y=0) {
		this.x = x;
		this.y = y;
	}

	set(x, y) {
		this.x = x;
		this.y = y;
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	add(vec) {
		return new Vector2(this.x + vec.x, this.y + vec.y);
	}

	subtract(vec) {
		return new Vector2(this.x - vec.x, this.y - vec.y);
	}

	negative() {
		return new Vector2(-this.x, -this.y);
	}

	dot(vec) {
		return this.x * vec.x + this.y * vec.y;
	}

	multiply(n) {
		return new Vector2(this.x * n, this.y * n);
	}

	divide(n) {
		return new Vector2(this.x / n, this.y / n);
	}

	normalized() {
		let n = this.length();
		return this.divide(n);
	}

	lerp(vec, n) {
		return vec.multiply(n).add(this.multiply(1-n));
	}

	clampLength(n) {
		let len = this.length();
		if (len > n)
			return this.divide(len).multiply(n);
		else
			return this.clone();
	}

	clone() {
		return new Vector2(this.x, this.y);
	}
}