$(document).ready(function () {
    var roleArray;
    var roleImgArray;
    var ExpressionArray;
    var chooseAvatar = '';
    var one;
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
        if (e.keyCode == 33) {
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
        } else if (keyCode == 13) { //enter发送
            wirte();
            event.preventDefault();//禁止回车的默认换行
        }
    })
    function wirte() {
        $("#text").css("height", "24px");
        var text = $("#text").val();
        var value;
        var avatars = $("img[class*='imgd']");
        if (avatars.length <= 0) {
            value = 9999;
        } else {
            value = chooseAvatar.roleId
        }
        // if (chooseAvatar == '') {
        //     value = 9999;
        // } else {
        //     value = chooseAvatar.roleId
        // }
        if (text != "") {
            if (value == 9999) {
                newTalk = "<div class='roleOverall rightRoleOverall'><div class='Righthorn'></div><div class='roleRemarkDiv3 roleRemarkDiv' contenteditable='true'><span class='roleRemarkDivSpan'>" + text + "</span></div></div>";
            } else {
                newTalk = "<div class='roleOverall'><div class='divImg'><img src='" + chooseAvatar.path + "' crossOrigin='anonymous' alt='' class='roleImg' srcset=''></div><div><span class='roleNameSpan'>" + chooseAvatar.name + "</span><div class='roleRemarkDiv'><div class='horn'></div><div class='roleRemarkDiv2 roleRemarkDiv' contenteditable='true'><span class='roleRemarkDivSpan'>" + text + "</span></div></div></div></div>";
            }
            $("#box").append(newTalk);
            $("#text").val("");
            ToBtm();
            var text = document.getElementById("text");

            autoTextarea(text);// 调用
            //textHeightRest ()
        }
    }
    //滚动条到最底部
    function ToBtm() {
        var scrollHeight = $('#box').prop("scrollHeight") + 9999
        $('#box').scrollTop(scrollHeight);
        getNotice();
    }
    //旁白
    function aside() {
        $("#text").css("height", "24px");
        var text = $("#text").val();
        if (text != "") {
            newTalk = "<div class='pangbaiDiv' contenteditable='true'><span class='pangbaiSpan'>" + text + "</span></div>";
            $("#box").append(newTalk);
            $("#text").val("");
            ToBtm();
            // textHeightRest ()
        }
    }
    //初始化数据
    function Init() {
        $("#knopiji").html('');
        $.getJSON("data/roles.json",
            function (data) {
                
                data.forEach(item => {
                    item.imgURl = 'roleImages/' + item.imgURl + '.png';
                    item.belongsImgURL = 'roleImages/' + item.belongsImgURL + '.webp';
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
			var roleImgs;
            if (item.avatarArray == '' && item.id == id) {
                $.getJSON("data/images.json",function (data) {
                    if (!$.isEmptyObject(data)) {
						
                        data.forEach(item => {
							if(item.roleid==id){
								item.path = 'roleImages/' + item.path + '.png';
								item.choose = false;
								roleImgs.push(item);
							}
                        });
                        //角色头像加入角色数组
                        roleArray.forEach(item => {
                            if (item.id == id) {
                                var a = new Object();
                                a.avatarList = roleImgs.reverse();
                                item.avatarArray = a;
                            }
                        });
                        //插入头像列表
                        $(".center").children().eq(index).append("<div class='centerRoleArraybtn'></div>")
                        for (let indexs = 0; indexs < data.length; indexs++) {
                            $(".center").children().eq(index).children().last("div").append("<img class='conImg imgb' data-imgid='" + data[indexs].id + "'  data-roleId='" + data[indexs].roleId + "' data-open='" + data[indexs].choose + "' data-index='" + indexs + "' title='" + data[indexs].description + "' src='" + data[indexs].path + "' crossOrigin='anonymous' alt='' srcset=''>");
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
                imgDescription: $(avatars[i]).attr("title"),
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
            txt = txt + "<img class='conAvataar zz' data-roleid='" + item.roleId + "' data-imgId='" + item.imgId + "' src='" + item.imgPath + "' title='" + item.imgDescription + "' srcset=''>";
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
            }
        }
    })
    //删除上一句
    $("#delOne").click(function () {
        $("#box").children().last().remove();
    });
    //发送图片
    $("#imgUpload").click(function () {
        // if (chooseAvatar == '') {
        //     value = 9999;
        // } else {
        //     value = chooseAvatar.roleId
        // }
        var avatars = $("img[class*='imgd']");
        if (avatars.length <= 0) {
            value = 9999;
        } else {
            value = chooseAvatar.roleId
        }
        var link = document.createElement("input");
        var jq = $(link);
        jq.attr({ "type": "file", "accept": "image/*" });
        jq.on("change", function () {
            var imgP = $(this);
            var imgObj = imgP[0].files[0];
            var url = getInputURL(imgObj);
            var newTalk = '';
            if (value == 9999) {
                newTalk = "<div class='roleOverall rightRoleOverall'><div class='Righthorn'></div><img src='" + url + "' alt='' srcset='' class='rightImg rightImg1'></div>";
            } else {
                newTalk = "<div class='roleOverall'><div class='divImg'><img src='" + chooseAvatar.path + "' crossOrigin='anonymous' alt='' class='roleImg' srcset=''></div><div><span class='roleNameSpan'>" + chooseAvatar.name + "</span><div class='roleRemarkDiv'><div class='horn'></div><img src='" + url + "' alt='' srcset='' class='rightImg rightImg2'></div></div></div>";
            }
            $("#box").append(newTalk);
            ToBtm();
        })
        jq.click();

    })
	//发送表情
    $("#imgExpression").click(function () {
        var avatars = $("img[class*='imgd']");
        console.log("avatars", avatars.length);
        if (avatars.length <= 0) {
            value = 9999;
        } else {
            value = chooseAvatar.roleId
        }
        var link = document.createElement("input");
        var jq = $(link);
        jq.attr({ "type": "file", "accept": "image/*" });
        jq.on("change", function () {
            console.log("图片上传", $(this));
            var imgP = $(this);
            var imgObj = imgP[0].files[0];
            var url = getInputURL(imgObj);
            var newTalk = '';
            if (value == 9999) {
                newTalk = "<div class='roleOverall rightRoleOverall'><div class='Righthorn'></div><img src='" + url + "' alt='' srcset='' class='rightImgExpression'></div>";
                console.log(url);
            } else {
                newTalk = "<div class='roleOverall'><div class='divImg'><img src='" + chooseAvatar.path + "' crossOrigin='anonymous' alt='' class='roleImg' srcset=''></div><div><span class='roleNameSpan'>" + chooseAvatar.name + "</span><div class='roleRemarkDiv'><img src='" + url + "' alt='' srcset='' class='rightImgExpression'></div></div></div>";
            }
            $("#box").append(newTalk);
            ToBtm();
            console.log("图片所在",);
        })
        jq.click();
    })
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

});
