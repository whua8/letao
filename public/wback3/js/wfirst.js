$(function(){
  var currentPage = 1;
  var pageSize = 5;

  render();
  function render(){
    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize,
      },
      dataType:"json",
      success:function(info){
        console.log(info);
        var htmlStr = template("firstTmp",info);
        $("tbody").html(htmlStr);

        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage:info.page,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          onPageClicked:function(event, originalEvent, type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }
        });
        
      }
    })
  }

  // 2.点击添加一级分类 显示模态框
  $("#addBtn").on("click",function(){
    $("#addModal").modal("show");
  })

  // 3.校验一级分类模态框
  //使用表单校验插件
$("#form").bootstrapValidator({

  // 指定校验时的图标显示，默认是bootstrap风格
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },

  // 指定校验字段
  fields: {
    //校验用户名，对应name表单的name属性
    categoryName: {
      validators: {
        //不能为空
        notEmpty: {
          message: '请输入一级分类名称'
        },
      }
    },
  }

});

// 4.校验完成之后 点击添加按钮 完成添加一级分类
$("#form").on("success.form.bv",function(e){
  e.preventDefault();
  
  $.ajax({
    type:"post",
    url:"/category/addTopCategory",
    data:$("#form").serialize(),
    dataType:"json",
    success:function(info){
      if(info.success){
        $("#addModal").modal("hide");

        currentPage = 1;
        render();

        $("#form").data('bootstrapValidator').reset(true);
      }
    }

    
  })
})

})