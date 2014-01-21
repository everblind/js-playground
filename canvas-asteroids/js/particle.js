var Particle = (function()
{
	//exposed methods:

	var create = function()
	{
		var obj = Object.create(def);
		obj.radius = 2;
		obj.color = '#F00';
		obj.lifeSpan = 0;
		obj.fric = 0.98;
		obj.pos = Vec2D.create(0, 0);
		obj.vel = Vec2D.create(0, 0);
		obj.blacklisted = false;

		return obj;
	};

	//Ship definition:

	var def =
	{
		radius: null,
		color: null,
		lifeSpan: null,
		fric: null,
		pos: null,
		vel: null,
		blacklisted: null,

		update: function()
		{
			this.pos.add(this.vel);
			this.vel.mul(this.fric);
			this.radius -= 0.025;

			if(this.radius < 0.1) this.radius = 0.1;

			if(this.lifeSpan-- < 0)
			{
				this.blacklisted = true;
			}
		},

		reset: function()
		{
			this.blacklisted = false;
		}
	};

	return {create:create};
}());