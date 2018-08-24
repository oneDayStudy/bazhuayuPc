console.log("2018-4-5")
console.log($)
//star
//click
//checked
$(function(){
	$(".icon_check1").click(function(){
		$(".icon").toggleClass("icon_checked")
	})
	//日历切换
	$(".calendarCheck span.cTabCheck1").click(function(){

		$(".calendarCheck").removeClass().addClass("calendarCheck").addClass("calendarCheck1")
		$(".calendarCheck span").removeClass("red2")
		$(this).addClass("red2")
		
	})
	$(".calendarCheck span.cTabCheck2").click(function(){

		$(".calendarCheck").removeClass().addClass("calendarCheck").addClass("calendarCheck2")
		$(".calendarCheck span").removeClass("red2")
		$(this).addClass("red2")
	})
	$(".calendarCheck span.cTabCheck3").click(function(){

		$(".calendarCheck").removeClass().addClass("calendarCheck").addClass("calendarCheck3")
		$(".calendarCheck span").removeClass("red2")
		$(this).addClass("red2")
	})
	$(".calendarCheck span.cTabCheck4").click(function(){

		$(".calendarCheck").removeClass().addClass("calendarCheck").addClass("calendarCheck4")
		$(".calendarCheck span").removeClass("red2")
		$(this).addClass("red2")
	})
})
//收藏
//退改须知
//saoma扫码
var colled=0;
$(function(){
	$(".collection").click(function(){
		if(colled==0){
			$(".collection").removeClass("collection").addClass("collected")
			colled=1
		}else{
			$(".collected").removeClass("collected").addClass("collection")
			colled=0
		}
		
	})
	
	$(".tuigai").click(function(){
		$(".tuigai span").toggle()
	})
	
	$(".proInfoCont2 li").mouseenter(function(){
		$(".proInfoCont2 li").removeClass("hover1")
		$(this).addClass("hover1")
	})
	$(".saoma").mouseenter(function(){
		$(".shareBox").css("display","block")
	})
	$(".saoma").mouseleave(function(){
		$(".shareBox").css("display","none")
	})
})

//banner
$(function(){
	var controlTag = 0;
	var i=0;
	var picNum =0;
	
	$(".controlL").click(function(){
		if(controlTag == 0){
			$(".smallImagWrap").removeClass("smallImagWrap_l").addClass("smallImagWrap_r")
			$(".smallImagWrap").animate({
			left:"248px"
			
		},500)
			controlTag = 1;
		}else{
			$(".smallImagWrap").removeClass("smallImagWrap_r").addClass("smallImagWrap_l")
			$(".smallImagWrap").animate({

			left:"346px"
			},500)
			controlTag = 0;
		}
	})
	// $(".controlB").click(function(){console.log(i)
		// if(i<4){
			// i++;
		// }else{
			// i=0
		// }
		// $(".smallImageWrap").animate({
			// marginTop:-66*i+"px"
		// },500)
	// })
	// $(".controlT").click(function(){console.log(i)
		// if(i>0){
			// i--
		// }else{
			// i=4;
		// }
		// $(".smallImageWrap").animate({
			// marginTop:-66*i+"px"
		// },500)
	// })
//	点击切换pic
	
	

})
