var tickMs = 22;
var friction = 0.1;

var trailCanvas;
var particles;
var mousePos;
var updateInterval;
var img = [];
var eaterImg = [];
var eater = [];
var titouTab = [];
var animEater = 0;
var titou = false;
var t = 0;

function init() {
	//notre Canvas/zone de dessin
	trailCanvas = document.getElementById("trailCanvas");
	trailCanvas.width = window.innerWidth;
	trailCanvas.height = window.innerHeight;
	//tableau de particules
	particles = [];
	//on met nos images dans le tableau d'images
	img.push(document.getElementById("titou1"));
	img.push(document.getElementById("earth"));
	img.push(document.getElementById("mars"));
	img.push(document.getElementById("jupiter"));
	img.push(document.getElementById("venus"));
	titouTab.push(document.getElementById("titou1"));
	titouTab.push(document.getElementById("titouJ"));
	titouTab.push(document.getElementById("titouP"));
	eaterImg.push(document.getElementById("sun0"));
	eaterImg.push(document.getElementById("sun1"));
	eaterImg.push(document.getElementById("sun2"));
	eaterImg.push(document.getElementById("sun3"));
	eaterImg.push(document.getElementById("sun4"));
	eaterImg.push(document.getElementById("sun5"));
	eaterImg.push(document.getElementById("sun6"));
	eaterImg.push(document.getElementById("sun7"));
	eaterImg.push(document.getElementById("sun8"));
	eaterImg.push(document.getElementById("sun9"));
	eaterImg.push(document.getElementById("sun10"));
	//vecteur pour la position de la souris, actualisation du vecteur si on la bouge
	mousePos = new Vector2();
	trailCanvas.onmousemove = updateMouse;
	//ajout de 4 particules
	addParticles(4);
	//ajout d'un particleEater sur le coté de l'écran
	//eater[0] = new ParticleEater(trailCanvas.width / 2, trailCanvas.height / 2, 10, trailCanvas.width / 4);
	addEaters(1);
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
	//si on appui sur la touche "e" ajout d'un glouton
	document.addEventListener('keydown', (event) => {
		if (event.key == 'e') {
			addEaters(1);
		}
	});
	//si on appui sur la touche "t" mode Titouan
	document.addEventListener('keydown', (event) => {
		if (event.key == 't') {
			titou = !titou;
			console.log(t);
		}
	});

}

function logKey(e) {
	console.log("YES");
	console.log(` ${e.code}`);
}

function addParticle(part) {
	particles.push(part);
}

function addParticles(n) {
	for (let i = 0; i < n; i++) {
		addParticle(new Particle(Math.random() * 500, Math.random() * 500, Math.random() * 5 + 5));
	}
}

function addEater(part) {
	eater.push(part);
}

function addEaters(n) {
	for (let i = 0; i < n; i++) {
		addEater(new ParticleEater(trailCanvas.width / 2, trailCanvas.height / 2, 10, trailCanvas.width / (4 + eater.length)));
	}
}

function updateMouse(e) {
	mousePos.set(e.pageX, e.pageY);
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
	for (var e of eater) {
		//si une particule touche notre glouton
		if (p.hit(e)) {
			//on l'enlève du tableau
			particles.splice(particles.indexOf(p), 1);
		}
	}
}

function moveEater(e) {
	e.addForce(mousePos.subtract(e.pos).divide(300 * e.size));
	e.updatePos();
}

//affichage des particules et du mangeur de particules :D
function drawParticles() {
	var ctx = trailCanvas.getContext("2d");
	ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
	ctx.fillStyle = "#000000";
	var i = 0;
	for (var p of particles) {
		// ctx.beginPath();
		// ctx.arc(p.pos.x, p.pos.y, 20, 0, 2 * Math.PI);
		// ctx.fill();
		ctx.drawImage(img[(i++)%img.length], p.pos.x, p.pos.y, 30, 30);
	}
	for (var e of eater) {
		//changement d'image pour l'animation du glouton
		animEater++;

		t = Math.floor(animEater / eaterImg.length);
		// if (animEater > eaterImg.length - 1) {
		// 	animEater = 0;
		// 	t++;
		// }
		// if (t > titouTab.length - 1) {
		// 	t = 0;
		// }
		ctx.drawImage(eaterImg[animEater%eaterImg.length], e.pos.x, e.pos.y, e.size, e.size);
		if (titou) {
			ctx.drawImage(titouTab[t%titouTab.length], e.pos.x, e.pos.y, e.size - 50, e.size - 50);
		}
	}
}

function update() {
	for (var p of particles) {
		moveParticles(p);
		updateParticles(p);
	}
	
	for (var e of eater) {
		moveEater(e);
	}
	
	drawParticles();
}