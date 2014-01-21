var Vec2D = (function()
{
	//exposed methods:

	var create = function(x, y)
	{
		var obj = Object.create(def);
		obj.setXY(x, y);

		return obj;
	};

	//Vec2D definition:

	var def =
	{
		_x: 1,
		_y: 0,

		getX: function()
		{
			return this._x;
		},

		setX: function(value)
		{
			this._x = value;
		},

		getY: function()
		{
			return this._y;
		},

		setY: function(value)
		{
			this._y = value;
		},

		setXY: function(x, y)
		{
			this._x = x;
			this._y = y;
		},

		getLength: function()
		{
			return Math.sqrt(this._x * this._x + this._y * this._y);
		},

		setLength: function(length)
		{
			var angle = this.getAngle();
			this._x = Math.cos(angle) * length;
			this._y = Math.sin(angle) * length;
		},

		getAngle: function()
		{
			return Math.atan2(this._y, this._x);
		},

		setAngle: function(angle)
		{
			var length = this.getLength();
			this._x = Math.cos(angle) * length;
			this._y = Math.sin(angle) * length;
		},

		add: function(vector)
		{
			this._x += vector.getX();
			this._y += vector.getY();
		},

		sub: function(vector)
		{
			this._x -= vector.getX();
			this._y -= vector.getY();
		},

		mul: function(value)
		{
			this._x *= value;
			this._y *= value;
		},

		div: function(value)
		{
			this._x /= value;
			this._y /= value;
		}
	};

	return {create:create};
}());