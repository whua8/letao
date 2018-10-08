$(function () {
 
  $("#form").bootstrapValidator({

    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    fields: {

      username: {
        validators: {

          notEmpty: {
            message: "用户名不能为空"
          },

          stringLength: {
            min: 2,
            max: 6,
            message: "用户名长度必须是2-6位"
          },

          callback: {
            message:"用户名不存在"
          }

        }
      },


      password: {
        validators: {

          notEmpty: {
            message:"密码不能为空"
          },

          stringLength: {
            min:6,
            max:12,
            message:"密码长度必须是6-12位"
          },

          callback: {
            message: "密码错误"
          }

        }
      }

    }
  })
})

$("#form").on("success.form.bv", function(e){
  // 阻止默认的表单提交
  e.preventDefault();

  $.ajax({
    type:"post",
    url:"/employee/employeeLogin",
    data:$("#form").serialize(),
    dataType:"json",
    success:function(info){
      if(info.success){
        // 登录成功 跳转到首页
        location.href = "windex.html"
      }

      if(info.error === 1000){
        // 用户名不存在
        $("#form").data('bootstrapValidator').updateStatus('username', 'INVALID',"callback");
      }

      if(info.error === 1001){
        $("#form").data('bootstrapValidator').updateStatus('password','INVALID',"callback");
      }

    }
  })
})

// 添加重置功能
$("[type=reset]").on("click",function(){
  $("#form").data('bootstrapValidator').resetForm();
})