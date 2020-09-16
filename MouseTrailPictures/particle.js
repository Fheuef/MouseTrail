var defaultSpeed = 10;

class Particle {
	constructor(x = 0, y = 0, speed = defaultSpeed) {
		this.pos = new Vector2(x, y);
		this.vel = new Vector2(0, 0);
		this.speed = speed;
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
	//si il touche un objet de type particule eater (ou particule mais avec un attribut taille)
	hit(eater) {
		/*si il est entre l'abscisse de l'objet et son abscisse + sa taille (largeur et hauteur pareils car ellipse)
		et entre son ordonné et son ordonné + sa taille, donc si il rentre dans le cercle de l'objet
		*/
		if (this.pos.x > eater.pos.x && this.pos.x < eater.pos.x + eater.size &&
			this.pos.y > eater.pos.y && this.pos.y < eater.pos.y + eater.size) {
			return true;
		}
		//console.log("no hit");
		return false;

	}

}