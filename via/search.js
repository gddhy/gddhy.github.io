var d = new Date()
var time = d.getHours()
if (time < 24) {
document.getElementById("title").innerHTML="Good evening!";
}
if (time < 19) {
document.getElementById("title").innerHTML="Good afternoon!";
}
if (time < 12) {
document.getElementById("title").innerHTML="Good morning!";
}
if (time < 5) {
document.getElementById("title").innerHTML="Go to sleep!";
}
function search(){
	var baiduBtn = document.getElementById('baidu');
	var bingBtn = document.getElementById('bing');
	var googleBtn = document.getElementById('google');
	var csdnBtn = document.getElementById('csdn');
	var type = 'https://www.baidu.com/s?wd=';
	if(baiduBtn.checked == true){
		type = 'https://www.baidu.com/s?wd=';
	}
	if(bingBtn.checked == true){
		type = 'https://cn.bing.com/search?q=';
	}
	if(googleBtn.checked == true){
		type = 'https://www.google.com/search?q=';
	}
	if(csdnBtn.checked == true){
		type = 'https://so.csdn.net/so/search/s.do?q=';
	}
	if(document.getElementById("search_input").value != ""){
		window.location.href = type + encodeURI(document.getElementById("search_input").value);
		document.getElementById("search_input").value = "";
	}return false;
}
function searchboxClick(){
	var baiduBtn = document.getElementById('baidu');
	var bingBtn = document.getElementById('bing');
	var googleBtn = document.getElementById('google');
	var csdnBtn = document.getElementById('csdn');
	var type = 'baidu';
	if(baiduBtn.checked == true){
		type = 'baidu';
	}
	if(bingBtn.checked == true){
		type = 'bing';
	}
	if(googleBtn.checked == true){
		type = 'google';
	}
	if(csdnBtn.checked == true){
		type = 'csdn';
	}
	docCookies.setItem('search',type,Infinity);
	document.getElementById("search_input").setAttribute("placeholder","✎...   " + type + "搜索");
}
window.addEventListener('load',function(){
var baiduBtn = document.getElementById('baidu');
var bingBtn = document.getElementById('bing');
var googleBtn = document.getElementById('google');
var csdnBtn = document.getElementById('csdn');
if(docCookies.hasItem('search')){
	var type = docCookies.getItem('search');
	if(type == null){
		baiduBtn.click();
	} else if (type.indexOf('baidu') != -1){
		baiduBtn.click();
	} else if (type.indexOf('bing') != -1){
		bingBtn.click();
	} else if (type.indexOf('google') != -1){
		googleBtn.click();
	} else if (type.indexOf('csdn') != -1){
		csdn.click();
	}
} else {
	baiduBtn.click();
}
if(!navigator.userAgent.match(/Mobile Safari\//i)) {
var bookBtn = document.getElementById('book');
var hisBtn = document.getElementById('history');
bookBtn.href = 'chrome://bookmarks/';
hisBtn.href = 'chrome://history/';
}
})

fetch('https://v1.hitokoto.cn')
    .then(response => response.json())
    .then(data => {
      const hitokoto = document.getElementById('hitokoto_text')
      hitokoto.href = 'https://hitokoto.cn/?uuid=' + data.uuid
      hitokoto.innerText = data.hitokoto
    })
    .catch(console.error)