$(function(){
  var currentPage = 1;
  var pageSize = 5;

  render();
  function render(){
    $.ajax({
      type:"get",
      url:'/category/querySecondCategoryPaging',
      data:{
        page:currentPage,
        pageSize:pageSize,
      },
      dataType:"json",
      success:function(info){
        console.log(info);
        var htmlStr = template("secondTmp",info)
        $("tbody").html(htmlStr);


        // 进行分页初始化
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:info.page,
          totalPages:Math.ceil(info.total/info.size),
          onPageClicked:function(event,originalEvent,type,page){
            currentPage = page;
            render();
          }
        });

      }
    })
  }

  // 2.显示二级分类的模态框
  $("#addBtn").click(function(){
    $("#addModal").modal("show");

    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
      data:{
        page:1,
        pageSize:100,
      },
      dataType:"json",
      success:function(info){
        console.log(info);
        var htmlStr = template("dropdownTpl",info)
        $(".dropdown-menu").html(htmlStr);
      }
    })
  })

  // 3.点击模态框中的一级分类 添加到输入框中 获取 a 的文本, 设置给按钮
  $(".dropdown-menu").on("click","a",function(){
    var txt = $(this).text();
    $("#dropdownTxt").text(txt);

    // 获取id的值 赋值给隐藏域 用于传给后台
    var id = $(this).data("id");
    $('[name="categoryId"]').val( id );

    // 选择了一级分类, 需要将一级分类校验状态, 更新成校验成功状态
    // 参数1: 字段名称
    // 参数2: 校验状态, VALID成功, INVALID失败
    // 参数3: 校验规则, 配置错误时的提示信息
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
  })

  // 4.图片的本地预览
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data);
      var picUrl = data.result.picAddr
      $("#imgBox img").attr("src",picUrl);

      $('[name="brandLogo"]').val(picUrl);

      $("#form").data('bootstrapValidator').updateStatus("brandLogo", "VALID")
    }
  });

  // 5.表单校验
  //使用表单校验插件
$("#form").bootstrapValidator({
  //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
  excluded: [],

  //2. 指定校验时的图标显示，默认是bootstrap风格
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },

  //3. 指定校验字段
  fields: {
    //校验用户名，对应name表单的name属性
    categoryId: {
      validators: {
        //不能为空
        notEmpty: {
          message: '请选择一级分类'
        },
      }
    },
    brandName: {
      validators: {
        //不能为空
        notEmpty: {
          message: '请输入二级分类'
        },
      }
    },
    brandLogo: {
      validators: {
        //不能为空
        notEmpty: {
          message: '请选择图片'
        },
      }
    },
  }

  });

  // 6.表单校验成功后 提交后台
  $("#form").on("success.form.bv",function(e){
    e.preventDefault();
    $.ajax({
      type:"post",
      url:"/category/addSecondCategory",
      data:$("#form").serialize(),
      dataType:"json",
      success:function(info){
        if(info.success){
          // 关闭模态框
          $("#addModal").modal("hide")

          // 重新渲染 渲染首页
          currentPage = 1;
          render()
          // 清空模态框的内容
          $('#form').data("bootstrapValidator").resetForm(true);
          $("#dropdownTxt").text("请选择一级分类");
          $("#imgBox img").attr("src", "images/none.png")

        }
      }
    })
  })
})