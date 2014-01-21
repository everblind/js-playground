var Ship = (function()
{
	//exposed methods:

	var create = function(x, y)
	{
		var obj = Object.create(def);
		obj.angle = 0;
		obj.pos = Vec2D.create(x, y);
		obj.vel = Vec2D.create(0, 0);
		obj.thrust = Vec2D.create(0, 0);

		return obj;
	};

	//Ship definition:

	var def =
	{
		angle: null,
		pos: null,
		vel: null,
		thrust: null,

		update: function()
		{
			this.vel.add(this.thrust);
			this.pos.add(this.vel);

			if(this.vel.getLength() > 4) this.vel.setLength(4);
		}
	};

	return {create:create};
}());