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
  console.log("haha");
})