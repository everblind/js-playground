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
			//key A
			case 65:

			keyLeft = true;

			break;

			//key W
			case 87:

			keyUp = true;

			break;

			//key D
			case 68:

			keyRight = true;

			break;

			//key S
			case 83:

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
			//key A
			case 65:

			keyLeft = false;

			break;

			//key W
			case 87:

			keyUp = false;

			break;

			//key D
			case 68:

			keyRight = false;

			break;

			//key S
			case 83:

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
	p.color = '#CCC';
	p.lifeSpan = 40;
	p.pos.setXY(ship.pos.getX() + Math.cos(ship.angle) * -10, ship.pos.getY() + Math.sin(ship.angle) * -10);
	p.vel.setLength(6 / p.radius);
	p.vel.setAngle(ship.angle + (1 - Math.random() * 2) * (Math.PI / 12));
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
	context.globalAlpha = 0.4;
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
	context.lineWidth = 2;
	context.beginPath();
	context.moveTo(10, 0);
	context.lineTo(-10, -10);
	context.lineTo(-10, 10);
	context.lineTo(10, 0);
	if(Math.random() < 0.96) context.stroke();
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
		if(Math.random() < 0.6) context.fill();
		context.closePath();
	}
}