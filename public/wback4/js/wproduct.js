$(function(){
  // 1 请求分页的数据 进行展示
  var currentPage = 1;
  var pageSize = 2;

  render();
  function render(){
    $.ajax({
      type:"get",
      url:"/product/queryProductDetailList",
      data:{
        page:currentPage,
        pageSize:pageSize,
      },
      dataType:"json",
      success:function(info){
        console.log(info);
        var htmlStr = template("productTmp",info)
        $("tbody").html(htmlStr);


        // 分页初始化
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage:info.page,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          // size:"small",//设置控件的大小，mini, small, normal,large
          onPageClicked:function(event, originalEvent, type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          },

          // 控制按钮显示的文字
          // itemTexts 是一个函数, 每个按钮在初始化的时候, 都会调用该函数
          // 将该函数的返回值, 作为按钮的文本
          // type: 按钮的类型, page, first, last, prev, next
          // page: 表示点击按钮跳转的页码
          // current: 当前页
          itemTexts:function(type, page, current){
            switch(type){
              case "page":
                return page;
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "first":
                return "首页";
              case "last":
                return "尾页";
            }
          },

          // 每个按钮在初始化的时候, 都会调用一次该函数
          // 将该函数的返回值, 作为按钮的 title 提示文本
          tooltipTitles:function(type, page, current){
            switch(type){
              case "page":
                return "前往第"+page+"页";
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
            }
          },
          useBootstrapTooltip: true
        });

      }
    })
  }

  // 2.点击添加商品按钮 弹出模态框 并渲染所有二级分类
  $("#addBtn").click(function(){
    $("#addModal").modal("show");

    $.ajax({
      type:"get",
      url:"/category/querySecondCategoryPaging",
      data:{
        page:1,
        pageSize:100
      },
      dataType:"json",
      success:function(info){
        var htmlStr = template("dropdownTmp",info)
        $(".dropdown-menu").html(htmlStr);
      }
    })
  })

  // 3.选择二级分类的时候 把内容填充到输入框中 把id的值存入到隐藏域中
  $(".dropdown-menu").on("click","a",function(){
    var txt = $(this).text();
    $("#dropdownTxt").text(txt);

    // 获取 id, 设置给隐藏域
    var id = $(this).data("id");
    $('[name="brandId"]').val(id);

    // 手动将 name="brandId" 的input, 校验状态置成 VALID
    $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
  })

  // 4.图片本地预览
  var picArr = [];  // 维护所有用于提交的图片
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data.result);
      picArr.unshift(data.result);

      // 图片地址
      var picUrl = data.result.picAddr;
      $("#imgBox").prepend('<img src="'+picUrl+'" alt="" style="height: 100px;width: 100px;">')

      if ( picArr.length > 3 ) {
        // 找imgBox中最后一个img类型的元素, 让其自杀
        $('#imgBox img:last-of-type').remove();
        // 数组移除最后一项
        picArr.pop();
      }

      if(picArr.length == 3){
        $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
      }
    }
  });

  // 5.校验表单
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
    brandId: {
      validators: {
        //不能为空
        notEmpty: {
          message: '请选择二级分类'
        },
      }
    },
    proName: {
      validators: {
        //不能为空
        notEmpty: {
          message: '请输入商品名称'
        },
      }
    },
    proDesc: {
      validators: {
        notEmpty: {
          message: "请输入商品描述"
        }
      }
    },
    num: {
      validators: {
        notEmpty: {
          message: "请输入商品库存"
        },
        // 正则校验
        regexp: {
          regexp: /^[1-9]\d*$/,
          message: '商品库存必须是非零开头的数字'
        }
      }
    },
     // 要求尺码非空, 要求尺码格式 xx-xx,  x为数字
     size: {
      validators: {
        notEmpty: {
          message: "请输入商品库存"
        },
        // 正则校验
        regexp: {
          regexp: /^\d{2}-\d{2}$/,
          message: '要求尺码为 xx-xx 的格式, 例如 32-40'
        }
      }
    },
    price: {
      validators: {
        notEmpty: {
          message: "请输入商品现价"
        }
      }
    },
    oldPrice: {
      validators: {
        notEmpty: {
          message: "请输入商品原价"
        }
      }
    },
    // 用于标记当前图片是否上传满三张
    picStatus: {
      validators: {
        notEmpty: {
          message: "请上传三张图片"
        }
      }
    }
  }

});

  // 6 表单校验成功之后 提交表单
  $("#form").on("success.form.bv",function(e){
    e.preventDefault();

    var paramsStr = $("#form").serialize();
    paramsStr += "&picName1="+ picArr[0].picName +"&picAddr1=" + picArr[0].picAddr;
    paramsStr += "&picName2="+ picArr[1].picName +"&picAddr2=" + picArr[1].picAddr;
    paramsStr += "&picName3="+ picArr[2].picName +"&picAddr3=" + picArr[2].picAddr;
    $.ajax({
      type:"post",
      url:"/product/addProduct",
      data:paramsStr,
      dataType:"json",
      success:function(info){
        if(info.success){
          //关闭模态框
          $("#addModal").modal("hide");
          // 清空模态框的内容
          $("#form").data('bootstrapValidator').resetForm(true);
          $("#dropdownTxt").text("请选择二级分类");
          // 移除所有的图片
          $('#imgBox img').remove();
          picArr = []; // 同步数组
          //重新渲染

          currentPage = 1;
          render();
        }
      }
    })
  })
})