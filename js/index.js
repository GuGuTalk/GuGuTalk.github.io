$(document).ready(function () {
    var roleArray;
    var roleImgArray;
    var ExpressionArray;
    var chooseAvatar = '';
    var boxJsonArray = new Array();
    var one;
    var cen = 0;
    var Keys = "GuGuTalk";
    Init();

    $(document).keyup(function (e) {
        if (e.keyCode == 45) {
            chooseAvatar = {
                // roleId: 1,
                // imgId: 2,
                // path: 'http://localhost:8088/wwwroot/Images/mxr_sf.png',
                // name: '米雪儿'
            }
        }
        if (e.keyCode == 36) {
            chooseAvatar = '';
        }
        if (e.ctrlKey && e.which == 13) {
            aside();
        }

    });
    $(".send").click(function () {
        wirte();
    });
    $("#text").keydown(function (event) {
        //var msgInput=$(this).val()
        //兼容Chrome和Firefox
        event = (event) ? event : ((window.event) ? window.event : "");
        var keyCode = event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode);
        if (event.shiftKey && event.keyCode == 13) { //ctrl+enter换行
            $(this).css("height", $(this).css("height") + 24)// 获取textarea数据进行 换行
        } else if (event.ctrlKey && event.keyCode == 13) {
            //发送旁白
            aside();
            event.preventDefault();//禁止回车的默认换行
        } else if (keyCode == 13) { //enter发送
            wirte();
            event.preventDefault();//禁止回车的默认换行
        }
    })
    function wirte() {
        var json = new Object();
        $("#text").css("height", "24px");
        var text = $("#text").val();
        var value;
        json.type = 'txt'
        var avatars = $("img[class*='imgd']");
        if (avatars.length <= 0) {
            value = 9999;
        } else {
            value = chooseAvatar.roleId
        }
        if (text != "") {
            json.index = cen;
            json.content = text;
            if (value == 9999) {
                newTalk = "<div data-index=" + cen + " class='roleOverall rightRoleOverall statistics'><div class='Righthorn'></div><div class='roleRemarkDiv3 roleRemarkDiv' contenteditable='true'><div  class='roleRemarkDivSpan'>" + text + "</div></div></div>";
                json.roleId = 9999;

            } else {
                json.roleId = chooseAvatar.roleId,
                    json.imgId = chooseAvatar.imgId,
                    json.path = chooseAvatar.path,
                    json.name = chooseAvatar.name,
                    json.content = text
                newTalk = "<div data-index=" + cen + " class='roleOverall statistics'><div class='divImg'><img src='" + chooseAvatar.path + "' crossOrigin='anonymous' alt='' class='roleImg' srcset=''></div><div><span class='roleNameSpan'>" + chooseAvatar.name + "</span><div class='roleRemarkDiv'><div class='horn'></div><div class='roleRemarkDiv2 roleRemarkDiv' contenteditable='true' ><div class='roleRemarkDivSpan' >" + text + "</div></div></div></div></div>";
            }

            $("#box").append(newTalk);
            $("#box").children().last('div').on('focusout', function () {
                var ele = $(this);
                updateBoxOne(ele.data('index'), ele.children().last('div').children().last('div').text());
            })
            boxJson(json);
            $("#text").val("");
            ToBtm();
            cen++;
            var text = document.getElementById("text");

            autoTextarea(text);// 调用
            //textHeightRest ()
        }
    }
    //滚动条到最底部
    function ToBtm() {
        getLength();
        var scrollHeight = $('#box').prop("scrollHeight") + 9999
        $('#box').scrollTop(scrollHeight);
    }
    //旁白
    function aside() {
        $("#text").css("height", "24px");
        var text = $("#text").val();
        if (text != "") {
            newTalk = "<div class='pangbaiDiv statistics' contenteditable='true' data-index=" + cen + "><div class='pangbaiSpan'>" + text + "</div></div>";
            var json = new Object();
            json.index = cen;
            json.type = 'aside';
            json.content = text;

            boxJson(json);
            cen++;
            $("#box").append(newTalk);
            $("#box").children().last('div').on('focusout', function () {
                var ele = $(this);
                updateBoxOne(ele.data('index'), ele.children().last('div').text());
            })
            $("#text").val("");
            ToBtm();
            // textHeightRest ()
        }
    }
    //base64转blob
    function dataURItoBlob(base64Data) {
        var byteString;
        if (base64Data.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(base64Data.split(',')[1]);//base64 解码
        else {
            byteString = unescape(base64Data.split(',')[1]);
        }
        var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];//mime类型 -- image/png

        // var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
        // var ia = new Uint8Array(arrayBuffer);//创建视图
        var ia = new Uint8Array(byteString.length);//创建视图
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ia], {
            type: mimeString
        });
        var url = URL.createObjectURL(blob);
        return url;
    }
    //加载未删除数据
    function loadBoxData() {
        boxJsonArray = JSON.parse(localStorage.getItem('boxJson'));
        cen = boxJsonArray.length;
        var html = '';
        var num = 9999;
        boxJsonArray.forEach(item => {
            var newTalk = '';
            switch (item.type) {
                case 'Expression':
                    if (item.roleId == 9999) {
                        newTalk = "<div class='roleOverall rightRoleOverall statistics' data-index=" + item.index + "><img  src='" + item.content + "' alt='' srcset='' class='rightImgExpression udiohsfnds'></div>";
                    } else {
                        newTalk = "<div class='roleOverall statistics' data-index=" + item.index + "><div class='divImg'><img src='" + item.path + "' crossOrigin='anonymous' alt='' class='roleImg' srcset=''></div><div><span class='roleNameSpan'>" + item.name + "</span><div class='roleRemarkDiv'><img  src='" + item.content + "' alt='' srcset='' class='rightImgExpression sioahdnaoi'></div></div></div>";
                    }
                    html = html + newTalk;
                    break;
                case 'img':
                    if (item.roleId == 9999) {
                        newTalk = "<div class='roleOverall rightRoleOverall statistics' data-index=" + item.index + "><div class='Righthorn'></div><img  src='" + dataURItoBlob(item.content) + "' alt='' srcset='' class='rightImg rightImg1'></div>";
                    } else {
                        newTalk = "<div class='roleOverall statistics' data-index=" + item.index + "><div class='divImg'><img src='" + item.path + "' crossOrigin='anonymous' alt='' class='roleImg' srcset=''></div><div><span class='roleNameSpan'>" + item.name + "</span><div class='roleRemarkDiv'><div class='horn'></div><img  src='" + dataURItoBlob(item.content) + "' alt='' srcset='' class='rightImg rightImg2'></div></div></div>";
                    }
                    html = html + newTalk;
                    break;
                case 'txt':
                    if (item.roleId == 9999) {
                        newTalk = "<div class='roleOverall rightRoleOverall statistics'  data-index=" + item.index + "><div class='Righthorn'></div><div class='roleRemarkDiv3 roleRemarkDiv' contenteditable='true' ><div class='roleRemarkDivSpan'>" + item.content + "</div></div></div>";
                    } else {
                        newTalk = "<div class='roleOverall statistics'  data-index=" + item.index + "><div class='divImg'><img src='" + item.path + "' crossOrigin='anonymous' alt='' class='roleImg' srcset=''></div><div><span class='roleNameSpan'>" + item.name + "</span><div class='roleRemarkDiv'><div class='horn'></div><div class='roleRemarkDiv2 roleRemarkDiv' contenteditable='true' ><div class='roleRemarkDivSpan'>" + item.content + "</div></div></div></div></div>";
                    }
                    html = html + newTalk;
                    break;
                case 'aside':
                    newTalk = "<div class='pangbaiDiv statistics' contenteditable='true' data-index=" + item.index + " ><span class='pangbaiSpan'>" + item.content + "</span></div>";
                    html = html + newTalk;
                    break;
            }
        });
        $('#box').html(html);
        var avatars = $("div[class*='statistics']");
        for (let i = 0; i < avatars.length; i++) {
            $(avatars[i]).on('focusout', function () {
                var ele = $(this);
                updateBoxOne(ele.data('index'), ele.children().last('div').children().last('div').text());
            })

        }
        ToBtm();
    }
    //初始化数据
    function Init() {
        $("#knopiji").html('');
        $.getJSON("data/roles.json",
            function (data) {
                data.forEach(item => {
                    item.imgURl = 'images/roleImages/' + item.imgURl + '.png';
                    item.belongsImgURL = 'images/roleImages/' + item.belongsImgURL + '.webp';
                    item.open = false;
                    item.avatarArray = '';
                });
                roleArray = data;
                //循环展示角色
                for (let index = 0; index < roleArray.length; index++) {
                    // $(".center").append("<div class='sonbsc'><div class='xq' data-id='" + roleArray[index].id + "'><img crossOrigin='anonymous' src='" + roleArray[index].imgURl + "' alt='' height=75px; width=75px; class='sdad'></div></div>")
                    $(".center").append("<div class='sonbsc'><div class='xq' data-id='" + roleArray[index].id + "'><div class='wwww'><img crossOrigin='anonymous' src='" + roleArray[index].imgURl + "' alt='' height=75px; width=75px; class='sdad'><span class='roleName'>" + roleArray[index].roleName + "</span></div><img src='" + roleArray[index].belongsImgURL + "' class='ddddddddddd' alt='' srcset=''></div></div>")
                    $(".center").children().eq(index).children().eq(0).click(function () {
                        roleArrayClick(roleArray[index].id, index, this);
                    });
                }
            }
        );
        ExpressionInit();
        getLength();
        if (localStorage.getItem('boxJson') != null && localStorage.getItem('boxJson') != '') {
            loadBoxData();
        }
    }
    //初始化表情包
    function ExpressionInit() {
        $.getJSON("data/Expression.json",
            function (data) {
                data.forEach(element => {
                    element.expressionName = 'images/Expression/' + element.expressionName + '.png';
                });
                for (let i = 0; i < data.length; i++) {
                    $('.imgContent').append("<img src='" + data[i].expressionName + "' alt='' srcset='' class='hgfhdft'>");
                    $('.imgContent').children().eq(i).click(function () {
                        ExpressionSend($(this));
                    });
                }
            }
        )
    }
    //表情包点击发送
    function ExpressionSend(e) {
        var avatars = $("img[class*='imgd']");
        if (avatars.length <= 0) {
            value = 9999;
        } else {
            value = chooseAvatar.roleId
        }
        var json = new Object();
        json.index = cen;
        json.type = "Expression"
        var imgObj = e.attr('src');
        var newTalk = '';
        if (value == 9999) {
            json.roleId = 9999;
            json.content = imgObj;
            boxJson(json);
            newTalk = "<div class='roleOverall rightRoleOverall statistics' data-index=" + cen + "><img  src='" + imgObj + "' alt='' srcset='' class='rightImgExpression udiohsfnds'></div>";
        } else {
            json.roleId = chooseAvatar.roleId,
                json.imgId = chooseAvatar.imgId,
                json.path = chooseAvatar.path,
                json.name = chooseAvatar.name,
                json.content = imgObj;
            boxJson(json);
            newTalk = "<div data-index=" + cen + " class='roleOverall statistics'><div class='divImg'><img src='" + chooseAvatar.path + "' crossOrigin='anonymous' alt='' class='roleImg' srcset=''></div><div><span class='roleNameSpan'>" + chooseAvatar.name + "</span><div class='roleRemarkDiv'><img  src='" + imgObj + "' alt='' srcset='' class='rightImgExpression sioahdnaoi'></div></div></div>";
        }
        $("#box").append(newTalk);
        cen++;
        closeExpression()
        ToBtm();
    }
    //动态添加点击事件
    function roleArrayClick(id, index, e) {
        var dom = $(".center").children().eq(index).children().eq(1);
        roleArray.forEach(item => {
            if (item.id == id) {
                if (item.open) {
                    item.open = false
                    dom.css("display", "none");
                } else {
                    item.open = true
                    dom.css("display", "flex");
                }
            }
        });

        roleArray.forEach(item => {

            if (item.avatarArray == '' && item.id == id) {
                $.getJSON("data/images.json", function (data) {
                    if (!$.isEmptyObject(data)) {
                        var roleImgs = new Array();
                        data.forEach(item => {
                            if (item.roleId == id) {
                                item.path = 'images/roleImages/' + item.imagePath + '.png';
                                item.choose = false;
                                roleImgs.push(item);
                            }
                        });
                        //角色头像加入角色数组
                        roleArray.forEach(item => {
                            if (item.id == id) {
                                var a = new Object();
                                a.avatarList = roleImgs;
                                item.avatarArray = a;
                            }
                        });
                        //插入头像列表
                        $(".center").children().eq(index).append("<div class='centerRoleArraybtn'></div>")
                        for (let indexs = 0; indexs < roleImgs.length; indexs++) {
                            $(".center").children().eq(index).children().last("div").append("<img class='conImg imgb' data-imgid='" + roleImgs[indexs].id + "'  data-roleId='" + roleImgs[indexs].roleId + "' data-open='" + roleImgs[indexs].choose + "' data-index='" + indexs + "' src='" + roleImgs[indexs].path + "' crossOrigin='anonymous' alt='' srcset=''>");
                            $(".center").children().eq(index).children().last("div").children().eq(indexs).click(function () {
                                $(this).toggleClass("imgb bj");
                                if ($(this).parent().children().is(".bj")) {
                                    $(this).parent().siblings(".xq").addClass("qx");
                                } else {
                                    $(this).parent().siblings(".xq").removeClass("qx");
                                }

                                roleAvatarClick($(this));
                            })
                        }
                    } else {
                    }
                }
                );
            }
        });
    }
    //角色头像点击事件
    function roleAvatarClick(e) {
        roleImgArray = new Array();
        var avatars = $("img[class*='bj']");
        for (var i = 0; i < avatars.length; i++) {
            var newObj = {
                roleId: $(avatars[i]).data("roleid"),
                imgId: $(avatars[i]).data("imgid"),
                imgPath: $(avatars[i]).attr("src"),
                index: $()
            }
            roleImgArray.push(newObj);
        }
        btnAvatars();
    }
    //底部已选头像
    function btnAvatars() {
        var txt = '';
        roleImgArray.forEach(item => {
            txt = txt + "<img class='conAvataar zz' data-roleid='" + item.roleId + "' data-imgId='" + item.imgId + "' src='" + item.imgPath + "' srcset=''>";
        });
        $(".bottomImgs").html(txt);
        $(".conAvataar").on("click", this, function () {
            $(this).toggleClass("zz");
            $(this).siblings().addClass("zz");
            if ($(this).hasClass("imgd")) {
                $(this).removeClass("imgd");
            }
            else {
                $(".conAvataar").each(function () {
                    $(this).removeClass("imgd");
                })
                $(this).addClass("imgd");

                var obj = {
                    roleId: $(this).data("roleid"),
                    imgId: $(this).data("imgid"),
                    path: $(this).attr("src"),
                }
                var roleName = '';
                for (let i = 0; i < roleArray.length; i++) {
                    if (roleArray[i].id == obj.roleId) {
                        roleName = roleArray[i].roleName;
                        break;
                    }

                }
                obj.name = roleName;
                chooseAvatar = obj;
            }
        })
    }
    //切分文本长度
    function getActualWidthOfChars(text, options = {}) {
        const { size = 18, family = "none" } = options;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.font = `${size}px ${family}`;
        const metrics = ctx.measureText(text);
        const actual = Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight);
        return Math.max(metrics.width, actual);
    }
    //删除所有
    $('#delAll').click(function () {
        var a = $("div[class*='roleOverall']");
        var b = $("div[class*='pangbaiDiv']");
        if (a.length > 0 || b.length > 0) {
            var c = confirm("确认要删除吗？");
            if (c) {
                $("#box").html('');
                localStorage.clear();
                boxJsonArray = '';
                getLength();
                window.location.reload();
            }
        }

    })
    //删除上一句
    $("#delOne").click(function () {
        $("#box").children().last().remove();
        var newJson = new Array();
        for (let i = 0; i < boxJsonArray.length - 1; i++) {
            newJson.push(boxJsonArray[i]);
        }
        boxJsonArray = newJson;
        localStorage.setItem('boxJson', JSON.stringify(newJson));
        getLength();
    });
    //发送图片
    $("#imgUpload").click(function () {
        var avatars = $("img[class*='imgd']");
        var json = new Object();
        if (avatars.length <= 0) {
            value = 9999;
        } else {
            value = chooseAvatar.roleId
        }
        var link = document.createElement("input");
        var jq = $(link);
        jq.attr({ "type": "file", "accept": "image/*" });
        jq.on("change", function () {
            var reader = new FileReader();
            json.index = cen;
            json.type = "img"
            var imgP = $(this);
            var imgObj = imgP[0].files[0];
            reader.readAsDataURL(imgObj);
            var url = getInputURL(imgObj);
            var newTalk = '';
            if (value == 9999) {
                newTalk = "<div data-index=" + cen + " class='roleOverall rightRoleOverall statistics'><div class='Righthorn'></div><img src='" + url + "' alt='' srcset='' class='rightImg rightImg1'></div>";
                json.roleId = 9999;
                reader.onload = function () {
                    json.content = reader.result;
                    boxJson(json);
                };
            } else {
                json.roleId = chooseAvatar.roleId,
                    json.imgId = chooseAvatar.imgId,
                    json.path = chooseAvatar.path,
                    json.name = chooseAvatar.name,
                    newTalk = "<div data-index=" + cen + " class='roleOverall statistics'><div class='divImg'><img src='" + chooseAvatar.path + "' crossOrigin='anonymous' alt='' class='roleImg' srcset=''></div><div><span class='roleNameSpan'>" + chooseAvatar.name + "</span><div class='roleRemarkDiv'><div class='horn'></div><img src='" + url + "' alt='' srcset='' class='rightImg rightImg2'></div></div></div>";
                reader.onload = function () {
                    json.content = reader.result;
                    boxJson(json);
                };
            }

            cen++;
            $("#box").append(newTalk);
            ToBtm();
        })
        jq.click();
    })
    //打开表情包
    $("#imgExpression").click(function () {
        $('.Gallery').removeClass('n');
    })

    $('.gb').click(function () {
        closeExpression();
    })
    //关闭表情包
    function closeExpression() {
        $(".Gallery").addClass('n');
    }
    //获取图片地址
    function getInputURL(file) {
        var url = null;
        if (window.createObjcectURL != undefined) {
            url = window.createOjcectURL(file);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }
    var text = document.getElementById("text");

    autoTextarea(text);// 调用

    function autoTextarea(elem, extra, maxHeight) {

        extra = extra || 0;
        var maxHeight = 0;
        var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,

            isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),

            addEvent = function (type, callback) {

                elem.addEventListener ?

                    elem.addEventListener(type, callback, false) :

                    elem.attachEvent('on' + type, callback);

            },

            getStyle = elem.currentStyle ? function (name) {

                var val = elem.currentStyle[name];
                if (name === 'height' && val.search(/px/i) !== 1) {

                    var rect = elem.getBoundingClientRect();

                    return rect.bottom - rect.top -

                        parseFloat(getStyle('paddingTop')) -

                        parseFloat(getStyle('paddingBottom')) + 'px';

                };



                return val;

            } : function (name) {

                return getComputedStyle(elem, null)[name];

            },

            minHeight = parseFloat(getStyle('height'));



        elem.style.resize = 'none';



        var change = function () {

            var scrollTop, height,

                padding = 0,

                style = elem.style;



            if (elem._length === elem.value.length) return;

            elem._length = elem.value.length;



            if (!isFirefox && !isOpera) {

                padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));

            };

            scrollTop = document.body.scrollTop || document.documentElement.scrollTop;



            elem.style.height = minHeight + 'px';

            if (elem.scrollHeight > minHeight) {

                if (maxHeight && elem.scrollHeight > maxHeight) {

                    height = maxHeight - padding;

                    style.overflowY = 'auto';

                } else {

                    height = elem.scrollHeight - padding;

                    style.overflowY = 'hidden';

                };

                style.height = height + extra + 'px';

                scrollTop += parseInt(style.height) - elem.currHeight;

                document.body.scrollTop = scrollTop;

                document.documentElement.scrollTop = scrollTop;

                elem.currHeight = parseInt(style.height);

            };

        };



        addEvent('propertychange', change);

        addEvent('input', change);

        addEvent('focus', change);

        change();

    };
    function boxJson(json) {
        boxJsonArray.push(json);
        var a = JSON.stringify(boxJsonArray);
        localStorage.setItem("boxJson", a);
    }
    function selectJson() {

    }
    //计算字节长度
    function getLength() {
        if (localStorage.getItem('boxJson') != null && localStorage.getItem('boxJson') != '') {
            var str = localStorage.getItem('boxJson');
            var length = localStorage.getItem('boxJson').length;
            var init = length;
            for (var i = 0; i < init; i++) {
                if (str.charCodeAt(i) > 255) {
                    length++;
                }
            }
            var strLength = length;
            var changdu = parseFloat(strLength / 1000).toFixed(2) > 1000 ? parseFloat(strLength / 1000000).toFixed(2) + "MB" : parseFloat(strLength / 1000).toFixed(2) + "KB";
            $('.stringLength').html(changdu);
        }
    }
    //实时修改聊天记录
    function updateBoxOne(index, text) {
        for (let i = 0; i < boxJsonArray.length; i++) {
            if (boxJsonArray[i].index == index) {
                boxJsonArray[i].content = text;
                break;
            }

        }
        localStorage.setItem('boxJson', JSON.stringify(boxJsonArray));
    }
});
