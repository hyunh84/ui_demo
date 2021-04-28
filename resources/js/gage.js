/********************************************************************************************
** 나의지키미 - 메인 게이지 스크립트
********************************************************************************************/
var gageGraphFn = function(canvasId, options) {
	var options = options|| {};
	var canvas = document.getElementById(canvasId),
	context = canvas.getContext('2d'),
	canvasW = options.canvasW || 300,
	canvasH = options.canvasH || 300,
	canvasM = options.canvasM || 0,
	lineW = 12,
	innerLine = lineW/2,
	radius = canvasW/2 - (canvasM + innerLine),
	centerPointX = canvasW / 2,
	centerPointY = canvasH / 2,
	pi = Math.PI,
	startRadian = 0.80,
	endRadian = 2.20,
	gradeN = 10,
	increRadian = (endRadian - startRadian) / gradeN,
	tickW = 0.002,
	startAngle = pi * startRadian,
	angleCont = 0,
	endCont = 70,
	gradient = context.createLinearGradient(0, 160, 100, 0),
	gradient2 = context.createLinearGradient(110, 0, 160, 160),
	userGrade = options.userGrade,
	userCont = (endCont / gradeN) * (10 - (userGrade -1)),
	imgGradUri = options.imgGradUri,
	$img = new Image(),
	alpha = 0;
	if(imgGradUri) {$img.src = imgGradUri;}

	console.log(userCont);

	var devicePixelRatio = window.devicePixelRatio || 1,
	backingStoreRatio = context.webkitBackingStorePixelRatio ||
	context.mozBackingStorePixelRatio ||
	context.msBackingStorePixelRatio ||
	context.oBackingStorePixelRatio ||
	context.backingStorePixelRatio || 1,
	ratio = devicePixelRatio / backingStoreRatio;

	var contStyle = {
		bg : {
			lineCap : 'round'
			, strokeStyle : '#eee'
		}
		, tick : {
			lineCap : 'butt'
			, strokeStyle : 'rgba(255, 255, 255, 0.7)'
		}
		, gage : {
			lineCap : 'round'
		}
	}; // 각요소의 스타일

	gradient.addColorStop(0.1, '#fd5858');
	gradient.addColorStop(0.7, '#f6cc4b');
	gradient.addColorStop(1, '#92ce67');

	gradient2.addColorStop(0.1, '#f9cb4a');
	gradient2.addColorStop(0.45, '#5bce7e');
	gradient2.addColorStop(1, '#4fc1db');


	// style의 width, height 지정
	canvas.style.width = canvasW + 'px';
	canvas.style.height = canvasW + 'px';
	// attribute에 ratio 값을 곱한 width, height 지정
	canvas.width = canvasW * ratio;/* canvas의 width값을 수정할 수 있음 */
	canvas.height = canvasH * ratio;/* canvas의 height값을 수정할 수 있음 */
	context.scale(ratio, ratio);

	var  bgDraw = function() {
		context.beginPath();
		context.lineCap = contStyle.bg.lineCap;
		context.strokeStyle = contStyle.bg.strokeStyle;
		context.shadowColor = "rgba(0, 0, 0, 0)";
		context.lineWidth = lineW;
		context.arc(centerPointX, centerPointY, radius, startAngle, pi * endRadian, false);
		context.stroke();
		context.closePath();
	}

	var tickDraw = function() {
		context.lineCap = contStyle.tick.lineCap;
		context.strokeStyle = contStyle.tick.strokeStyle;
		context.lineWidth = lineW;
		for(var i=1; i < 10; i++) {
			var tickPot = startRadian + (increRadian*i);
			context.beginPath();
			context.arc(centerPointX, centerPointY, radius, pi*tickPot, pi*(tickPot + tickW), false);
			context.stroke();
		}
		context.closePath();
	}

	var gageDraw = function() {
		context.lineCap = contStyle.gage.lineCap;
		context.lineWidth = lineW;
		context.shadowColor = "rgba(0, 0, 0, 0)";
		if(angleCont > 35) {
			context.beginPath();
			context.strokeStyle = gradient;
			context.arc(centerPointX, centerPointY, radius, startAngle, pi * (0.02*35 + startRadian), false);
			context.stroke();
			context.beginPath();
			context.strokeStyle = gradient2;
			context.arc(centerPointX, centerPointY, radius, pi * (0.02*35 + startRadian), pi * (0.02*angleCont + startRadian), false);
			context.stroke();
		}else{
			context.beginPath();
			context.strokeStyle = gradient;
			context.arc(centerPointX, centerPointY, radius, startAngle, pi * (0.02*angleCont + startRadian), false);
			context.stroke();
		}


		context.closePath();
	}

	var aniGage = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.globalAlpha = 100;
		bgDraw();
		if (userGrade != 0) {
			gageDraw();
//		tickDraw();
//		gradeInfoTxt();
			drawCircle();
		}

		if(imgGradUri) {
			drawImage();
		}
	}

	var gradeInfoTxt = function() {
		var fontS = 13;
		var handRadius = radius + lineW +5;
		var numberals = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

		context.font = fontS + 'px NanumSquareRound';
		context.fillStyle = '#585858';
		$.each(numberals, function(i, val) {
			var angles = pi * (startRadian + (increRadian*i) +(increRadian/2)) ;
			var numberalWidth = context.measureText(val).width/* measureText() : 캔버스에 그려진 텍스트의 사이지값 반환 */;
			var xPos = canvasW/2 + Math.cos(angles) * (handRadius) - (numberalWidth/2);
			var yPos = canvasH/2 + Math.sin(angles) * (handRadius) + (fontS/2);
			context.beginPath();
			context.fillText(val, xPos, yPos);
		});
		context.closePath();
	}

	var drawCircle = function() {
		var xPos = canvasW/2 + Math.cos(pi * (0.02*angleCont + startRadian)) * radius;
		var yPos = canvasH/2 + Math.sin(pi * (0.02*angleCont + startRadian)) * radius;
		context.beginPath();
		context.lineWidth = 0;
		context.fillStyle = "#fff";
		context.shadowBlur = 10;
		context.shadowColor = "rgba(0, 0, 0, 0.5)";
		context.arc(xPos, yPos, 10, pi*0, pi*2, false);
		context.fill();
		context.closePath();
	}

	var drawImage = function() {
		context.beginPath();
		context.drawImage($img, 155, 55, 79, 38);
		context.closePath();
	}

	function animate() {
		angleCont += 1;
		if(angleCont > userCont) {
			angleCont = 0;
			return;
		}
		aniGage();
		window.requestAnimationFrame(animate);
	}

	animate();
}