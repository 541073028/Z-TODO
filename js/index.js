
var swiper = new Swiper('.swiper-container', {
	pagination: {
		el: '.swiper-pagination',
		dynamicBullets: true,
	},
});
// 新增处理
var state="project";
$(".add").click(function(){
	$(".mask").show();
	$(".submit").show();
	$(".update").hide();
	$(".inputarea").transition({y:0},1000);
})
$(".cannel").click(function(){
	// $(".mask").hide();
	$(".inputarea").transition({y:"-62vh"},1000,function(){
		$(".mask").hide();
	})
})
$(".project").click(function(){
	$(this).addClass("active").siblings().removeClass("active")
	state="project";
	render();
})
$(".down").click(function(){
	$(this).addClass("active").siblings().removeClass("active")
	state="down";
	render();

})

var isScroll = new IScroll(".content", {
	mouseWheel: true,
	scrollbars: true,
	shrinkScrollbars:"clip",
	click:true
});

$(".submit").click(function(){
	let val=$("#text").val();
	if(val===""){
		return;
	}
	$("#text").val("");
    let data=getData();
	console.log(data);
    let time=new Date().getTime();
    data.push({content:val,time,star:false,done:false});

    saveData(data);
	render();
	$(".inputarea").transition({y:"-62vh"},1000,function(){
		$(".mask").hide();
	})
})
$(".update").click(function(){
	let val=$("#text").val();
	if(val===""){
		return;
	}
	$("#text").val("");
	let data=getData();
	var index=$(this).data("index");
	data[index].content=val;
	saveData(data);
	render();
	$(".inputarea").transition({y:"-62vh"},1000,function(){
		$(".mask").hide();
	})
})
$(".itemlist")
	.on("click",".changestate",function(){
		var index=$(this).parent().attr("id");
		var data=getData();
		// console.log(index)
		data[index].done=true;
		saveData(data);
		render();
	})
	.on("click",".del",function(){
		var index=$(this).parent().attr("id");
		var data=getData();
		data.splice(index,1)
		saveData(data);
		render();
	})
	.on("click","span",function(){
		var index=$(this).parent().attr("id");
		var data=getData();
		data[index].star=!data[index].star;
		saveData(data);
		render();

	})
	.on("click","p",function(){
		var index=$(this).parent().attr("id");
		var data=getData();
		$(".mask").show();
		$(".inputarea").transition({y:0},500);//向下移动到0
		$("#text").val(data[index].content);//获取p标签内容显示在inputarea
		$(".submit").hide();
		$(".update").show().data("index",index);


	})
function getData(){
	return localStorage.todo?JSON.parse(localStorage.todo):[];
	console.log(localStorage.todo);
}
function saveData(data){
	return localStorage.todo=JSON.stringify(data);
}
function render(){
	let data=getData();
	let str="";
	data.forEach(function(val,index){
		// console.log(index)
		if(state==="project"&& val.done===false){
			str+="<li id="+index+"><p>"+val.content+"</p><time>"+parseTime(val.time)+"</time><span class="+(val.star?"active":"")+">&#xe6ab;</span><div class='changestate'>完成</div></li>"
		}else if(state==="down"&& val.done===true){
			str+="<li id="+index+"><p>"+val.content+"</p><time>"+parseTime(val.time)+"</time><span class="+(val.star?"active":"")+">&#xe6ab;</span><div class='del'>删除</div></li>"
		}

	})
	$(".itemlist").html(str);
	isScroll.refresh();
	addTouchEvent();

}
render();
function parseTime(time){
	var date=new Date();
	date.setTime(time);
	var year=date.getFullYear();
	var month=setZero(date.getMonth()+1);
	var day=setZero(date.getDate());
	var hours=setZero(date.getHours());
	var min=setZero(date.getMinutes());
	var sec=setZero(date.getSeconds());
	return year+"/"+month+"/"+day+"<br>"+hours+":"+min+":"+sec;


}

function  setZero(n){
	return n<10?"0"+n:n;
}
function addTouchEvent(){
	$(".itemlist>li").each(function(index,ele){
		var hammerobj=new Hammer(ele);//hammer.js是一个多点触摸手势库
		let state="start";
		let sx,movex;
		let flag=true;//手指离开需不需要动画
		let max=window.innerWidth/5;
		hammerobj.on("panstart",function(e){
			sx=e.center.x;
			ele.style.transition="none";
		})

		hammerobj.on("panmove",function(e){
			let cx=e.center.x;
			movex=cx-sx;
			if(movex>0&&state==="start"){//开始不能右
				flag=false;
				return;
			}
			if(movex<0&&state==="end"){//结束不能左
				flag=false;
				return;
			}
			if(Math.abs(movex)>max){
				flag=false;
				state=state==="start"?"end":"start";
				if(state==="end"){
					$(ele).css("x","-max")
				}else{
					$(ele).css("x","0")
				}
				return;
			}
			if(state==="end"){

				movex=cx-sx-max;

			}
			flag=true;
			$(ele).css("x",movex)

		})
		hammerobj.on("panend",function(e){
			if(!flag){return;}
			ele.style.transition="all 0.5s";
			if(Math.abs(movex)<max/2){
				$(ele).transition({x:0});
				state=="start"

			}else{
				$(ele).transition({x:-max});
				state=="end"
			}

		})
	})

}