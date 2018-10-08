// ajaxStart
// ajaxStop

// ajaxSend
// ajaxComplete
// ajaxSuccess
// ajaxError


$(document).ajaxStart(function(){
  // 第一个开始时调用
  NProgress.start();
  console.log("hehe");
})
$(document).ajaxStop(function(){
  NProgress.done();
  // console.log("haha");
})


$(function(){
  // 点击切换二级导航
  $(".category").on("click",function(){
    $(".child").stop().slideToggle();
  })

  // 点击显示和隐藏侧边栏
  $(".icon_menu").on("click",function(){
    $(".lt_aside").toggleClass("hidemenu");
    $(".lt_topbar").toggleClass("hidemenu");
    $(".lt_main").toggleClass("hidemenu");
  })

  // 点击退出 弹出模态框
  $('.icon_logout').on("click",function(){
    $("#logoutModal").modal();
  })

  $("#logoutBtn").on("click",function(){
    $.ajax({
      type:"get",
      url:"/employee/employeeLogout",
      dataType:"json",
      success:function(info){
        if(info.success){
          location.href = "wlogin.html";
        }
      }
    })

  })
})
