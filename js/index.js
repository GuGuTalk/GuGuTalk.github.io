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
        if (e.keyCode == 36) { //enter发送
            wirte();
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
        var a = $("div[class*='roleOverall']");
        if (avatars.length <= 0) {
            value = 9999;
        } else {
            value = chooseAvatar.roleId
        }
        if (text != "") {
            json.index = cen;
            json.content = text;
            if (value == 9999) {
                newTalk = "<div data-index=" + cen + " data-name='9999' class='roleOverall rightRoleOverall statistics'><div class='Righthorn'></div><div class='roleRemarkDiv3 roleRemarkDiv' contenteditable='true'><div  class='roleRemarkDivSpan'>" + text + "</div></div></div>";
                json.roleId = 9999;
                json.mark = '9999';
            } else {
                json.roleId = chooseAvatar.roleId,
                    json.imgId = chooseAvatar.imgId,
                    json.path = chooseAvatar.path,
                    json.name = chooseAvatar.name,
                    json.content = text,
                    json.mark = chooseAvatar.mark
                if ($('#box').children().last('div').data('name') == chooseAvatar.mark) {
                    newTalk = "<div data-index=" + cen + " data-name=" + chooseAvatar.mark + " class='roleOverall statistics iuydsgfop'><div><div class='roleRemarkDiv yiuchsfh'><div class='roleRemarkDiv2 roleRemarkDiv' contenteditable='true' ><div class='roleRemarkDivSpan' >" + text + "</div></div></div></div></div>";
                    //newTalk = "<div data-index=" + cen + " data-name=" + chooseAvatar.mark + " class='roleOverall statistics iuydsgfop'><div class='divImg'><img src='" + chooseAvatar.path + "' crossOrigin='anonymous' alt='' class='roleImg' srcset='' style='height:0'></div><div><span class='roleNameSpan'></span><div class='roleRemarkDiv'><div class='roleRemarkDiv2 roleRemarkDiv' contenteditable='true' ><div class='roleRemarkDivSpan' >" + text + "</div></div></div></div></div>";
                } else {
                    newTalk = "<div data-index=" + cen + " data-name=" + chooseAvatar.mark + " class='roleOverall statistics'><div class='divImg'><img src='" + chooseAvatar.path + "' crossOrigin='anonymous' alt='' class='roleImg' srcset=''></div><div><span class='roleNameSpan'>" + chooseAvatar.name + "</span><div class='roleRemarkDiv'><div class='horn'></div><div class='roleRemarkDiv2 roleRemarkDiv' contenteditable='true' ><div class='roleRemarkDivSpan' >" + text + "</div></div></div></div></div>";
                }
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
            newTalk = "<div class='pangbaiDiv statistics' contenteditable='true' data-index=" + cen + " data-name='aside'><div class='pangbaiSpan'>" + text + "</div></div>";
            var json = new Object();
            json.index = cen;
            json.type = 'aside';
            json.content = text;
            json.mark = 'aside';
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
        var a = 'data:image'
        var num = 9999;
        for (let i = 0; i < boxJsonArray.length; i++) {
            var newTalk = '';
            switch (boxJsonArray[i].type) {
                case 'Expression':
                    if (boxJsonArray[i].roleId == 9999) {
                        newTalk = "<div class='roleOverall rightRoleOverall statistics' data-index=" + boxJsonArray[i].index + " data-name=" + boxJsonArray[i].mark + "><img  src='" + boxJsonArray[i].content + "' alt='' srcset='' class='rightImgExpression udiohsfnds'></div>";
                    } else {
                        if (i > 0 && boxJsonArray[i - 1].mark == boxJsonArray[i].mark) {
                            newTalk = "<div data-index=" + boxJsonArray[i].index + " data-name=" + boxJsonArray[i].mark + " class='roleOverall statistics hudsfdosf'><div><div class='roleRemarkDiv yiuchsfh'><img src='" + boxJsonArray[i].content + "' alt='' srcset='' class='rightImgExpression '></div></div></div>";
                        } else {
                            newTalk = `<div class='roleOverall statistics' data-index="${boxJsonArray[i].index}"data-name="${boxJsonArray[i].mark}"><div class='divImg'><img src='${boxJsonArray[i].path.indexOf(a) < 0 ? boxJsonArray[i].path : dataURItoBlob(boxJsonArray[i].path)}' crossOrigin='anonymous' alt='' class='roleImg' srcset=''></div><div><span class='roleNameSpan'>${boxJsonArray[i].name}</span><div class='roleRemarkDiv'><img  src='${boxJsonArray[i].content}' alt='' srcset='' class='rightImgExpression '></div></div></div>`;
                        }
                    }
                    html = html + newTalk;
                    break;
                case 'img':
                    if (boxJsonArray[i].roleId == 9999) {
                        newTalk = "<div class='roleOverall rightRoleOverall statistics' data-index=" + boxJsonArray[i].index + " data-name=" + boxJsonArray[i].mark + "><div class='Righthorn'></div><img  src='" + dataURItoBlob(boxJsonArray[i].content) + "' alt='' srcset='' class='rightImg rightImg1'></div>";
                    } else {
                        if (i > 0 && boxJsonArray[i - 1].mark == boxJsonArray[i].mark) {
                            newTalk = "<div data-index=" + boxJsonArray[i].index + " data-name=" + boxJsonArray[i].mark + " class='roleOverall statistics iuydsgfop'><div><div class='roleRemarkDiv yiuchsfh'><img src='" + dataURItoBlob(boxJsonArray[i].content) + "' alt='' srcset='' class='ydbsfhdf rightImg2'></div></div></div>";
                        } else {
                            newTalk = `<div class='roleOverall statistics' data-index="${boxJsonArray[i].index}" data-name="${boxJsonArray[i].mark}"><div class='divImg'><img src='${boxJsonArray[i].path.indexOf(a) < 0 ? boxJsonArray[i].path : dataURItoBlob(boxJsonArray[i].path)}' crossOrigin='anonymous' alt='' class='roleImg' srcset=''></div><div><span class='roleNameSpan'>"${boxJsonArray[i].name}"</span><div class='roleRemarkDiv'><div class='horn'></div><img  src='${dataURItoBlob(boxJsonArray[i].content)}' alt='' srcset='' class='rightImg rightImg2'></div></div></div>`;
                        }
                    }
                    html = html + newTalk;
                    break;
                case 'txt':
                    if (boxJsonArray[i].roleId == 9999) {
                        newTalk = "<div class='roleOverall rightRoleOverall statistics'  data-index=" + boxJsonArray[i].index + " data-name=" + boxJsonArray[i].mark + "><div class='Righthorn'></div><div class='roleRemarkDiv3 roleRemarkDiv' contenteditable='true' ><div class='roleRemarkDivSpan'>" + boxJsonArray[i].content + "</div></div></div>";
                    } else {
                        if (i > 0 && boxJsonArray[i - 1].mark == boxJsonArray[i].mark) {
                            newTalk = "<div data-index=" + boxJsonArray[i].index + " data-name=" + boxJsonArray[i].mark + " class='roleOverall statistics iuydsgfop'><div><div class='roleRemarkDiv yiuchsfh'><div class='roleRemarkDiv2 roleRemarkDiv' contenteditable='true' ><div class='roleRemarkDivSpan' >" + boxJsonArray[i].content + "</div></div></div></div></div>";
                        } else {
                            newTalk = `<div class='roleOverall statistics'  data-index="${boxJsonArray[i].index}" data-name=" ${boxJsonArray[i].mark} "><div class='divImg'><img src='${boxJsonArray[i].path.indexOf(a) < 0 ? boxJsonArray[i].path : dataURItoBlob(boxJsonArray[i].path)} ' crossOrigin='anonymous' alt='' class='roleImg' srcset=''></div><div><span class='roleNameSpan'>${boxJsonArray[i].name}</span><div class='roleRemarkDiv'><div class='horn'></div><div class='roleRemarkDiv2 roleRemarkDiv' contenteditable='true' ><div class='roleRemarkDivSpan'>${boxJsonArray[i].content}</div></div></div></div></div>`;
                        }
                    }
                    html = html + newTalk;
                    break;
                case 'aside':
                    newTalk = "<div class='pangbaiDiv statistics' contenteditable='true' data-index=" + boxJsonArray[i].index + " data-name=" + boxJsonArray[i].mark + "><span class='pangbaiSpan'>" + boxJsonArray[i].content + "</span></div>";
                    html = html + newTalk;
                    break;
            }
        }
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
                data = splicingRole(data);
                roleArray = data;
                //循环展示角色
                for (let index = 0; index < roleArray.length; index++) {
                    // $(".center").append("<div class='sonbsc'><div class='xq' data-id='" + roleArray[index].id + "'><img crossOrigin='anonymous' src='" + roleArray[index].imgURl + "' alt='' height=75px; width=75px; class='sdad'></div></div>")
                    $(".center").append("<div class='sonbsc'><div class='xq' data-id='" + roleArray[index].id + "'><div class='wwww'><img crossOrigin='anonymous' src='" + roleArray[index].imgURl + "' alt='' height=75px; width=75px; class='sdad'><span class='roleName'>" + roleArray[index].roleName + "</span></div><img src='" + roleArray[index].belongsImgURL + "' class='ddddddddddd' alt='' srcset=''></div></div>")
                    //附加删除自定义角色事件
                    $(".center").children().eq(index).children().eq(0).children().last('ddddddddddd').click(function (e) {
                        if (roleArray[index].description == 'newRole') {
                            deleteRole(roleArray[index].id, e);
                        }
                    })
                    $(".center").children().eq(index).children().eq(0).click(function (e) {
                        roleArrayClick(roleArray[index].id, index, this);
                    });
                }
            }
        );
        ExpressionInit(1);
        getLength();
        if (localStorage.getItem('boxJson') != null && localStorage.getItem('boxJson') != '') {
            loadBoxData();
        }
        ToBtm();
    }
    //初始化表情包
    function ExpressionInit(num) {
        $('.imgContent').html("");
        var st = "";
        var a = "";
        var ele = $(".yhivdfbs");
        if (num == 1) {
            st = "data/Expression.json";
            a = "images/Expression/";
        } else {
            st = "data/roleExpression.json";
            a = "images/roleExpression/";
        }
        $.getJSON(st,
            function (data) {
                data.forEach(element => {
                    element.expressionName = a + element.expressionName + '.png';
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
            json.mark = '9999';
            boxJson(json);
            newTalk = "<div class='roleOverall rightRoleOverall statistics' data-index=" + cen + " data-name='9999'><img  src='" + imgObj + "' alt='' srcset='' class='rightImgExpression udiohsfnds'></div>";
        } else {
            json.roleId = chooseAvatar.roleId,
                json.imgId = chooseAvatar.imgId,
                json.path = chooseAvatar.path,
                json.name = chooseAvatar.name,
                json.content = imgObj;
            json.mark = chooseAvatar.mark;
            boxJson(json);
            if ($('#box').children().last('div').data('name') == chooseAvatar.mark) {
                //newTalk = "<div data-index=" + cen + " data-name=" + chooseAvatar.mark + " class='roleOverall statistics iuydsgfop'><div><div class='roleRemarkDiv yiuchsfh'><img src='" + url + "' alt='' srcset='' class='ydbsfhdf rightImg2'></div></div></div>";
                newTalk = "<div data-index=" + cen + " data-name=" + chooseAvatar.mark + " class='roleOverall statistics hudsfdosf'><div><div class='roleRemarkDiv yiuchsfh'><img src='" + imgObj + "' alt='' srcset='' class='rightImgExpression '></div></div></div>";
            } else {
                newTalk = "<div data-index=" + cen + " data-name=" + chooseAvatar.mark + " class='roleOverall statistics'><div class='divImg'><img src='" + chooseAvatar.path + "' crossOrigin='anonymous' alt='' class='roleImg' srcset=''></div><div><span class='roleNameSpan'>" + chooseAvatar.name + "</span><div class='roleRemarkDiv'><img  src='" + imgObj + "' alt='' srcset='' class='rightImgExpression '></div></div></div>";
            }
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
                $.getJSON("data/imagese.json", function (data) {
                    if (!$.isEmptyObject(data)) {
                        var roleImgs = new Array();
                        data.forEach(item => {
                            if (item.roleId == id) {
                                item.mark = item.imagePath;
                                item.path = 'images/roleImages/' + item.imagePath + '.png';
                                item.choose = false;
                                roleImgs.push(item);
                            }

                        });

                        //角色头像加入角色数组
                        roleArray.forEach(item => {
                            if (item.id == id && item.description == null) {
                                var a = new Object();
                                a.avatarList = roleImgs;
                                item.avatarArray = a;
                            }
                            //拼接自定义角色
                            if (item.id == id && item.description == 'newRole') {
                                var a = new Object();
                                var b = {
                                    path: item.imgURl,
                                    mark: item.roleName,
                                    choose: false,
                                    roleId: item.id
                                }
                                var array = new Array();
                                array.push(b);
                                roleImgs.push(b);
                                a.avatarList = array;
                                item.avatarArray = a;
                            }
                        });
                        //插入头像列表
                        $(".center").children().eq(index).append("<div class='centerRoleArraybtn'></div>")
                        for (let indexs = 0; indexs < roleImgs.length; indexs++) {
                            $(".center").children().eq(index).children().last("div").append("<img data-mark=" + roleImgs[indexs].mark + " class='conImg imgb' data-imgid='" + roleImgs[indexs].id + "'  data-roleId='" + roleImgs[indexs].roleId + "' data-open='" + roleImgs[indexs].choose + "' data-index='" + indexs + "' title='" + roleImgs[indexs].imgName + "' src='" + roleImgs[indexs].path + "' crossOrigin='anonymous' alt='' srcset=''>");
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
                mark: $(avatars[i]).data("mark")
            }
            roleImgArray.push(newObj);
        }

        btnAvatars();
    }
    //底部已选头像
    function btnAvatars() {
        var txt = '';
        roleImgArray.forEach(item => {
            txt = txt + "<img data-name=" + item.mark + " class='conAvataar zz' data-roleid='" + item.roleId + "' data-imgId='" + item.imgId + "' src='" + item.imgPath + "' srcset=''>";
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
                obj.mark = $(this).data('name');
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
                //localStorage.clear();
                localStorage.removeItem("boxJson");
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
                newTalk = "<div data-index=" + cen + " data-name='9999' class='roleOverall rightRoleOverall statistics'><div class='Righthorn'></div><img src='" + url + "' alt='' srcset='' class='rightImg rightImg1'></div>";
                json.roleId = 9999;
                json.mark = '9999';
                reader.onload = function () {
                    json.content = reader.result;
                    boxJson(json);
                };
            } else {
                json.roleId = chooseAvatar.roleId;
                json.imgId = chooseAvatar.imgId;
                json.path = chooseAvatar.path;
                json.name = chooseAvatar.name;
                json.mark = chooseAvatar.mark;
                if ($('#box').children().last('div').data('name') == chooseAvatar.mark) {
                    newTalk = "<div data-index=" + cen + " data-name=" + chooseAvatar.mark + " class='roleOverall statistics iuydsgfop'><div><div class='roleRemarkDiv yiuchsfh'><img src='" + url + "' alt='' srcset='' class='ydbsfhdf rightImg2'></div></div></div>";
                } else {
                    newTalk = "<div data-index=" + cen + " data-name=" + chooseAvatar.mark + " class='roleOverall statistics'><div class='divImg'><img src='" + chooseAvatar.path + "' crossOrigin='anonymous' alt='' class='roleImg' srcset=''></div><div><span class='roleNameSpan'>" + chooseAvatar.name + "</span><div class='roleRemarkDiv'><div class='horn'></div><img src='" + url + "' alt='' srcset='' class='rightImg rightImg2'></div></div></div>";
                }
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
    //创建角色
    $("#newRole").click(function () {
        var roleName = prompt("请输入角色姓名", "");
        if (roleName != null || roleName == '') {
            var link = document.createElement("input");
            var jq = $(link);
            jq.attr({ "type": "file", "accept": "image/*" });
            jq.on("change", function () {
                var reader = new FileReader();
                var imgP = $(this);
                var imgObj = imgP[0].files[0];
                reader.readAsDataURL(imgObj);
                reader.onload = function () {
                    var json = new Object();
                    json.id = parseInt(getNowTime());
                    json.roleName = roleName;
                    json.description = "newRole";
                    json.imgURl = reader.result;
                    newRoleSave(json);
                };
            })
        }
        jq.click();
    })
    //保存新建角色
    function newRoleSave(ele) {
        ele.belongsImgURL = 'images/gb.png';
        var json = new Array();
        if (localStorage.getItem('newRoleJson') != null && localStorage.getItem('newRoleJson') != '') {
            json = JSON.parse(localStorage.getItem('newRoleJson'));
            json.unshift(ele);
        } else {
            json.push(ele);
        }
        var a = JSON.stringify(json);
        localStorage.setItem("newRoleJson", a);
        //Init();
        window.location.reload();
    }
    //删除自定义角色
    function deleteRole(id, e) {
        console.log(id);

        var c = confirm("确认要删除吗？");
        if (c) {
            var json = JSON.parse(localStorage.getItem('newRoleJson'));
            var newJson = new Array();
            for (let i = 0; i < json.length; i++) {
                if (json[i].id != id) {
                    newJson.push(json[i]);
                }
            }
            localStorage.setItem('newRoleJson', JSON.stringify(newJson))
            //Init()
            window.location.reload();
        }

        e.stopPropagation();
    }
    //拼接自定义角色到列表
    function splicingRole(array) {
        var json = JSON.parse(localStorage.getItem('newRoleJson'));
        if (json == '' || json == null) {
            return array;
        } else {
            json.forEach(item => {
                item.imgURl = item.imgURl;
                item.belongsImgURL = 'images/gb.png';
                item.open = false;
                item.avatarArray = '';
            });
            array.push.apply(json, array);
            return json;
        }
    }
    //下一个表情包
    $(".ToT").click(function () {
        ExpressionInit(1);
    })
    //上一个表情包
    $(".ToB").click(function () {
        ExpressionInit(2);
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
    function getNowTime() {
        let now = new Date();
        let year = now.getFullYear(); //获取完整的年份(4位,1970-????)
        let month = now.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        let today = now.getDate(); //获取当前日(1-31)
        let hour = now.getHours(); //获取当前小时数(0-23)
        let minute = now.getMinutes(); //获取当前分钟数(0-59)
        let second = now.getSeconds(); //获取当前秒数(0-59)
        let nowTime = ''
        nowTime = year + fillZero(month) + fillZero(today) + fillZero(hour) + fillZero(minute) + fillZero(second)
        return nowTime
    };

    function fillZero(str) {
        var realNum;
        if (str < 10) {
            realNum = '0' + str;
        } else {
            realNum = str;
        }
        return realNum.toString();
    }
});
