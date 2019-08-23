$(document).ready(() => {
  $(".delete-article").on("click", e => {
    // 定义变量
    var $target = $(e.target);
    // data-id取出的是show.pug中，删除按钮中定义的data-id
    console.log($target.attr("data-id"));
    // 取出要删除的id
    var id = $target.attr("data-id");
    // 发送ajax请求
    $.ajax({
      type: "DELETE",
      url: "/articles/" + id,
      success: () => {
        alert("Deleting Article");
        window.location.href = "/";
      },
      error: err => {
        console.log(err);
      }
    });
  });
});
