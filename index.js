window.onload = function() {
	// 获取到轮播容器
	var carouselWrap = document.querySelector('.body-wrap .carousel-wrap');
	// 获取按钮
	var btn = document.querySelectorAll('.body-wrap .carousel-wrap div');
	// 获取图片
	var imgNode = document.querySelector('.body-wrap .carousel-wrap .img-wrap');
	// 获取所有小圆点
	var smallDotNodes = document.querySelectorAll('.body-wrap .carousel-wrap .small-dot li');
	var timeAll = 600; // 切换一张图片的总时间1200ms,注意设置这个值时,最好设置为每张图片宽度的倍数
	var stepTime = 20; // 每一帧的时间为20ms
	// 每一帧走的距离 = 每张图片的宽度(600) / (timeAll/steptime);这个值必须为整数
	var timer = null; // 保存定时器的id
	var isMove = false; // 相当于一个开关,解决定时器叠加问题
	var autoTimer = null; // 保存自动轮播定时器的id
	// 移入轮播容器,按钮出现,自动轮播停止
	carouselWrap.onmouseenter = function() {
		btn[0].style.opacity = 1;
		btn[1].style.opacity = 1;
		clearInterval(autoTimer);

	}
	// 移出轮播容器,按钮消失,自动轮播重新打开
	carouselWrap.onmouseleave = function() {
		btn[0].style.opacity = 0;
		btn[1].style.opacity = 0;
		autoRun();
	}

	// 封装自动轮播函数
	autoRun();
	function autoRun() {
		autoTimer = setInterval(function() {
			// 自动轮播的逻辑与点击右侧按钮一致
			move(true);
		}, 2000)
	}

	// 下面三行代码,当打开页面和离开时,自动轮播正常播放
	// 就是要保证自动轮播定时器和dom渲染同步
	document.onvisibilitychange = function() {
		// 离开当前窗口
		if (document.hidden) {
			clearInterval(autoTimer);
		} else { // 再次进入窗口
			autoRun();
		}
	}

	// 点击右侧按钮事件
	btn[1].onclick = function() {
		move(true);
	}

	// 点击左侧按钮事件
	btn[0].onclick = function() {
		move(false);
	}

	// 点击小圆点事件,最主要是距离差不一样;求得就是点击小圆点对应显示图片的最终位置
	// 循环添加点击事件
	for (var i = 0; i < smallDotNodes.length; i++) {
		smallDotNodes[i].index = i; //保存小圆点的下标
		smallDotNodes[i].onclick = function() {
			// 点击小圆点切换图片逻辑,刚好与点击按钮小圆点变色相反
			// 求点击小圆点对应显示图片的下标;
			// 图片的下标=小圆点的下标+1
			// 求小圆点的下标,必须先保存小圆点的下标
			// 根据图片的下标,求出显示图片的最终位置lastX
			// lastX = (this.index + 1) * -600;
			move((this.index + 1) * -600);
		}
	}


	// 点击两侧的按钮所执行的代码基本一致,所以我们封装一个函数
	function move(flag) {
		// 根据isMove的真假状态,判定是第几次点,一次点击完成切换图片后,要重置
		if (isMove) {
			// 进入则证明点击的是第二次,直接return,不执行下面的代码
			return;
		}
		// 第一次点击的时候
		isMove = true;
		// 判断flag值得类型,确定点击的是什么
		if (typeof flag === 'boolean') {
			// 证明是点击按钮,距离差是固定值 600 或 -600;
			// 判断是点击右侧按钮,还是点击左侧按钮
			if (flag) {
				// 进入则证明是点击右侧按钮,
				var disX = -600;
			} else {
				// 进去则证明是点击左侧按钮
				var disX = 600;
			}
		} else {
			// 则证明点击的是小圆点,距离差是动态的
			var disX = flag - imgNode.offsetLeft;
		}

		// 获取到图片的初始位置
		var startX = imgNode.offsetLeft;
		// 图片的最终位置
		var lastX = startX + disX;
		// 如果点击一次,直接设置给imgNode,会发生瞬变,没有过度效果
		// imgNode.style.left = lastX + 'px';
		// 求出每一步的距离,然后设置定时器
		var stepDis = disX / (timeAll / stepTime);
		timer = setInterval(function() {
			// 每走一帧的位置 = 图片的动态初始位置 + 每走一步的距离
			var left = imgNode.offsetLeft + stepDis;
			// 判断left值,如果刚好切换一张图片,清除定时器
			if (left === lastX) {
				clearInterval(timer);
				// 清除定时器的这一瞬间,刚好完成了点一次切换图片,所以重置开关状态
				isMove = false;
				// 刚清除定时器的这一瞬间,添加无缝逻辑按钮
				if (left === -3600) {
					left = -600;
				} else if (left === 0) {
					left = -3000;
				}
			}

			imgNode.style.left = left + 'px';
		}, stepTime)

		// 点击按钮,小圆点变色,排它先让所有的小圆点变灰色,循环设置
		for (var i = 0; i < smallDotNodes.length; i++) {
			smallDotNodes[i].className = '';
		}
		// 点击按钮,让对应小圆点的变色;
		// 求对应小圆点的下标 = 图片下标 -1;
		// 图片下标 = lastx / -600;
		var index = (lastX / -600) - 1;
		// 多加的两张图片为下标0和6,所以要判断
		if (index > 4) {
			index = 0;
		} else if (index < 0) {
			index = 4;
		}
		smallDotNodes[index].className = 'current';

	}
}
