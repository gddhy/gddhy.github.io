var wn = 10, hn = 10; 
var $star = [];  //星星元素数列

var star_img_name1 = ["red2.png", "purple2.png", "green2.png", "blue2.png", "yellow2.png"];
var star_img_name2 = ["red1.png", "purple1.png", "green1.png", "blue1.png", "yellow1.png"];
var ST_NONE = -1, ST_RED = 0, ST_PURPLE = 1, ST_GREEN = 2, ST_BLUE = 3, ST_YELLOW = 4;  //星星类型，对应上面的图片名
var starType = [];  //每个位置的星星类型，值取上面

var wipeX = [], wipeY = []; //选择一个星星后与之相连的星星位置
var dx = [1, 0, -1, 0], dy = [0, 1, 0, -1];
var visited = [];  //位置访问标记

var musicNode, bgMusicNode, musicOn, score;  //音频元素, 音效开关, 分数
var canOpera;  //可操作标志

var connectX = [], connectY = [];  //记录连在一起数量最多的星星
var timer;  //提示可消去星星的定时器

var level, score, goalScore;  //关数, 分数, 目标分数

//初始化
$(function(){
	//初始化为二维数组
	for(var i = 0; i < hn; ++ i){
		starType[i] = [];
	}

	//创建星星元素
	var $container = $("#bg-container");
	for(var i = 0; i < hn; ++ i){
		$star[i] = [];
		visited[i] = [];
		for(var j = 0; j < wn; ++ j){
			$star[i][j] = $('<div class="star" data-x=\"' + i + '\" data-y="' + j + '\" ></div>');
			$star[i][j].click(function(){
				return selectDown(this.dataset.x, this.dataset.y);
			});
			$container.append($star[i][j]);
			visited[i][j] = false;
		}
	}

	musicNode = document.getElementById("music");
	bgMusicNode = document.getElementById("bg-music");
	musicSet(true);
	restartGame();
});

//游戏初始化
function gameInit()
{
	for(var i = 0; i < hn; ++ i){
		for(var j = 0; j < wn; ++ j){
			starType[i][j] = parseInt(Math.random()*999999999) % 5;
			showStar(i, j, "normal");
		}
	}
	canOpera = true;
	timer = null;
	startTimer();
}

function restartGame()
{
	score = 0;
	level = 1;
	goalScore = 1000;
	$("#show").text("第" + level + "关").fadeIn();
	$("#show-msg").text("开始游戏吧！");
	$("#show-level").text();
	$("#show-goal").text("第" + level + "关  目标分:" + goalScore);
	$("#show-score").text("分数: " + score);
	/*playMusic("sound/pstar.ogg");*/

	setTimeout(function(){
		$("#show").hide();
		gameInit();
	}, 1000);
}

//进入下一关
function nextLevel()
{
	++ level;
	goalScore += (level == 2 ? 1500 : 2000 + 20*(level-3));
	$("#show").text("第" + level + "关").fadeIn();
	$("#show-goal").text("第" + level + "关  目标分:" + goalScore);

	setTimeout(function(){
		$("#show").hide();
		gameInit();
	}, 1000);
}
 
//游戏结束
function gameOver()
{
	if(score < goalScore){
		canOpera = false;
		$("#show-msg").text("在玩一次吧！");
		$("#show").text("游戏结束！").show();
	}else{
		nextLevel();
	}
}

//显示或隐藏星星
function showStar(x, y, state)
{
	if(starType[x][y] !== -1){
		if(state === "normal"){
			$star[x][y].css("background-image", "url(img/" + star_img_name1[starType[x][y]] + ")");
		}else{
			$star[x][y].css("background-image", "url(img/" + star_img_name2[starType[x][y]] + ")");
		}
	}else{
		$star[x][y].css("background-image", "none");
	}
}

//更新分数显示
function addScore(len)
{
	var s = 5 * len * len;
	$("#show-msg").text("消灭星星" + wipeX.length + "个！");
	$("#show-score").text("分数: " + (score += s));
	$("#show-add").show().text("+" + s).fadeOut();
}


//显示消去提示
function showMaxlength()
{
	clearTimeout(timer);
	timer = null;

	var times = 0;
	(function(){
		if(timer == null && canOpera){
			for(var i = 0, len = connectX.length; i < len; ++ i){
				showStar(connectX[i], connectY[i], times % 2 == 0 ? "selected" : "normal");
			}
			if(++ times < 6){
				setTimeout(arguments.callee, 500);
			}
		}
	})();
}

//启动消去提示
function startTimer()
{
	if(!canOpera){
		return ;
	}
	if(connectX.length > 0){
		for(var i = 0, len = connectX.length; i < len; ++ i){
			showStar(connectX[i], connectY[i], "normal");
		}
	}
	if(timer != null){
		clearTimeout(timer);
	}
	selectMaxConnect();
	timer = setTimeout(showMaxlength, 3000);
}

//玩家点击一个星星
function selectDown(x, y)
{
	if(!canOpera){
		return false;
	}

	x = parseInt(x);
	y = parseInt(y);
	if(starType[x][y] !== ST_NONE){
		selectWipe(x, y);  // 搜索与之相连的星星
		for(var i = 0, len = wipeX.length; i < len; ++ i){
			showStar(wipeX[i], wipeY[i], "selected");
		}

		setTimeout(function(){
			canOpera = false;
			wipeStar();
			canOpera = true;

			if(IsConnect()){
				startTimer();
			}else{
				gameOver();
			}
		}, 150);
	}
	return true;
}

//设置音乐
function musicSet(on)
{
	if(on){
		bgMusicNode.play();
		$("#music-set").text('音乐状态：开');
	}else{
		bgMusicNode.pause();
		$("#music-set").text('音乐状态：关');
	}
	musicOn = on;
}

//设置音效开关
function musicSetChange()
{
	musicSet(!musicOn);
}

//判断是否还有连在一起的星星
function IsConnect()
{
	for(var x = 0; x < hn; ++ x){
		for(var y = 0; y < wn; ++ y){
			if(starType[x][y] !== -1){
				for(var i = 0; i < 2; ++ i){
					var nx = x + dx[i], ny = y + dy[i];
					if(nx >= 0 && nx < hn && ny >= 0 && ny < wn
					&& !visited[nx][ny] && starType[x][y] === starType[nx][ny]){
						return true;
					}
				}
			}
		}
	}
	return false;
}

//选择剩下的星星中连在一起数量最多的
function selectMaxConnect()
{
	connectX.length = connectY.length = 0;
	for(var x = 0; x < hn; ++ x){
		for(var y = 0; y < wn; ++ y){
			if(starType[x][y] !== ST_NONE && !visited[x][y]){
				selectWipe(x, y);
				if(wipeX.length > connectX.length){
					connectX.length = connectY.length = 0;
					connectX = wipeX, connectY = wipeY;
				}
				wipeX = [], wipeY = [];
			}
		}
	}

	//恢复可访问标志
	for(var x = 0; x < hn; ++ x){
		for(var y = 0; y < wn; ++ y){
			if(starType[x][y] !== ST_NONE && visited[x][y]){
				visited[x][y] = false;
			}
		}
	}
}

//消去星星
function wipeStar()
{
	var len = wipeX.length;
	if(len >= 2){
		for(var i = 0; i < len; ++ i){
			starType[wipeX[i]][wipeY[i]] = ST_NONE;
			showStar(wipeX[i], wipeY[i]);
			visited[wipeX[i]][wipeY[i]] = false;  //恢复访问标记
		}

		if(musicOn){
			musicNode.currentTime = 0;
			musicNode.play();
		}

		addScore(len);
		moveStar();
	}
	else{
		for(var i = 0; i < len; ++ i){
			showStar(wipeX[i], wipeY[i], "normal");
			visited[wipeX[i]][wipeY[i]] = false;  //恢复访问标记
		}
	}
	wipeX.length = wipeY.length = 0;  //清空数组
}

//搜索(x, y)位置的星星旁边相同类型的星星
function selectWipe(x, y)
{
	wipeX.push(x);
	wipeY.push(y);
	visited[x][y] = true;

	for(var i = 0; i < 4; ++ i){
		var nx = x + dx[i], ny = y + dy[i];
		if(nx >= 0 && nx < hn && ny >= 0 && ny < wn && !visited[nx][ny] && starType[x][y] === starType[nx][ny]){
			selectWipe(nx, ny);
		}
	}
}

//把y列所有的星星下移
function moverDown(y)
{
	var x1 = hn - 1;
	for(var x2 = x1; x2 >= 0; -- x2){
		if(starType[x2][y] !== ST_NONE){
			starType[x1][y] = starType[x2][y];
			-- x1;
		}
	}
	for(; x1 >= 0; -- x1){
		starType[x1][y] = ST_NONE;
	}
}

//把y列右边所有的星星左移
function moveLeft(y)
{
	var y1 = y;
	for(var y2 = y1; y2 < wn; ++ y2){
		if(starType[hn - 1][y2] !== ST_NONE){
			if(y1 != y2){
				for(var x = 0; x < hn; ++ x){
					starType[x][y1] = starType[x][y2];
				}
			}
			++ y1;
		}
	}
	for(; y1 < wn; ++ y1){
		for(var x = 0; x < wn; ++ x){
			starType[x][y1] = ST_NONE;
		}
	}
}

//移动星星
function moveStar()
{
	var isY = [], leftY = wn;
	for(var i = 0, len = wipeY.length; i < len; ++ i){
		isY[wipeY[i]] = true;
		if(wipeY[i] < leftY){
			leftY = wipeY[i];
		}
	}

	//下移
	for(var y = 0; y < wn; ++ y){
		if(isY[y]){
			moverDown(y);
		}
	}
	//左移
	moveLeft(leftY);

	for(var i = 0; i < hn; ++ i){
		for(var j = 0; j < wn; ++ j){
			showStar(i, j, "normal");
		}
	}
}
