$(document).ready(function () {
    var href = location.href;
    var source = href.split("%")[0].split("=")[1];
    var userGuid = href.split("userGuid=")[1].split("&")[0];
    // 获取用户信息
    var dataStr = localStorage.getItem("GHY_login");
    if (dataStr) {
        var dataUser = JSON.parse(dataStr);
        var userName = dataUser.username;
        $(".uname").append(userName);
        var companyId = dataUser.companyId;
        console.log(companyId)
    } else {
        location.href = 'innerLogin.html?href=' + href
    }
    var sort = '';
    $.post('http://47.94.173.253:8008/Option_AreasAnd.ashx', {
        "type": 44
    }, function (data) {
        var sortArr = [];
        for (var i = 0; i < data.length; i++) {
            sortArr.push(data[i].name)
        }
        $('.sort').selectivity({
            allowClear: true,
            items: sortArr,
            placeholder: '请选择'
        });
        $(".sort").on("change", function (e) {
            sort = e.value;
        });
    });
    // 创建富文本编辑框
    var E = window.wangEditor
    var editor = new E('.editor');
    editor.customConfig.menus = [
		'head', // 标题
		'bold', // 粗体
		'fontSize', // 字号
		'fontName', // 字体
		'italic', // 斜体
		'underline', // 下划线
		'strikeThrough', // 删除线
		'foreColor', // 文字颜色
		'backColor', // 背景颜色
		'link', // 插入链接
		'list', // 列表
		'justify', // 对齐方式
		'quote', // 引用
		'emoticon', // 表情
		'image', // 插入图片
		'table', // 表格
    // 'video',  // 插入视频
		'code', // 插入代码
		'undo', // 撤销
		'redo' // 重复
	]
    // editor.customConfig.uploadImgShowBase64 = true;

    // **************************************自动上传图片开始*********************************
    var dataImg;
    editor.customConfig.customUploadImg = function (files, insert) {
        var iformdata = new FormData();
        var imgU = files[0];
        iformdata.append('image', imgU);
        $.ajax({
            type: 'post',
            url: 'http://47.94.173.253:8008/Articles/CommitImage.ashx',
            data: iformdata,
            cache: false,
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false, // 不设置Content-type请求头
            success: function (data) {
                dataImg = JSON.parse(data)
                var imgSrc = (dataImg.items).substring(25)
                imgUrl = imgSrc
                insert(dataImg.items)
            }
        });
    };
    editor.create();
    // **************************************自动上传图片结束*********************************
    // 发表文章
    $(".sub").on("click", function () {
        if (typeof (imgUrl) == "undefined") {
            var iUrl = " "
        } else {
            iUrl = imgUrl
        };
        var text;
        if (editor.txt.text().length > 1000) {
            text = editor.txt.text().substring(0, 1000);
        }
        $.post('http://47.94.173.253:8008/Articles/Add_Article.ashx', {
            "menuId": 0,
            "userGuid": userGuid,
            "title": $('.title').val(),
            "homeImage": iUrl,
            "label": sort,
            "source": source,
            "companyId": companyId,
            "content": editor.txt.html(),
            "textContent": text
        }, function (data) {
            var data = JSON.parse(data);
            console.log(data)
            if (data.status == 200) {
                layer.msg("发表成功", {
                    time: 1200
                });
                setTimeout(function () {
                    localStorage.setItem("article", "1");
                    location.href = "http://www.eqidd.com/makerSpace/index.html?userGuid=" + userGuid + "&companyId=" + companyId
                }, 1500);

            } else {
                layer.msg(data.msg, {
                    time: 1200
                });
            }
        });
    })

})
