var tickMs = 22;
var friction = 0.1;

var trailCanvas;
var particles;
var mousePos;
var updateInterval;
var pistol;
var targets = [];

function init() {
	//notre Canvas/zone de dessin
	trailCanvas = document.getElementById("trailCanvas");
	trailCanvas.width = window.innerWidth;
	trailCanvas.height = window.innerHeight;
	//tableau de particules
	particles = [];
	//on récupère l'image de pistolet
	pistol = document.getElementById("pistol");
	//vecteur pour la position de la souris, actualisation du vecteur si on la bouge
	mousePos = new Vector2();
	trailCanvas.onmousemove = updateMouse;
	//ajout de 4 particules
	addParticles(4);
	//boucle qui actualise l'écran toutes les 22 milisecondes
	updateInterval = setInterval(update, tickMs);
	//si on clique, gauche puis droit
	trailCanvas.addEventListener('click', event => {
		for (var p of particles) {
			var truc = p.pos.subtract(mousePos);
			var len = truc.length();
			truc = truc.normalized().multiply(500 / (len + 10));
			p.addForce(truc);
		}
	});
	trailCanvas.addEventListener('contextmenu', event => {
		event.preventDefault();
		for (var p of particles) {
			p.addForce(p.pos.subtract(mousePos).divide(10));
		}
	});
	//si on appui sur la touche "p" ajout d'une particule
	document.addEventListener('keydown', (event) => {
		if (event.key == 'p') {
			addParticles(1);
		}
	});

}

function addParticle(part) {
	particles.push(part);
}

function addParticles(n) {
	for (let i = 0; i < n; i++) {
		addParticle(new Particle(Math.random() * 500, Math.random() * 500, Math.random() * 5 + 5));
	}
}

function updateMouse(e) {
	var rect = trailCanvas.getBoundingClientRect();
	mousePos.set(e.clientX - rect.left, e.clientY - rect.top);
}

function moveParticles(p) {

	p.addForce(mousePos.subtract(p.pos).divide(500));
	p.addMovement(p.vel.multiply(-friction));
	if (p.pos.x > trailCanvas.width) {
		p.vel.x = -Math.abs(p.vel.x);
	} else if (p.pos.x < 0) {
		p.vel.x = Math.abs(p.vel.x);
	}
	if (p.pos.y > trailCanvas.height) {
		p.vel.y = -Math.abs(p.vel.y);
	} else if (p.pos.y < 0) {
		p.vel.y = Math.abs(p.vel.y);
	}
}

function updateParticles(p) {
	p.updatePos();
	for (var t of targets) {
		//si une particule touche notre glouton
		if (p.hit(t)) {
			//on l'enlève du tableau
			particles.splice(p, 1);
		}
	}
}

//affichage des particules et du mangeur de particules :D
function drawParticles() {
	var ctx = trailCanvas.getContext("2d");
	ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
	ctx.fillStyle = "#000000";
	var i = 0;
	for (var p of particles) {
		// i++;
		// if (i > img.length - 1) {
		// 	i = 0;
		// }
		ctx.beginPath();
		ctx.arc(p.pos.x, p.pos.y, 20, 0, 2 * Math.PI);
		ctx.fill();
		// ctx.drawImage(img[i], p.pos.x, p.pos.y, 30, 30);
	}

	var pistolPos = new Vector2(100, trailCanvas.height / 2);
	var pistolCenter = pistolPos.add(new Vector2(140, 120));
	var pistolDif = mousePos.subtract(pistolCenter);
	var pistolAngle = Math.atan2(pistolDif.y, pistolDif.x);
	drawImageRotate(ctx, pistol, pistolPos.x, pistolPos.y, 300, 200, pistolAngle * 180/Math.PI);
}

function drawImageRotate(ctx, image, x, y, w, h, degrees) {
	ctx.save();
	ctx.translate(x + w / 2, y + h / 2);
	ctx.rotate(degrees * Math.PI / 180.0);
	ctx.translate(-x - w / 2, -y - h / 2);
	ctx.drawImage(image, x, y, w, h);
	ctx.restore();
}

function update() {
	for (var p of particles) {
		moveParticles(p);
		updateParticles(p);
	}
	drawParticles();
}