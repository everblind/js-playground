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

//keyboard vars

var keyLeft = false;
var keyUp = false;
var keyRight = false;
var keyDown = false;

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



			break;
		}
	};
}

function particleInit()
{
	particlePool = Pool.create(Particle, 100);
	particles = [];
}

function shipInit()
{
	ship = Ship.create(screenWidth >> 1, screenHeight >> 1);
}

function loop()
{
	updateShip();
	updateParticles();
	render();

	getAnimationFrame(loop);
}

function updateShip()
{
	ship.update();

	if(keyLeft) ship.angle -= 0.1;
	if(keyRight) ship.angle += 0.1;

	if(keyUp)
	{
		ship.thrust.setAngle(ship.angle);
		ship.thrust.setLength(0.1);

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

	//if the particle pool doesn't have more particles, will return 'null'.

	if(!p) return;

	p.radius = Math.random() * 2 + 1;
	p.color = '#F0EE00';
	p.lifeSpan = 80;
	p.pos.setXY(ship.pos.getX() + Math.cos(ship.angle) * -12, ship.pos.getY() + Math.sin(ship.angle) * -12);
	p.vel.setLength(8 / p.radius);
	p.vel.setAngle(ship.angle + (1 - Math.random() * 2) * (Math.PI / 18));
	p.vel.mul(-1);

	//particles[particles.length] = p; = particles.push(p);

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

function render()
{
	context.fillStyle = '#262626';
	context.globalAlpha = 1;
	context.fillRect(0, 0, screenWidth, screenHeight);
	context.globalAlpha = 1;

	renderShip();
	renderParticles();
}

function renderShip()
{
	context.save();
	context.translate(ship.pos.getX(), ship.pos.getY());
	context.rotate(ship.angle);

	context.strokeStyle = '#FFF';
	context.lineWidth = (Math.random() > 0.9) ? 3 : 2;
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
	//inverse for = more performance.

	var i = particles.length - 1;

	for(i; i > -1; --i)
	{
		var p = particles[i];

		context.beginPath();
		context.fillStyle = p.color;
		context.arc(p.pos.getX(), p.pos.getY(), p.radius, 0, doublePI);
		if(Math.random() > 0.2) context.fill();
		context.closePath();
	}
}