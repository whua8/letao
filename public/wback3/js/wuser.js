$(function(){
  var currentPage = 1;
  var pageSize = 5;

  // 声明一个全局变量, 专门用于存储当前需要修改的用户 id
  var currentId;
  var isDelete;


  render()
  function render(){
    $.ajax({
      type:"get",
      url:"/user/queryUser",
      data:{
        page:currentPage,
        pageSize:pageSize,
      },
      dataType:"json",
      success:function(info){
        console.log(info);
        var str = template("tmp",info)
        $("tbody").html(str);


        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage:info.page,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          size:"small",//设置控件的大小，mini, small, normal,large
          onPageClicked:function(a, b, c,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }
        });
      }
    })

  }

  // 2.点击显示启用禁用模态框
  $("tbody").on("click",".btn",function(){
    $("#userModal").modal("show");

    currentId = $(this).parent().data("id");
    isDelete = $(this).hasClass("btn-danger")? 0 : 1;
  });


  // 3.点击确认按钮 发送ajax请求 修改启用禁用的状态
  $("#submitBtn").on("click",function(){
    $.ajax({
      type:"post",
      url:"/user/updateUser",
      data:{
        id:currentId,
        isDelete:isDelete,
      },
      dataType:"json",
      success:function(info){
        if( info.success ){
          $("#userModal").modal("hide");
          render();
        }
      }
    })
  })
 

})

