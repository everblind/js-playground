//common vars

var canvas;
var context;
var screenWidth;
var screenHeight;
var doublePI = Math.PI * 2;

//game vars

var ship;

var particlePool;
var particles;

var bulletPool;
var bullets;

var asteroidPool;
var asteroids;

var hScan;

//keyboard vars

var keyLeft = false;
var keyUp = false;
var keyRight = false;
var keyDown = false;
var keySpace = false;

window.getAnimationFrame =
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback)
{
	window.setTimeout(callback, 16.6);
};

window.onload = function()
{
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');

	window.onresize();

	keyboardInit();
	particleInit();
	bulletInit();
	asteroidInit();
	shipInit();

	loop();
};

window.onresize = function()
{
	if(!canvas) return;

	screenWidth = canvas.clientWidth;
	screenHeight = canvas.clientHeight;

	canvas.width = screenWidth;
	canvas.height = screenHeight;

	hScan = (screenHeight / 4) >> 0;
};

function keyboardInit()
{
	window.onkeydown = function(e)
	{
		switch(e.keyCode)
		{
			//key A or LEFT
			case 65:
			case 37:

			keyLeft = true;

			break;

			//key W or UP
			case 87:
			case 38:

			keyUp = true;

			break;

			//key D or RIGHT
			case 68:
			case 39:

			keyRight = true;

			break;

			//key S or DOWN
			case 83:
			case 40:

			keyDown = true;

			break;

			//key Space
			case 32:

			keySpace = true;

			break;
		}
	};

	window.onkeyup = function(e)
	{
		switch(e.keyCode)
		{
			//key A or LEFT
			case 65:
			case 37:

			keyLeft = false;

			break;

			//key W or UP
			case 87:
			case 38:

			keyUp = false;

			break;

			//key D or RIGHT
			case 68:
			case 39:

			keyRight = false;

			break;

			//key S or DOWN
			case 83:
			case 40:

			keyDown = false;

			break;

			//key Space
			case 32:

			keySpace = false;

			break;
		}
	};
}

function particleInit()
{
	particlePool = Pool.create(Particle, 100);
	particles = [];
}

function bulletInit()
{
	bulletPool = Pool.create(Bullet, 40);
	bullets = [];
}

function asteroidInit()
{
	asteroidPool = Pool.create(Asteroid, 30);
	asteroids = [];
}

function shipInit()
{
	ship = Ship.create(screenWidth >> 1, screenHeight >> 1, this);
}

function loop()
{
	updateShip();
	updateParticles();
	updateBullets();
	updateAsteroids();
	render();

	getAnimationFrame(loop);
}

function updateShip()
{
	ship.update();

	if(keySpace) ship.shoot();
	if(keyLeft) ship.angle -= 0.1;
	if(keyRight) ship.angle += 0.1;

	if(keyUp)
	{
		ship.thrust.setLength(0.1);
		ship.thrust.setAngle(ship.angle);

		generateThrustParticle();
	}
	else
	{
		ship.vel.mul(0.94);
		ship.thrust.setLength(0);
	}

	if(ship.pos.getX() > screenWidth) ship.pos.setX(0);
	else if(ship.pos.getX() < 0) ship.pos.setX(screenWidth);

	if(ship.pos.getY() > screenHeight) ship.pos.setY(0);
	else if(ship.pos.getY() < 0) ship.pos.setY(screenHeight);
}

function generateThrustParticle()
{
	var p = particlePool.getElement();

	//if the particle pool doesn't have more elements, will return 'null'.

	if(!p) return;

	p.radius = Math.random() * 3 + 2;
	p.lifeSpan = 80;
	p.pos.setXY(ship.pos.getX() + Math.cos(ship.angle) * -14, ship.pos.getY() + Math.sin(ship.angle) * -14);
	p.vel.setLength(8 / p.radius);
	p.vel.setAngle(ship.angle + (1 - Math.random() * 2) * (Math.PI / 18));
	p.vel.mul(-1);

	//particles[particles.length] = p; same as: particles.push(p);

	particles[particles.length] = p;
}

function updateParticles()
{
	var i = particles.length - 1;

	for(i; i > -1; --i)
	{
		var p = particles[i];

		if(p.blacklisted)
		{
			p.reset();

			particles.splice(particles.indexOf(p), 1);
			particlePool.disposeElement(p);

			continue;
		}

		p.update();
	}
}

function updateBullets()
{
	var i = bullets.length - 1;

	for(i; i > -1; --i)
	{
		var b = bullets[i];

		if(b.blacklisted)
		{
			b.reset();

			bullets.splice(bullets.indexOf(b), 1);
			bulletPool.disposeElement(b);

			continue;
		}

		b.update();

		if(b.pos.getX() > screenWidth) b.blacklisted = true;
		else if(b.pos.getX() < 0) b.blacklisted = true;

		if(b.pos.getY() > screenHeight) b.blacklisted = true;
		else if(b.pos.getY() < 0) b.blacklisted = true;
	}
}

function updateAsteroids()
{
	var i = asteroids.length - 1;

	for(i; i > -1; --i)
	{
		var a = asteroids[i];

		if(a.blacklisted)
		{
			a.reset();

			asteroids.splice(asteroids.indexOf(a), 1);
			asteroidPool.disposeElement(a);

			continue;
		}

		a.update();

		if(a.pos.getX() > screenWidth + a.radius) a.pos.setX(-a.radius);
		else if(a.pos.getX() < -a.radius) a.pos.setX(screenWidth + a.radius);

		if(a.pos.getY() > screenHeight + a.radius) a.pos.setY(-a.radius);
		else if(a.pos.getY() < -a.radius) a.pos.setY(screenHeight + a.radius);
	}

	if(asteroids.length < 5)
	{
		generateAsteroid();
	}
}

function generateAsteroid()
{
	console.log('asteroid created!');

	var a = asteroidPool.getElement();

	//if the bullet pool doesn't have more elements, will return 'null'.

	if(!a) return;

	a.radius = 60;
	a.pos.setXY(screenWidth * Math.random(), screenHeight * Math.random());
	a.vel.setLength(1);
	a.vel.setAngle(Math.random() * (Math.PI * 2));

	//bullets[bullets.length] = b; same as: bullets.push(b);

	asteroids[asteroids.length] = a;
}

function render()
{
	context.fillStyle = '#262626';
	context.globalAlpha = 0.4;
	context.fillRect(0, 0, screenWidth, screenHeight);
	context.globalAlpha = 1;

	renderShip();
	renderParticles();
	renderBullets();
	renderAsteroids();
	renderScanlines();
}

function renderShip()
{
	context.save();
	context.translate(ship.pos.getX() >> 0, ship.pos.getY() >> 0);
	context.rotate(ship.angle);

	context.strokeStyle = '#FFF';
	context.lineWidth = (Math.random() > 0.9) ? 2 : 1;
	context.beginPath();
	context.moveTo(10, 0);
	context.lineTo(-10, -10);
	context.lineTo(-10, 10);
	context.lineTo(10, 0);
	context.stroke();
	context.closePath();

	context.restore();
}

function renderParticles()
{
	//inverse for loop = more performance.

	var i = particles.length - 1;

	for(i; i > -1; --i)
	{
		var p = particles[i];

		context.beginPath();
		context.strokeStyle = p.color;
		context.arc(p.pos.getX() >> 0, p.pos.getY() >> 0, p.radius, 0, doublePI);
		if(Math.random() > 0.4) context.stroke();
		context.closePath();
	}
}

function renderBullets()
{
	//inverse for loop = more performance.

	var i = bullets.length - 1;

	for(i; i > -1; --i)
	{
		var b = bullets[i];

		context.beginPath();
		context.strokeStyle = b.color;
		context.arc(b.pos.getX() >> 0, b.pos.getY() >> 0, b.radius, 0, doublePI);
		if(Math.random() > 0.2) context.stroke();
		context.closePath();
	}
}

function renderAsteroids()
{
	//inverse for loop = more performance.

	var i = asteroids.length - 1;

	for(i; i > -1; --i)
	{
		var a = asteroids[i];

		context.beginPath();
		context.strokeStyle = a.color;
		context.arc(a.pos.getX() >> 0, a.pos.getY() >> 0, a.radius, 0, doublePI);
		if(Math.random() > 0.2) context.stroke();
		context.closePath();
	}
}

function renderScanlines()
{
	//inverse for loop = more performance.

	var i = hScan;

	context.globalAlpha = 0.05;
	context.lineWidth = 1;

	for(i; i > -1; --i)
	{
		context.beginPath();
		context.moveTo(0, i * 4);
		context.lineTo(screenWidth, i * 4);
		context.strokeStyle = (Math.random() > 0.0001) ? '#FFF' : '#222';
		context.stroke();
	}

	context.globalAlpha = 1;
}

function generateShot()
{
	var b = bulletPool.getElement();

	//if the bullet pool doesn't have more elements, will return 'null'.

	if(!b) return;

	b.radius = 1;
	b.pos.setXY(ship.pos.getX() + Math.cos(ship.angle) * 14, ship.pos.getY() + Math.sin(ship.angle) * 14);
	b.vel.setLength(8);
	b.vel.setAngle(ship.angle);

	//bullets[bullets.length] = b; same as: bullets.push(b);

	bullets[bullets.length] = b;
}