var Asteroid = (function()
{
	//exposed methods:

	var create = function()
	{
		var obj = Object.create(def);
		obj.radius = 40;
		obj.color = '#FFF';
		obj.pos = Vec2D.create(0, 0);
		obj.vel = Vec2D.create(0, 0);
		obj.blacklisted = false;
		obj.type = 'b';

		return obj;
	};

	//Ship definition:

	var def =
	{
		radius: null,
		color: null,
		pos: null,
		vel: null,
		blacklisted: null,
		type: null,

		update: function()
		{
			this.pos.add(this.vel);
		},

		reset: function()
		{
			this.blacklisted = false;
		}
	};

	return {create:create};
}());