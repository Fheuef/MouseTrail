var defaultSpeed = 10;
var defaultSize = 100;

class ParticleEater {
    constructor(x = 0, y = 0, speed = defaultSpeed, size = defaultSize) {
        this.pos = new Vector2(x, y);
        this.vel = new Vector2(0, 0);
        this.speed = speed;
        this.size = size;
    }

    addForce(vel) {
        this.addMovement(vel.multiply(this.speed));
    }

    addMovement(vec) {
        this.vel = this.vel.add(vec);
    }

    updatePos() {
        this.pos = this.pos.add(this.vel);
    }
}