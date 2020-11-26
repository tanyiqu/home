// 出现的提示的li集合
var arr = [];
// 当前被选中的li的序号 没有选中就为0
var currSelectLiNum = 0;
// 当前被选中的li
var currSelectLi = null;

var input = document.getElementById('input');
var sugList = document.getElementById('sugList');
sugList.style.display = 'none';

// 输入改变时
function onInput(event) {
    var txt = event.target.value;
    // 内容清空时，关闭提示框
    if (txt.trim() == '') {
        sugList.style.display = 'none';
        return;
    }
    refreshState();
    var sugurl = "http://suggestion.baidu.com/su?wd=#content#&cb=cb.sug";
    var content = txt;
    if (txt == "") {
        return;
    }
    sugurl = sugurl.replace("#content#", content);
    // 定义回调函数
    cb = {
        sug: function (json) {
            if (json == null) {
                console.log('null')
            }
            arr = json.s;
            // console.log(arr);
            refreshTips();
        }
    }
    var script = document.createElement("script");
    script.src = sugurl;
    // 添加这一段js
    document.getElementsByTagName("head")[0].appendChild(script);
}

function refreshTips() {
    // 如果没有数据
    if (!arr || !arr.length) {
        sugList.style.display = 'none';
        return;
    }
    var len = arr.length;
    //最多显示7条
    if (len > 7) {
        len = 7;
        var arr2 = [];
        for (var i = 0; i < 7; i++) {
            arr2.push(arr[i]);
        }
        arr = arr2;
    }
    var html = '';
    for (var i = 0; i < len; i++) {
        html += '<li class="sug" id="sug' + (i + 1) + '" onclick="onLblClicked(event)">' + arr[i] + '</li>'
    }

    sugList.innerHTML = html;
    console.log(arr);
    sugList.style.display = 'block';
}

function onLblClicked(event) {
    var sug = event.target.innerHTML;
    window.location.href = "https://www.baidu.com/s?wd=" + sug;
}

// 监听点击事件
document.addEventListener("click", function (e) {
    // 如果点击的是input，直接返回，否则点击其他就提示框他消失
    if (e.target == input) {
        return;
    }
    if (e.target !== sugList) {
        sugList.style.display = "none";
    }
});

document.onkeydown = chang_page;
function chang_page(event) {
    // 37 左
    // 38 上
    // 39 右
    // 40 下
    var len = arr.length;
    var code = event.keyCode;
    // 判断提示框是否在显示
    var show = sugList.style.display;
    if (show == 'none') {
        return;
    }

    // 按下了上/下
    if (code == 38 || code == 40) {
        //如果没有被选中
        code = code - 39;
        //上 -1
        //下 1
        // 找到当前被选择的li的编号
        currSelectLiNum += code;
        if (currSelectLiNum == 0 || currSelectLiNum == -1) {
            currSelectLiNum = len;
        }
        if (currSelectLiNum == len + 1) {
            currSelectLiNum = 1;
        }
        // 根据编号，找到这个li
        var id = "sug" + currSelectLiNum;
        currSelectLi = document.getElementById(id);
        // 改变input中显示的内容
        var sugtxt = currSelectLi.innerText;
        input.value = sugtxt;

        // 改变它的背景色
        var list = document.querySelectorAll(".sug")
        for (var i = 0; i < list.length; i++) {
            list[i].style.background = "#fff";
        }
        currSelectLi.style.background = "#ededed";
    }
}

function refreshState() {
    arr = [];
    // isSelected = false;
    currSelectLiNum = 0;
    currSelectLi = null;
}