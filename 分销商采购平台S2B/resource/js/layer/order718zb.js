//718
$(function(){

//订单信息效果
 $('.odc_tit_detail').on('mouseover',function(){
  $(this).css({
   'textDecoration':'underline'
  ,'color':"#1890ff"
  })
  console.log(1)
 }).on('mouseout',function(){
  $(this).css({
   'textDecoration':'none'
   ,'color':"#333333"
  })

 });

 $(".odc_p_3").on('mouseover',function(){

  $(this).css({
   'textDecoration':'underline'
   ,color:"#1890ff"
  })
 }).on('mouseout',function(){
  $(this).css({
   'textDecoration':'none'
  })
  if($(this).hasClass('f_c_blue')){
   $(this).css({
    color:"#1890ff"
   })
  }else{
   $(this).css({
    color:"#333333"
   })
  }
  //f_c_blue

 })
//list样式
     $('.feiyuOrderList').hover(function(){
      $(this).addClass('list-active')


     },function(){
      $(this).removeClass('list-active')

     })
})
//客服
$(function(){
 $('.messIcon').hover(function(){
  $(this).toggleClass('kefu_red')
 },function(){
  $(this).toggleClass('kefu_red')
 })
})
//price dialog
$(function(){
 $(".odc_p_1 .detailIcon").on("mouseover",function(){
   $(this).parents(".odc_price").find(".pri_dialog").show()
 })
 $(".odc_p_1 .detailIcon").on("mouseout",function(){
  $(this).parents(".odc_price").find(".pri_dialog").hide()
 })
 $(".pri_dialog").on("mouseover",function(){
  $(this).show()
 })
 $(".pri_dialog").on("mouseout",function(){
  $(this).hide()
 })
})
//优惠dialog
$(function(){
 $(".huiIcon").on("mouseover",function(){
  $(this).parents(".odc_price").find(".hui_dialog").show()
 })
 $(".huiIcon").on("mouseout",function(){
  $(this).parents(".odc_price").find(".hui_dialog").hide()
 })
})
//退改 dialog
$(function(){
 $(".odc_t2_tuigai").on("mouseover",function(){
  $(this).parents(".odc_t2_number").find(".tuigai_dialog").show()
 })
 $(".odc_t2_tuigai").on("mouseout",function(){
  $(this).parents(".odc_t2_number").find(".tuigai_dialog").hide()
 })
})
//预定交通
$(function(){
 $(".yudingJT").hover(function(){
  $(this).css({
   color:"#fff",
   backgroundColor:"#d9604a"
  })
 },function(){
  $(this).css({
   color:"#d9604a",
   backgroundColor:"rgba(0,0,0,0)",

  })
 })
})
//失败原因
$(function(){
 $(".fail_reson").hover(function(){
  $(this).parent(".order_fail_reson").children(".order_fail_dialog").show()
 },function(){
  $(this).parent(".order_fail_reson").children(".order_fail_dialog").hide()
 })
})
//bug


$(function(){
 var chrome = $.browser.version
 if(chrome.indexOf("67.0.3396.99")!=-1){
  // chrome table 1px left bug
  $(".od_c_t1").css({"marginLeft":"0px"})
  $(".orderList_header").css({"marginLeft":"0px"})

  $('.feiyuOrderList').hover(function(){
   $(this).addClass('list-active')
 $(this).find(".yudingJT").css({
  "left":"41px"
 })

  },function(){
   $(this).removeClass('list-active')
   $(this).find(".yudingJT").css({
    "left":"40px"
   })
  })
 }
})
