// 点击模态框的退出按钮之后 到地址栏输入还是能进入页面,所以对连接进行判断

  $.ajax({
    type:"get",
    url:"/employee/checkRootLogin",
    dataType:"json",
    success:function(info){
      if(info.error === 400) {
        location.href = "wlogin.html";
      }
    }
  })

  // $.ajax({
  //   type: "get",
  //   url: "/employee/checkRootLogin",
  //   dataType: "json",
  //   success: function( info ) {
  //     //console.log( info );
  //     if ( info.error === 400 ) {
  //       // 未登录, 拦截到登陆页
  //       location.href = "login.html";
  //     }
  
  //     if ( info.success ) {
  //       // 已登陆, 让用户继续访问即可
  //       console.log( "当前用户已登陆" );
  //     }
  //   }
  // })
