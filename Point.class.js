class Point {
	/*
	* all keys of params arg
	* @params gravityX [double] x轴的重力加速度,像素每2次方单位时间
	* @params gravityY [double] y轴的重力加速度,像素每2次方单位时间
	* @params fricationX [double] x轴的摩擦系数,系数越大,速度减少越快
	* @params fricationY [double] y轴的摩擦系数,系数越大,速度减少越快
	* @params directionX [int] x轴运动方向,正向(向右)为1
	* @params directionY [int] y轴运动方向,正向(向上)为-1
	* @params elasticX [double] x轴碰撞的弹性系数, 1代表完全反弹,默认完全反弹
	* @params elasticY [double] y轴碰撞的弹性系数, 0代表完全无反弹
	* @params speedX [double] x轴初始方向速度
	* @params speedY [double] y轴方向初始速度
	* @params startX [double] 物体起始存在的x轴点坐标
	* @params startY [double] 物体起始存在的y轴点坐标
	* @params endX [double] x轴的碰撞点(转向点)
	* @params endY [double] y轴的碰撞点(转向点)
	* @params nolinearX [boolean] x轴摩擦系数非线性
	* @params nolinearY [boolean] y轴摩擦系数非线性
	*/
	constructor (arg) {
		this.initProps(arg);		// 初始化各种属性值
	}

	initProps (arg) {
		var {
			gravityX = 0, gravityY = 0,
			fricationX = 0, fricationY = 0,
			directionX = 1, directionY = 1,
			speedX = 0, 	speedY = 0,
			startX = 0,		startY = 0,
			endX = 0,		endY = 0,
			elasticX = 1,	elasticY = 1,
			nolinearX = true, nolinearY = true
		} = {...arg};

		this.setValue('gravityX', gravityX), 		this.setValue('gravityY', gravityY);
		this.setValue('fricationX', fricationX), 	this.setValue('fricationY', fricationY);
		this.setValue('directionX', directionX), 	this.setValue('directionY', directionY);
		this.setValue('speedX', speedX), 			this.setValue('speedY', speedY);
		this.setValue('startX', startX), 			this.setValue('startY', startY);
		this.setValue('endX', endX), 				this.setValue('endY', endY);
		this.setValue('elasticX', elasticX), 		this.setValue('elasticY', elasticY);
		this.setValue('nolinearX', nolinearX), 		this.setValue('nolinearY', nolinearY);
		this.setPosition(startX, startY);
	}

	/*
	* 设置当前点的位置
	* @params x [int] x坐标
	* @params y [int] y坐标
	*/
	setPosition (x, y) {
		this.setValue('x', x);
		this.setValue('y', y);
	}

	setValue (key, value) {
		var result = this._checkValue(key, value);
		if (result.result) {
			switch (key) {	// 特殊处理
				case 'speedY':
				case 'speedX': 	// 私有属性存储
					this['_' + key] = result.value;
					this[key] = result.value;
					break;
				default:
					this[key] = result.value;
					break;
			}
			return;
		} else {
			switch (result.errorCode) {
				case 101:
					throw new Error(key + ' is not have be incloud by class ' + Point.name);
					break;
				case 201:
					throw new Error('the key ' + key + ' except to be ' + result.except + ' , but got ' + typeof result.value + '(' + result.value + ')');
					break;
				default:
					break;
			}
		}
		
	}

	/*
	* 设置当前运动方向
	*/
	setDirection (x, y) {
		this.setValue('directionX', this.directionX * x);
		this.setValue('directionY', this.directionY * y);
	}

	/*
	* @return [bool] 当前值是否允许设置
	*/
	_checkValue (key, value) {
		var uitl = this._publicUtil();
		// int 值的保存数组
		var numberArr = [
			'gravityX', 'gravityY', 
			'directionX', 'directionY', 
			'speedX', 'speedY',
			'startX', 'startY',
			'endX', 'endY',
			'x', 'y'
		];


		// 0-1的浮点型数据
		var zeroToOne = [
			'fricationX', 'fricationY', 
			'elasticX',	'elasticY'
		];

		var booleanArr = [
			'nolinearX', 'nolinearY'
		]

		/*
		* description errorCode
		* 101 当前属性不存在
		* 200 ok
		* 201 当前属性设置类型错误
		*/
		var result = {
			result: false,
			except: null,
			type: typeof value,
			errorCode: 200 
		}

		result.value = value;
		if (numberArr.indexOf(key) > -1) {		// 当前传入值是数字
			result.result = uitl.isNumber(value);
			result.except = 'number';
			result.errorCode = 201;

		} else if (booleanArr.indexOf(key) > -1) {	// 传入的是bool值
			result.result = uitl.isBoolean(value);
			result.except = 'bool';
			result.errorCode = 201

		} else if (zeroToOne.indexOf(key) > -1) {
			result.result = uitl.isNumber(value) && value >= 0 && value <= 1;
			result.except = 'number(0 ~ 1)';

			result.errorCode = 201
		} else {
			result.errorCode = 101;
		}

		return result;
	}
	/*
	* 物体改变运动状态
	* @params frame [int] 帧率,每秒刷新多少次,帧率越大，每个单位时间的刷新位移越小,物体运动越平滑
	* @params callback [function] 每次运动后的回调函数
	*/
	movement (frame, callback) {
		var _this = this;
		(frame == frame - 0) && (frame = Math.abs(frame)) || (frame = 1);	// 非0，非负数字
		if (frame >= 10) {
			frame = Math.ceil(frame / 10) * 10;	// 10的整数倍,减少误差
		} else {
			frame = 1;	// 小于10的一律当作1处理
		}
 	
		this.delta = 1 / frame; 	// 每帧耗时,单位秒
		this._changePosition('x');
		this._changePosition('y');


		// 抛出必要信息, 位置,速度,指向,加速度,摩擦系数,结束位置
		var callbackKeyArr = [
			'gravityX', 'gravityY', 
			'fricationX', 'fricationY', 
			'directionX', 'directionY', 
			'speedX', 'speedY',
			'startX', 'startY',
			'elasticX',	'elasticY',
			'endX', 'endY',
			'x', 'y'
		];
		var callbackObj = {};
		for (var i = 0, len = callbackKeyArr.length; i < len; i++) {
			callbackObj[callbackKeyArr[i]] = _this[callbackKeyArr[i]];
		}
		callback && callback(callbackObj);
	}

	/*
	* 轴方向上的物体运动
	*/
	_changePosition (axis) {
		axis = axis.toLowerCase();	// 传入参数不区分大小写
		var upAxis = axis.toUpperCase();
		var _this = this;
		var t = this.delta,						// 单位时间
			direction = this['direction' + upAxis],		// 当前运动方向
			gravity = this['gravity' + upAxis] * direction,		// 加速度	
			end = this['end' + upAxis],				// 终点
			speed = this['speed' + upAxis],			// 速度
			_speed = this['_speed' + upAxis],			// 速度存量
			elastic = this['elastic' + upAxis],	// 弹性碰撞损耗
			nolinear = this['nolinear' + upAxis],		// 非线性
			frication = this['frication' + upAxis];	// 单位时间的摩擦系数

		var currentDistance = speed * t + 1 / 2 * gravity * t * t ;	// 当前这一个单位时间内，运动的距离
		var currentDistanceAbs = currentDistance;		// 存一下绝对值
		var recentDistance = Math.abs(_this[axis] - end);		// 本次位移距离终点实际的距离值

		if (currentDistance < 0) {
			currentDistance = recentDistance;
		}
		
		currentDistance *= direction;

		var recentDuring = 0;	// 当前实际运动的时间,保留8位有效数字
		if (currentDistanceAbs >= recentDistance) {	// 碰撞,一旦发生碰撞当前点的位置就定了
			var sqrt4ac = Math.sqrt(speed * speed + 2 * gravity * recentDistance);	// sqrt(b^2 - 4ac)
			
			_this[axis] = end;
			if (gravity == 0) {	// 匀速运动
				recentDuring = (recentDistance / speed);
			} else {
				var t1 = (-1 * speed + sqrt4ac);
				var t2 = (-1 * speed - sqrt4ac);
				recentDuring = Math.max(t1, t2);	
				// 碰撞时的实际速度,这里不用乘以加速度,因为已经约分掉了
				speed += recentDuring;	
				// 因为计算结果是无限小数,所以会有精度损失,保留12有效数字，减少误差
				speed.toFixed(12);	// 保留12位有效小数
			}

			speed = getSpeed(speed, recentDuring / t);
			speed -= speed * (1 - elastic);
		} else {		// 当前没碰撞
			var vDelta = gravity * t;	// 本次速度变化值

			if (gravity == 0) {	// 匀速运动
				_this[axis] += currentDistance;
			} else {
				if (speed + vDelta <= 0) {	// 速度在这里是标量，速度的方向已经由dircection确定
					recentDuring = speed / gravity;	// 当前实际运动时间
					
					_this[axis] += speed / 2 * recentDuring;
					speed = 0;
				} else {
					_this[axis] += currentDistance;
					speed += vDelta;
				}
			}
			
			speed = getSpeed(speed, t);
		}
		
		if (speed < 0.01) {	// 当物体的速度趋近与0,我们认为物体静止了
			speed = 0;	// 静止
		}

		_this['speed' + upAxis] = speed;	// 保存数据
		return;
		/*
		* @params speed [double] 当前的速度
		* @params time [double] 当前运动的单位时间
		*/
		function getSpeed (speed, time) {
			if (nolinear) {
				speed *= 1 - frication * t;
			} else {
				// 这里的摩擦力只取标量
				speed -= frication * (_speed + Math.abs(gravity)) * t;
			}
			return speed;
		}
	}

	/*
	* 工具函数
	*/
	_publicUtil () {
		function isNumber (val) {
			return String(val) - 0 == val;
		}

		function isBoolean (val) {
			if (val == 'false' || val == 'undefined') {
				return false;
			} else {
				return typeof val == 'boolean';
			}
		}
		return {
			isNumber,
			isBoolean
		}
	}
}