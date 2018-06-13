/**
 * Created by zhangjie on 2016/5/3.
 */

$(function() {
  /*选择关键词*/
  $("#ed-choose").on("click", ".ed-choose-li", function(e) {
    //        e.preventDefault();
    var ths = $(this);
    var chebox = ths.children().children();
    var cont = ths.attr("data-cont");
    var view = ths.attr("data-view");
    var id = ths.attr("data-id");
    var edcont = $("#ed-content");
    if (view == "0") {
      var num = edcont.children().length;
      if (num >= 2) {
        alert("您选择的关键词已多余2个");
        return;
      }
      ths.attr("data-view", "1");
      chebox.removeClass("glyphicon-unchecked").addClass("glyphicon-check");
      var txt =
        '<span id="ed-con-li' +
        id +
        '" data-id="' +
        id +
        '">' +
        cont +
        "</span>";
      edcont.append($(txt));
    } else {
      ths.attr("data-view", "0");
      chebox.removeClass("glyphicon-check").addClass("glyphicon-unchecked");
      $("#ed-con-li" + id).remove();
    }
  });

  $("#ed-choose").on("click", ".glyphicon-minus", function(e) {
    e.stopPropagation();
    var ths = $(this);
    var edchos = ths.parent();
    var id = edchos.attr("data-id");

    //删除成功后的操作
    edchos.remove();
    $("#ed-con-li" + id).remove();
  });

  $("#ed-content").on("click", "span", function() {
    var ths = $(this);
    var id = ths.attr("data-id");
    ths.remove();
    $(".ed-choose-li")
      .filter("[data-id=" + id + "]")
      .addClass("here");
  });

  /*自定义添加关键词*/
  $("#addItem").on("click", function() {
    var newKwn = $("#newKwn").val();
    var newKwv = $("#newKwv").val();
    if (newKwv == "" || newKwn == "") {
      alert("请填写必要的词汇");
      return;
    }
    if (getCharLen(newKwn) > 50 || getCharLen(newKwv) > 50) {
      alert("您填写的词汇过多");
      return;
    }

    //添加成功后的操作
    var num = $(".ed-choose-li").length;
    var id = num + 1;
    var cht =
      '<div class="ed-choose-li col-xs-6" data-cont="' +
      newKwn +
      newKwv +
      '" data-view="1" data-id="' +
      id +
      '">';
    cht += '<div class="cbox-line">';
    cht += '<input type="checkbox" checked="checked">' + newKwn + "+" + newKwv;
    cht +=
      '</div><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></div>';
    $("#ed-choose")
      .children()
      .append($(cht));
    var txt =
      '<span id="ed-con-li' +
      id +
      '" data-id="' +
      id +
      '">' +
      newKwn +
      newKwv +
      "</span>";
    $("#ed-content").append($(txt));

    $("#newKwn").prop("value", "");
    $("#newKwv").prop("value", "");
  });

  /*提交选好的关键词*/
  $("#submit").on("click", function() {
    var edcont = $("#ed-content").children();
    var num = edcont.length;
    var name = "";
    if (num == 0) {
      yyAlert("请选择关键词");
      return;
    }

    for (var i = 0; i < num; i++) {
      var kid = $(edcont.get(i)).attr("data-id");
      if (name) name += "," + kid;
      else name += kid;
    }
    console.log(name);
    //        window.location.href='';
  });
  /*返回*/
  $("#goback").on("click", function() {
    var newKwn = $.trim($("#newKwn").val());
    var newKwv = $.trim($("#newKwv").val());
    var edcont = $("#ed-content").children();
    var num = edcont.length;
    if (newKwn != "" || newKwv != "" || num != 0) {
      var conf = confirm("您当前有编辑过的内容，确定要退出吗？");
      if (conf) {
        alert("11");
      }
    }
    alert("11");
  });
});

function getCharLen(char) {
  var leng = 0;
  var len = char.length;
  if (len == 0) return leng;
  for (var i = 0; i < len; i++) {
    var c = char.charCodeAt(i);
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      leng++;
    } else {
      leng += 2;
    }
  }
  return leng;
}
