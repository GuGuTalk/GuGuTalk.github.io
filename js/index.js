$().ready(function () {
    var roleArray;
    var roleImgArray;
    var chooseAvatar = {
        roleId: 9999
    };
    var boxJsonArray = new Array();
    var cen = 0;
    var Keys = "GuGuTalk";
    Init();

    $(document).keyup(function (e) {
        if (e.keyCode == 45) {
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
        $("#text").css("height", "1.35rem");
        var text = $("#text").val();
        var value;
        json.type = 'txt'
        var base64;
        var avatars = $("img[class*='imgd']");
        var a = $("div[class*='roleOverall']");
        if (avatars.length <= 0) {
            value = 9999;
        } else {
            value = chooseAvatar.roleId
            base64 = getBase64(chooseAvatar.roleId);
        }
        var newTalk = '';
        if (text != "") {
            json.index = cen;
            json.content = text;
            if (value == 9999) {
                json.roleId = 9999;
                json.mark = '9999';
            } else {
                json.roleId = chooseAvatar.roleId,
                    json.imgId = chooseAvatar.imgId,
                    json.name = chooseAvatar.name,
                    json.content = text,
                    json.mark = chooseAvatar.mark;
                if (chooseAvatar.roleId != undefined) {
                    json.base64 = '';
                    json.path = chooseAvatar.path;
                } else {
                    if (getNewRoleType(chooseAvatar.roleId) == "newRole" || getNewRoleType(chooseAvatar.roleId) == null) {
                        json.base64 = base64;
                    }
                    json.path = chooseAvatar.path
                }
            }
            newTalk = createHtml(json)
            insertOrContinue(newTalk, json);

            cen++;
            var text = document.getElementById("text");
            autoTextarea(text);// 调用
        }
    }
    //
    /**
     * 传入参数，根据情况插入对话或者继续对话
     * @param newObj 插入的对话对象
     * @param {*} talk 生成的html
     */
    function insertOrContinue(newTalk, newObj) {
        var that = $(".editOpen");
        if (that.length == 0) {
            $("#box").append(newTalk);
            boxJson(newObj);
            ToBtm();
        } else {
            var index = that.find(".roleOverall").data("index");
            insertTalk(newObj, index).then(res => {
                that.before(newTalk);
            })
        }
        $("#text").val("");

    }
    //传入参数生成html
    /**
     * 传入一个对象
     * new objec{
     * 
     * }
     * @param {*} listOne  参数类
     */
    function createHtml(listOne) {
        var type;//1:继续 2:插入
        var editOpen = $(".editOpen").prev().find('.roleOverall');
        var lastDc = $("#box").children().last(".dc").find('.roleOverall');
        var tdc;
        if ($(".editOpen").length == 0) {
            type = 1;
            tdc = lastDc;
        } else {
            type = 2;
            tdc = editOpen;
        }
        var html = '';
        var a = 'data:image'
        switch (listOne.type) {
            case 'Expression':
                if (listOne.roleId == 9999) {
                    newTalk = `<div class="dc"><div class="roleOverall rightRoleOverall statistics" data-index="${listOne.index}" data-name="${listOne.mark}">
                  <div class="dfsdfYHZ">
                    <div class="chooseDivYHZ">
                      <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ ipt">
                    </div>
                    <img src="${listOne.content}" alt="" srcset="" class="rightImgExpression udiohsfnds">
                  </div>
                </div></div>`;
                } else {
                    if ((tdc.data("name") == listOne.mark) && (tdc.data("names") == listOne.name)) {
                        newTalk = `<div class="dc">
                        <div class="roleOverall" data-names="${listOne.name}" data-name="${listOne.mark}" data-index="${listOne.index}">
                          <div class="divImg">
                            <div class="xvb replaceAvatar"></div>
                            <img src="${listOne.base64.indexOf(a) >= 0 ? dataURItoBlob(listOne.base64) : listOne.path}" crossorigin="anonymous" alt="" class="roleImg width0" srcset="">
                          </div>
                          <div class="roleTb"><span class="roleNameSpan width0">${listOne.name}</span>
                            <div class="roleRemarkDivImg"><img src="${listOne.content}" alt="" srcset="" class="rightImgExpression ">
                            <div class="chooseDiv">
                        <input type="checkbox" name="iptChoose" id="" class="iptChoose  ipt">
                      </div></div>
                          </div>
                        </div>
                      </div>`;
                    } else {
                        newTalk = `<div class="dc">
                        <div class="roleOverall roleOverallTopMargin" data-names="${listOne.name}" data-name="${listOne.mark}" data-index="${listOne.index}">
                          <div class="divImg">
                            <div class="xvb replaceAvatar"></div>
                            <img src="${listOne.base64.indexOf(a) >= 0 ? dataURItoBlob(listOne.base64) : listOne.path}" crossorigin="anonymous" alt="" class="roleImg" srcset="">
                          </div>
                          <div class="roleTb"><span class="roleNameSpan">${listOne.name}</span>
                            <div class="roleRemarkDivImg"><img src="${listOne.content}" alt="" srcset="" class="rightImgExpression ">
                            <div class="chooseDiv">
                        <input type="checkbox" name="iptChoose" id="" class="iptChoose  ipt">
                      </div></div>
                          </div>
                        </div>
                      </div>`;
                    }
                }
                html = html + newTalk;
                break;
            case 'img':
                if (listOne.roleId == 9999) {
                    newTalk = `<div class="dc"><div data-index="${listOne.index}" data-name="${listOne.mark}" class="roleOverall rightRoleOverall statistics">
                    <div class="dfsdfYHZ">
                      <div class="chooseDivYHZ">
                        <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ  ipt">
                      </div>
                      <div class="Righthorn"></div>
                      <img src="${dataURItoBlob(listOne.content)}" alt="" srcset=""
                        class="rightImg rightImg1">
                    </div>
                  </div></div>`;
                } else {
                    if ((tdc.data("name") == listOne.mark) && (tdc.data("names") == listOne.name)) {
                        newTalk = `<div class="dc">
                  <div class="roleOverall" data-names="${listOne.name}" data-name="${listOne.mark}" data-index="${listOne.index}">
                    <div class="divImg">
                      <div class="xvb replaceAvatar"></div>
                      <img src="${listOne.base64.indexOf(a) >= 0 ? dataURItoBlob(listOne.base64) : listOne.path}" crossorigin="anonymous" alt="" class="roleImg width0" srcset="">
                    </div>
                    <div class="roleTb"><span class="roleNameSpan width0">${listOne.name}</span>
                      <div class="roleRemarkDivImg">
                        <div class="horn width0"></div><img src="${dataURItoBlob(listOne.content)}" alt="" srcset="" class="rightImg rightImg2">
                        <div class="chooseDiv">
                        <input type="checkbox" name="iptChoose" id="" class="iptChoose  ipt">
                      </div>
                      </div>
                    </div>
                  </div>
                </div>`;
                    } else {
                        newTalk = `<div class="dc">
                        <div class="roleOverall roleOverallTopMargin" data-names="${listOne.name}" data-name="${listOne.mark}" data-index="${listOne.index}">
                          <div class="divImg">
                            <div class="xvb"></div>
                            <img src="${listOne.base64.indexOf(a) >= 0 ? dataURItoBlob(listOne.base64) : listOne.path}" crossorigin="anonymous" alt="" class="roleImg" srcset="">
                          </div>
                          <div class="roleTb"><span class="roleNameSpan">${listOne.name}</span>
                            <div class="roleRemarkDivImg">
                              <div class="horn"></div><img src="${dataURItoBlob(listOne.content)}" alt="" srcset="" class="rightImg rightImg2">
                              <div class="chooseDiv">
                        <input type="checkbox" name="iptChoose" id="" class="iptChoose  ipt">
                      </div>
                            </div>
                          </div>
                        </div>
                      </div>`;
                    }
                }
                html = html + newTalk;
                break;
            case 'txt':
                if (listOne.roleId == 9999) {
                    newTalk = `<div class="dc"><div data-index="${listOne.index}" data-name="${listOne.mark}" class="roleOverall rightRoleOverall">
                    <div class="dfsdfYHZ">
                      <div class="chooseDivYHZ">
                        <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ  ipt">
                      </div>
                      <div class="Righthorn"></div>
                      <div class="roleRemarkDiv3 roleRemarkDiv">
                        <div class="roleRemarkDivSpan statistics" contenteditable="true" data-index="${listOne.index}">${listOne.content}</div>
                      </div>
                    </div>
                  </div></div>`;
                } else {
                    if ((tdc.data("name") == listOne.mark) && (tdc.data("names") == listOne.name)) {
                        newTalk = `<div class="dc">
                        <div class="roleOverall" data-names="${listOne.name}" data-name="${listOne.mark}" data-index="${listOne.index}">
                          <div class="divImg">
                            <div class="xvb replaceAvatar"></div>
                            <img src="${listOne.base64.indexOf(a) >= 0 ? dataURItoBlob(listOne.base64) : listOne.path}" crossorigin="anonymous" alt="" class="roleImg width0" srcset="">
                          </div>
                          <div class="roleTb"><span class="roleNameSpan width0">${listOne.name} </span>
                            <div class="roleRemarkDivs">
                              <div class="horn width0"></div>
                              <div class="roleRemarkDiv2 roleRemarkDiv">
                                <div class="roleRemarkDivSpan statistics" data-index="${listOne.index}" contenteditable="true">${listOne.content}</div>
                              </div>
                              <div class="chooseDiv">
                        <input type="checkbox" name="iptChoose" id="" class="iptChoose  ipt">
                      </div>
                            </div>
                          </div>
                        </div>
                      </div>`;
                    } else {
                        newTalk = `<div class="dc">
                    <div class="roleOverall roleOverallTopMargin" data-names="${listOne.name}" data-name="${listOne.mark}" data-index="${listOne.index}">
                      <div class="divImg">
                        <div class="xvb"></div>
                        <img src="${listOne.base64.indexOf(a) >= 0 ? dataURItoBlob(listOne.base64) : listOne.path}" crossorigin="anonymous" alt="" class="roleImg" srcset="">
                      </div>
                      <div class="roleTb"><span class="roleNameSpan">${listOne.name} </span>
                        <div class="roleRemarkDivs">
                          <div class="horn"></div>
                          <div class="roleRemarkDiv2 roleRemarkDiv">
                            <div class="roleRemarkDivSpan statistics" data-index="${listOne.index}" contenteditable="true">${listOne.content}</div>
                          </div>
                          <div class="chooseDiv">
                        <input type="checkbox" name="iptChoose" id="" class="iptChoose  ipt">
                      </div>
                        </div>
                      </div>
                    </div>
                  </div>`;
                    }
                }
                html = html + newTalk;
                break;
            case 'aside':
                newTalk = "<div class='dc'><div class='pangbaiDiv ' data-index=" + listOne.index + " data-name=" + listOne.mark + "><span class='pangbaiSpan statistics' contenteditable='true' data-index=" + listOne.index + " >" + listOne.content + "</span></div></div>";
                html = html + newTalk;
                break;
            case 'reply':
                newTalk = `<div class="dc"><div class='eventContainerReply' data-index='${listOne.index}' data-name='${listOne.mark}'>
                <div class='eTopTitle'>
                  <div class='colorBlue'></div>
                  <div class='eTitle'>回复</div>
                </div>
                <div class='eLine'></div>
                <div class='eContentBlue statistics' contenteditable='true' data-index='${listOne.index}' >${listOne.content}</div>
              </div></div>`;
                html = html + newTalk;
                break;
            case 'love':
                newTalk = `<div class="dc"><div class='eventContainerLove' data-index='${listOne.index}' data-name='${listOne.mark}'>
                <div class='eTopTitle'>
                  <div class='colorRed'></div>
                  <div class='eTitle'>羁绊事件</div>
                </div>
                <div class='eLine'></div>
                <div class='eContentRed statistics' contenteditable='true' data-index='${listOne.index}' >${listOne.content}</div>
              </div></div>`;
                html = html + newTalk;
                break;
        }
        return html;
    }
    //获取新建角色类型
    function getNewRoleType(id) {
        var json = roleArray;
        var type;
        for (let index = 0; index < json.length; index++) {
            if (id == json[index].id) {
                type = json[index].description;
                break;
            }

        }
        return type;
    }
    //滚动条到最底部
    function ToBtm() {
        var scrollHeight = $('#box').prop("scrollHeight") + 9999
        $('#box').scrollTop(scrollHeight);

    }
    $("#box").on('focusout', '.statistics', function () {
        var ele = $(this);
        updateBoxOne(ele.data('index'), ele.text());
    })
    //旁白
    function aside() {
        $("#text").css("height", "24px");
        var text = $("#text").val();
        if (text != "") {
            var json = new Object();
            json.index = cen;
            json.type = 'aside';
            json.content = text;
            json.mark = 'aside';
            newTalk = createHtml(json)
            insertOrContinue(newTalk, json);
            cen++;
            // textHeightRest ()
        }
    }
    //特殊事件 回复/羁绊事件
    $('.propIco').click(function () {
        $("#text").css("height", "24px");
        var text = $("#text").val();
        var a = $(this).attr('alt');
        var json = new Object();
        var avatars = $("img[class*='imgd']");

        switch (a) {
            case '回复':
                if (text != "") {
                    json.type = 'reply';
                } else {
                    return false
                }
                break;
            case '旁白':
                if (text != "") {
                    json.type = 'aside';
                } else {
                    return false
                }

                break;
            case '羁绊事件':
                json.type = 'love';
                break;

            default:
                return false
                break;
        }
        switch (json.type) {
            case 'love':
                if (avatars.length > 0) {
                    json.content = '前往' + chooseAvatar.name + "的羁绊剧情";
                    json.name = chooseAvatar.name;
                    json.mark = chooseAvatar.mark;
                } else {
                    json.mark = '9999';
                    json.content = '前往引航者的羁绊剧情';
                }
                json.roleId = chooseAvatar.roleId;
                break;
            case 'reply':
            case 'aside':
                json.content = text;
                break;
            default:
                break;
        }
        json.index = cen;
        newTalk = createHtml(json)
        insertOrContinue(newTalk, json);
        cen++;
    })

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
        getTempJson().then(res => {
            boxJsonArray = res.boxJson;
            cen = boxJsonArray.length > 0 ? boxJsonArray[boxJsonArray.length - 1].index + 1 : 0
            var html = '';
            var a = 'data:image'
            var num = 9999;
            for (let i = 0; i < boxJsonArray.length; i++) {
                var newTalk = '';
                switch (boxJsonArray[i].type) {
                    case 'Expression':
                        if (boxJsonArray[i].roleId == 9999) {
                            newTalk = `<div class="dc"><div class="roleOverall rightRoleOverall statistics" data-index="${boxJsonArray[i].index}" data-name="${boxJsonArray[i].mark}">
                      <div class="dfsdfYHZ">
                        <div class="chooseDivYHZ">
                          <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ  ipt">
                        </div>
                        <img src="${boxJsonArray[i].content}" alt="" srcset="" class="rightImgExpression udiohsfnds">
                      </div>
                    </div></div>`;
                        } else {
                            if ((i > 0 && boxJsonArray[i - 1].mark == boxJsonArray[i].mark) && (i > 0 && boxJsonArray[i - 1].name == boxJsonArray[i].name) && ((i > 0 && boxJsonArray[i - 1].type == "txt") || (i > 0 && boxJsonArray[i - 1].type == "Expression"))) {
                                newTalk = `<div class="dc">
                            <div class="roleOverall" data-names="${boxJsonArray[i].name}" data-name="${boxJsonArray[i].mark}" data-index="${boxJsonArray[i].index}">
                              <div class="divImg">
                                <div class="xvb replaceAvatar"></div>
                                <img src="${boxJsonArray[i].base64.indexOf(a) >= 0 ? dataURItoBlob(boxJsonArray[i].base64) : boxJsonArray[i].path}" crossorigin="anonymous" alt="" class="roleImg width0" srcset="">
                              </div>
                              <div class="roleTb"><span class="roleNameSpan width0">${boxJsonArray[i].name}</span>
                                <div class="roleRemarkDivImg"><img src="${boxJsonArray[i].content}" alt="" srcset="" class="rightImgExpression ">
                                <div class="chooseDiv">
                            <input type="checkbox" name="iptChoose" id="" class="iptChoose  ipt">
                          </div></div>
                              </div>
                            </div>
                          </div>`;
                            } else {
                                newTalk = `<div class="dc">
                            <div class="roleOverall roleOverallTopMargin" data-names="${boxJsonArray[i].name}" data-name="${boxJsonArray[i].mark}" data-index="${boxJsonArray[i].index}">
                              <div class="divImg">
                                <div class="xvb replaceAvatar"></div>
                                <img src="${boxJsonArray[i].base64.indexOf(a) >= 0 ? dataURItoBlob(boxJsonArray[i].base64) : boxJsonArray[i].path}" crossorigin="anonymous" alt="" class="roleImg" srcset="">
                              </div>
                              <div class="roleTb"><span class="roleNameSpan">${boxJsonArray[i].name}</span>
                                <div class="roleRemarkDivImg"><img src="${boxJsonArray[i].content}" alt="" srcset="" class="rightImgExpression ">
                                <div class="chooseDiv">
                            <input type="checkbox" name="iptChoose" id="" class="iptChoose  ipt">
                          </div></div>
                              </div>
                            </div>
                          </div>`;
                            }
                        }
                        html = html + newTalk;
                        break;
                    case 'img':
                        if (boxJsonArray[i].roleId == 9999) {
                            newTalk = `<div class="dc"><div data-index="${boxJsonArray[i].index}" data-name="${boxJsonArray[i].mark}" class="roleOverall rightRoleOverall statistics">
                        <div class="dfsdfYHZ">
                          <div class="chooseDivYHZ">
                            <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ  ipt">
                          </div>
                          <div class="Righthorn"></div>
                          <img src="${dataURItoBlob(boxJsonArray[i].content)}" alt="" srcset=""
                            class="rightImg rightImg1">
                        </div>
                      </div></div>`;
                        } else {
                            if ((i > 0 && boxJsonArray[i - 1].mark == boxJsonArray[i].mark) && (i > 0 && boxJsonArray[i - 1].name == boxJsonArray[i].name)) {
                                newTalk = `<div class="dc">
                      <div class="roleOverall" data-names="${boxJsonArray[i].name}" data-name="${boxJsonArray[i].mark}" data-index="${boxJsonArray[i].index}">
                        <div class="divImg">
                          <div class="xvb replaceAvatar"></div>
                          <img src="${boxJsonArray[i].base64.indexOf(a) >= 0 ? dataURItoBlob(boxJsonArray[i].base64) : boxJsonArray[i].path}" crossorigin="anonymous" alt="" class="roleImg width0" srcset="">
                        </div>
                        <div class="roleTb"><span class="roleNameSpan width0">${boxJsonArray[i].name}</span>
                          <div class="roleRemarkDivImg">
                            <div class="horn width0"></div><img src="${dataURItoBlob(boxJsonArray[i].content)}" alt="" srcset="" class="rightImg rightImg2">
                            <div class="chooseDiv">
                            <input type="checkbox" name="iptChoose" id="" class="iptChoose  ipt">
                          </div>
                          </div>
                        </div>
                      </div>
                    </div>`;
                            } else {
                                newTalk = `<div class="dc">
                            <div class="roleOverall roleOverallTopMargin" data-names="${boxJsonArray[i].name}" data-name="${boxJsonArray[i].mark}" data-index="${boxJsonArray[i].index}">
                              <div class="divImg">
                                <div class="xvb"></div>
                                <img src="${boxJsonArray[i].base64.indexOf(a) >= 0 ? dataURItoBlob(boxJsonArray[i].base64) : boxJsonArray[i].path}" crossorigin="anonymous" alt="" class="roleImg" srcset="">
                              </div>
                              <div class="roleTb"><span class="roleNameSpan">${boxJsonArray[i].name}</span>
                                <div class="roleRemarkDivImg">
                                  <div class="horn"></div><img src="${dataURItoBlob(boxJsonArray[i].content)}" alt="" srcset="" class="rightImg rightImg2">
                                  <div class="chooseDiv">
                            <input type="checkbox" name="iptChoose" id="" class="iptChoose  ipt">
                          </div>
                                </div>
                              </div>
                            </div>
                          </div>`;
                            }
                        }
                        html = html + newTalk;
                        break;
                    case 'txt':
                        if (boxJsonArray[i].roleId == 9999) {
                            newTalk = `<div class="dc"><div data-index="${boxJsonArray[i].index}" data-name="${boxJsonArray[i].mark}" class="roleOverall rightRoleOverall">
                        <div class="dfsdfYHZ">
                          <div class="chooseDivYHZ">
                            <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ  ipt">
                          </div>
                          <div class="Righthorn"></div>
                          <div class="roleRemarkDiv3 roleRemarkDiv">
                            <div class="roleRemarkDivSpan statistics" contenteditable="true" data-index="${boxJsonArray[i].index}">${boxJsonArray[i].content}</div>
                          </div>
                        </div>
                      </div></div>`;
                        } else {
                            if ((i > 0 && boxJsonArray[i - 1].mark == boxJsonArray[i].mark) && (i > 0 && boxJsonArray[i - 1].name == boxJsonArray[i].name) && (i > 0 && boxJsonArray[i - 1].type == "txt")) {
                                newTalk = `<div class="dc">
                            <div class="roleOverall" data-names="${boxJsonArray[i].name}" data-name="${boxJsonArray[i].mark}" data-index="${boxJsonArray[i].index}">
                              <div class="divImg">
                                <div class="xvb replaceAvatar"></div>
                                <img src="${boxJsonArray[i].base64.indexOf(a) >= 0 ? dataURItoBlob(boxJsonArray[i].base64) : boxJsonArray[i].path}" crossorigin="anonymous" alt="" class="roleImg width0" srcset="">
                              </div>
                              <div class="roleTb"><span class="roleNameSpan width0">${boxJsonArray[i].name} </span>
                                <div class="roleRemarkDivs">
                                  <div class="horn width0"></div>
                                  <div class="roleRemarkDiv2 roleRemarkDiv">
                                    <div class="roleRemarkDivSpan statistics" data-index="${boxJsonArray[i].index}" contenteditable="true">${boxJsonArray[i].content}</div>
                                  </div>
                                  <div class="chooseDiv">
                            <input type="checkbox" name="iptChoose" id="" class="iptChoose  ipt">
                          </div>
                                </div>
                              </div>
                            </div>
                          </div>`;
                            } else {
                                newTalk = `<div class="dc">
                        <div class="roleOverall roleOverallTopMargin" data-names="${boxJsonArray[i].name}" data-name="${boxJsonArray[i].mark}" data-index="${boxJsonArray[i].index}">
                          <div class="divImg">
                            <div class="xvb"></div>
                            <img src="${boxJsonArray[i].base64.indexOf(a) >= 0 ? dataURItoBlob(boxJsonArray[i].base64) : boxJsonArray[i].path}" crossorigin="anonymous" alt="" class="roleImg" srcset="">
                          </div>
                          <div class="roleTb"><span class="roleNameSpan">${boxJsonArray[i].name} </span>
                            <div class="roleRemarkDivs">
                              <div class="horn"></div>
                              <div class="roleRemarkDiv2 roleRemarkDiv">
                                <div class="roleRemarkDivSpan statistics" data-index="${boxJsonArray[i].index}" contenteditable="true">${boxJsonArray[i].content}</div>
                              </div>
                              <div class="chooseDiv">
                            <input type="checkbox" name="iptChoose" id="" class="iptChoose  ipt">
                          </div>
                            </div>
                          </div>
                        </div>
                      </div>`;
                            }
                        }
                        html = html + newTalk;
                        break;
                    case 'aside':
                        newTalk = "<div class='dc'><div class='pangbaiDiv ' data-index=" + boxJsonArray[i].index + " data-name=" + boxJsonArray[i].mark + "><span class='pangbaiSpan statistics' contenteditable='true' data-index=" + boxJsonArray[i].index + " >" + boxJsonArray[i].content + "</span></div></div>";
                        html = html + newTalk;
                        break;
                    case 'reply':
                        newTalk = `<div class="dc"><div class='eventContainerReply' data-index='${boxJsonArray[i].index}' data-name='${boxJsonArray[i].mark}'>
                    <div class='eTopTitle'>
                      <div class='colorBlue'></div>
                      <div class='eTitle'>回复</div>
                    </div>
                    <div class='eLine'></div>
                    <div class='eContentBlue statistics' contenteditable='true' data-index='${boxJsonArray[i].index}' >${boxJsonArray[i].content}</div>
                  </div></div>`;
                        html = html + newTalk;
                        break;
                    case 'love':
                        newTalk = `<div class="dc"><div class='eventContainerLove' data-index='${boxJsonArray[i].index}' data-name='${boxJsonArray[i].mark}'>
                    <div class='eTopTitle'>
                      <div class='colorRed'></div>
                      <div class='eTitle'>羁绊事件</div>
                    </div>
                    <div class='eLine'></div>
                    <div class='eContentRed statistics' contenteditable='true' data-index='${boxJsonArray[i].index}' >${boxJsonArray[i].content}</div>
                  </div></div>`;
                        html = html + newTalk;
                        break;
                }
            }
            $('#box').html(html);
            ToBtm();
        })
    }

    //重置角色名称
    $("#ReName").click(function () {
        var a = confirm("确定要重置全部角色名称吗？");
        if (a) {
            deleteRoleCopy().then(res => {
                window.location.reload();
            })

        }
    });
    /**
     * 将localstrong中的存档转入indexdb，临时使用，下个版本废弃
     */
    function localUpdateIndexDb() {
        var json = JSON.parse(localStorage.getItem("boxJson"));
        if (json != "" && json != null) {
            LocalMigrate(json).then(res => {
                localStorage.clear();
            })
        }

    }
    //跳转到新网址
    function toNewPath() {
        var url = window.location.href;
        //console.log(url);
        if (url.indexOf("gugutack.com") == -1) {
            if (confirm("是否跳转新站点，当前数据无法保存")) {
                window.location.replace("http://gugutack.com/index.html")
            }

        }
    }

    //初始化数据
    function Init() {
<<<<<<< HEAD
        toNewPath();
        if (localStorage.getItem("delete") == null) {
            localStorage.clear();
            localStorage.setItem("delete", "1");
            window.location.reload();
        }

=======
         toNewPath();
        localUpdateIndexDb()
>>>>>>> b91922a (新增存档功能)
        $("#knopiji").html('');
        $.getJSON("data/roles.json", function (data) {
            $.getJSON("data/imagese.json", function (dataImg) {
                data.forEach(item => {
                    item.imgURl = 'images/roleImages/' + item.imgURl + '.png';
                    item.belongsImgURL = 'images/roleImages/' + item.belongsImgURL + '.webp';
                    item.open = false;
                    item.avatarArray = '';
                });
                createRoleArrayCopy(data).then(res => {
                    // for (let index = 0; index < res.length; index++) {
                    //     if (res[index].description == "newRole") {
                    //         res[index].imgURl = dataURItoBlob(res[index].imgURl);
                    //     }
                    // }
                    roleArray = res;
                    //循环展示角色
                    var html = '';
                    var b = '';
                    var Aa = `<div class='centerRoleArraybtn n'>`;
                    var aa = `</div>`;
                    for (let index = 0; index < roleArray.length; index++) {
                        $(".center").append("<div class='sonbsc'><div class='xq' data-id='" + roleArray[index].id + "'><div class='wwww'><img crossOrigin='anonymous' src='" + roleArray[index].imgURl + "' alt='' height=75px; width=75px; class='sdad'><span class='roleName'>" + roleArray[index].roleName + "</span><a href='javascript:;' class='adb'><img src='images/updateName.png' class='updateName' alt='' srcset=''></a></div><img src='" + roleArray[index].belongsImgURL + "' class='ddddddddddd' alt='' srcset=''></div></div>")
                        var roleImgs = new Array();
                        var b = "";
                        if (roleArray[index].description == "newRole") {
                            var obj = {
                                choose: false,
                                id: roleArray[index].id,
                                imagePath: roleArray[index].imgURl,
                                imgName: roleArray[index].roleName,
                                mark: roleArray[index].roleName,
                                path: roleArray[index].imgURl,

                            }
                            roleImgs.push(obj)
                            b += `<img data-mark="${obj.mark}" class='conImg imgb' data-imgid='${obj.id}'  data-roleId='${obj.roleId}' data-open='${obj.choose}' title='${obj.imgName}' src=' ${obj.path}' crossOrigin='anonymous' alt='' srcset=''>`
                        } else {
                            dataImg.forEach(item => {
                                if (item.roleId == roleArray[index].id) {
                                    item.mark = item.imagePath;
                                    item.path = 'images/roleImages/' + item.imagePath + '.png';
                                    item.choose = false;
                                    roleImgs.push(item);
                                    b += `<img data-mark="${item.mark}" class='conImg imgb' data-imgid='${item.id}'  data-roleId='${item.roleId}' data-open='${item.choose}' title='${item.imgName}' src=' ${item.path}' crossOrigin='anonymous' alt='' srcset=''>`

                                }
                            });
                        }
                        html += `<div class='sonbsc'><div class='xq' data-id='${roleArray[index].id}'><div class='wwww'><img crossOrigin='anonymous' src='${roleArray[index].imgURl}' alt='' height=75px; width=75px; class='sdad'><span class='roleName'>${roleArray[index].roleName}</span><a href='javascript:;' class='adb'><img src='images/updateName.png' class='updateName' alt='' srcset=''></a></div><img src='${roleArray[index].belongsImgURL}' class='ddddddddddd' alt='' srcset=''></div>${Aa}${b}${aa}</div>`;
                        roleArray[index].avatarArray = roleImgs;
                    }
                    //console.log(roleArray);
                    $("#knopiji").html(html);
                })
            });
        }
        );
        ExpressionInit(1);
        getTempJson().then(res => {
            if (res != null && res != '') {
                loadBoxData();

            }
        });
    }
    //点击选取头像加入到下方准备
    $("#knopiji").on('click', '.conImg', function (e) {
        $(this).toggleClass("imgb bj");
        if ($(this).parent().children().is(".bj")) {
            $(this).parent().siblings(".xq").addClass("qx");
        } else {
            $(this).parent().siblings(".xq").removeClass("qx");
        }
        roleAvatarClick($(this));
        e.stopPropagation();
    })
    //删除自定义角色事件
    $("#knopiji").on('click', '.ddddddddddd', function (e) {
        var id = $(this).parents().filter(".xq").data("id");
        for (let index = 0; index < roleArray.length; index++) {
            if (roleArray[index].description == 'newRole' && roleArray[index].id == id) {
                deleteRole(roleArray[index].id, e);
                break;
            }
        }

    })
    //点击展开角色头像
    $("#knopiji").on('click', '.xq', function (e) {
        var dom = $(this).next();
        var id = $(this).data("id");
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
    })
    /**
     * 修改对话
     */
    $("#knopiji").on('click', '.updateName', function (e) {
        updateName(this, e);
        e.stopPropagation();
    })
    //重置选中角色头像
    function ReCheckAvatar() {
        var avatars = $("img[class*='imgd']");
        for (let index = 0; index < avatars.length; index++) {
            $(avatars[index]).attr('class', 'conAvataar zz');
        }
    }
    //修改角色名字
    function updateName(d, e) {
        var newName = prompt('请输入新名称');
        if (newName !== null && newName != ' ') {
            var id = $(d).parent().parent().parent().data("id");
            var copyList = roleArray;
            for (let index = 0; index < copyList.length; index++) {
                if (copyList[index].id == id) {
                    copyList[index].roleName = newName;
                    updateRoleName(id, newName).then(res => {
                        $(d).parent().siblings("span").html(newName)
                    })
                    ReCheckAvatar();
                    break;
                }
            }
        }
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
            newTalk = createHtml(json)
            insertOrContinue(newTalk, json);
        } else {
            json.roleId = chooseAvatar.roleId,
                json.imgId = chooseAvatar.imgId,
                json.path = chooseAvatar.path,
                json.name = chooseAvatar.name,
                json.content = imgObj;
            json.mark = chooseAvatar.mark;
            json.base64 = chooseAvatar.roleId == "undefined" ? chooseAvatar.path : getBase64(chooseAvatar.roleId);
            newTalk = createHtml(json)
            insertOrContinue(newTalk, json);
        }
        cen++;
        closeExpression()
    }
    //动态添加点击事件 弃用
    // function roleArrayClick(id, index, e) {
    //     var dom = $(".center").children().eq(index).children().eq(1);
    //     roleArray.forEach(item => {
    //         if (item.id == id) {
    //             if (item.open) {
    //                 item.open = false
    //                 dom.css("display", "none");
    //             } else {
    //                 item.open = true
    //                 dom.css("display", "flex");
    //             }
    //         }
    //     });

    //     roleArray.forEach(item => {
    //         if (item.avatarArray == '' && item.id == id) {
    //             $.getJSON("data/imagese.json", function (data) {
    //                 if (!$.isEmptyObject(data)) {
    //                     var roleImgs = new Array();
    //                     data.forEach(item => {
    //                         if (item.roleId == id) {
    //                             item.mark = item.imagePath;
    //                             item.path = 'images/roleImages/' + item.imagePath + '.png';
    //                             item.choose = false;
    //                             roleImgs.push(item);
    //                         }

    //                     });

    //                     //角色头像加入角色数组
    //                     roleArray.forEach(item => {
    //                         if (item.id == id && item.description == null) {
    //                             var a = new Object();
    //                             a.avatarList = roleImgs;
    //                             item.avatarArray = a;
    //                         }
    //                         //console.log(roleArray, "加入头像后的角色数组");
    //                         //拼接自定义角色
    //                         if (item.id == id && item.description == 'newRole') {
    //                             //console.log(item, "拼接");
    //                             var a = new Object();
    //                             var b = {
    //                                 path: item.imgURl,
    //                                 mark: item.roleName,
    //                                 choose: false,
    //                                 roleId: item.id
    //                             }
    //                             var array = new Array();
    //                             array.push(b);
    //                             roleImgs.push(b);
    //                             a.avatarList = array;
    //                             item.avatarArray = a;
    //                         }
    //                     });
    //                     //插入头像列表
    //                     $(".center").children().eq(index).append("<div class='centerRoleArraybtn'></div>")
    //                     for (let indexs = 0; indexs < roleImgs.length; indexs++) {
    //                         $(".center").children().eq(index).children().last("div").append("<img data-mark=" + roleImgs[indexs].mark + " class='conImg imgb' data-imgid='" + roleImgs[indexs].id + "'  data-roleId='" + roleImgs[indexs].roleId + "' data-open='" + roleImgs[indexs].choose + "' data-index='" + indexs + "' title='" + roleImgs[indexs].imgName + "' src='" + roleImgs[indexs].path + "' crossOrigin='anonymous' alt='' srcset=''>");
    //                         $(".center").children().eq(index).children().last("div").children().eq(indexs).click(function (e) {
    //                             //console.log("点击");
    //                             $(this).toggleClass("imgb bj");
    //                             if ($(this).parent().children().is(".bj")) {
    //                                 $(this).parent().siblings(".xq").addClass("qx");
    //                             } else {
    //                                 $(this).parent().siblings(".xq").removeClass("qx");
    //                             }
    //                             roleAvatarClick($(this));
    //                             e.stopPropagation();
    //                         })
    //                     }
    //                 } else {
    //                 }
    //             }
    //             );
    //         }
    //     });

    // }
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
                var list = roleArray;
                for (let i = 0; i < list.length; i++) {
                    if (list[i].id == obj.roleId || obj.roleId == "undefined") {
                        roleName = list[i].roleName;
                        break;
                    }
                }
                obj.mark = $(this).data('name');
                obj.name = roleName;
                chooseAvatar = obj;
                //console.log(obj);
            }
        })
    }
    /**
     * 通过id获取base64头像
     * @param {*} id 
     * @returns 
     */
    function getBase64(id) {
        var base64;
        json = roleArray;
        for (let index = 0; index < json.length; index++) {
            if (json[index].id == id) {
                base64 = json[index].imgURl;
                break;
            }

        }
        return base64;
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
    //删除当前gugutalk
    $('#delAll').click(function () {
        var a = $("div[class*='dc']");
        var b = $(":checked[type='checkbox']").parents(".dc");
        //console.log(b);
        if (b.length > 0) {
            if (confirm("确认要删除" + b.length + "条数据吗")) {
                b.each(function () {
                    for (let index = 0; index < boxJsonArray.length; index++) {
                        if ($(this).find(".roleOverall").data("index") == boxJsonArray[index].index) {
                            boxJsonArray.splice(index, 1);
                            break;
                        }
                    }
                })

                updateTempJson(boxJsonArray).then(res => {
                    loadBoxData();
                });

            }
        } else {
            if (a.length > 0) {
                var c = confirm("确认要全部删除吗？");
                if (c) {
                    $("#box").html('');
                    cen = 0
                    boxJsonArray = new Array()
                    deleteTempJson();
                }
            }
        }
    })
    //删除上一句
    $("#delOne").click(function () {
        var editOpen = $(".editOpen");
        var lastDc = $("#box").children().last();
        if (editOpen.length > 0) {
            for (let i = 0; i < boxJsonArray.length - 1; i++) {
                if (editOpen.prev().find(".roleOverall").data("index") == boxJsonArray[i].index) {
                    boxJsonArray.splice(i, 1);
                    break
                }
            }
            editOpen.prev().remove();

        } else {
            boxJsonArray.splice(boxJsonArray.length - 1, 1);
            lastDc.remove();
        }
        updateTempJson(boxJsonArray);
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
        var newTalk = '';
        var link = document.createElement("input");
        var jq = $(link);
        jq.attr({ "type": "file", "accept": "image/*" });
        jq.on("change", function () {
            json.index = cen;
            json.type = "img"
            var imgP = $(this);
            var imgObj = imgP[0].files[0];
            var newImg;
            //压缩图片
            compressImg(imgObj, 0.2).then(res => {
                newImg = res.afterSrc;
                var url = newImg;
                if (value == 9999) {
                    json.roleId = 9999;
                    json.mark = '9999';
                    json.content = url;
                    newTalk = createHtml(json)
                    insertOrContinue(newTalk, json);
                } else {
                    json.roleId = chooseAvatar.roleId;
                    json.imgId = chooseAvatar.imgId;
                    json.path = chooseAvatar.path;
                    json.name = chooseAvatar.name;
                    json.mark = chooseAvatar.mark;
                    json.base64 = chooseAvatar.roleId == "undefined" ? chooseAvatar.path : getBase64(chooseAvatar.roleId);
                    json.content = url;
                    newTalk = createHtml(json)
                    insertOrContinue(newTalk, json);
                }
                cen++;

            })
        })
        jq.click();
    })
    /**
     * 截图保存
     */
    $("#save").click(function () {
        var scrollHeight = $('#box').prop("scrollHeight") + 20;
        $(".iptChoose").addClass("chooseNone");
        $(".iptChooseYHZ").addClass("chooseNone");
        $("[type='checkbox']").prop("checked", false);
        $(".dc").removeClass("editOpen");//document.getElementById('box')
        domtoimage.toPng($("#box")[0], { quality: 1, height: scrollHeight })
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'gugutalk.png';
                link.href = dataUrl;
                link.click();
                $(".iptChoose").removeClass("chooseNone");
                $(".iptChooseYHZ").removeClass("chooseNone");
            });
    })
    /**
     * 检测是否已展开存档列表，展开则刷新
     */
    function reLoadLeftArchive() {
        if ($(".sonbsc").length <= 0) {
            LoadArchive($("#knopiji"), 2)
        }
    }
    //创建新系列
    $(".newArchive").click(function () {
        Archive().then(res => {
            LoadArchive($(".oldArchive"), 1)
            reLoadLeftArchive();
        })
    })
    //点击存档按钮打开存档页面
    $("#ArchiveSave").click(function () {
        LoadArchive($(".oldArchive"), 1);
        $(".archiveList").toggleClass("n");
    })
    //点击展开角色列表
    $("#RoleList").click(function () {
        Init();
    })
    //点击展开一级存档列表
    $("#ArchiveList").click(function () {
        LoadArchive($("#knopiji"), 2)
    })
    //点击展开二级存档
    $("#knopiji").on('click', '.AL-ArchiveOne', function (e) {
        $(this).parents().filter(".AL-Series").find(".AL-OneChildList").toggleClass("n");
        e.stopPropagation();
    })
    //点击读取存档
    $("#knopiji").on('click', '.dxx', function (e) {
        var id = $(this).find(".AL-imgTools").data("id");
        var cid = $(this).find(".AL-imgTools").data("cid");
        var title = $(this).find(".word-wrap").html();
        //console.log(id,cid,title);
        if (confirm("是否读取" + title)) {
            updateArchive(id, cid).then(res => {
                loadBoxData();
            })
        }

        e.stopPropagation();
    })
    //点击关闭存档
    $(".archiveGb").click(function () {
        $(this).parents().filter(".archiveList").toggleClass("n");
    })
    //点击修改标题
    $("#knopiji").on('click', '.AL-updateTitle', function (e) {
        var title = $(this).parents().filter(".AL-TitleDiv").find(".AL-Title").html();
        var id = $(this).parent().data("id");
        var cid = $(this).parent().data("cid");
        var newTitle = prompt("修改标题《" + title + "》为");
        if (newTitle != null && newTitle != "") {
            if (id == cid)
                updateTitle(id, newTitle).then(res => {
                    $(this).parents().filter(".AL-TitleDiv").find(".AL-Title").html(newTitle);
                })
            else
                updateTitle(id, newTitle, cid).then(res => {
                    $(this).parents().filter(".AL-TitleDiv").find(".AL-Title").html(newTitle);
                });
        }
        e.stopPropagation();
    })
    //删除存档
    $("#knopiji").on('click', '.AL-deleteArchive', function (e) {
        var id = $(this).parent().data("id");
        var cid = $(this).parent().data("cid");
        var title = $(this).parents().filter(".AL-TitleDiv").find(".AL-Title").html();
        if (id == cid) {
            if (confirm("是否删除《" + title + "》系列")) {
                deleteBoxArrayById(id).then(res => {
                    LoadArchive($("#knopiji"), 2);
                })
            }
        } else {
            if (confirm("是否删除《" + title + "》该存档")) {
                deleteBoxArrayChild(id, cid).then(res => {
                    LoadArchive($("#knopiji"), 2);
                })
            }
        }
        e.stopPropagation();
    })
    //存档页面点击系列展开存档
    $(".oldArchive").on('click', '.AL-ArchiveOne', function () {
        $(this).siblings().filter(".AL-OneChildList").toggleClass("n");
    })
    //存档页面根据id插入存档
    $(".oldArchive").on('click', '.AL-insertSeries', function (e) {
        var id = $(this).parent().data("id");
        var title = $(this).parents().filter(".AL-TitleDiv").find(".AL-Title").html();
        if ($(".dc").length > 0) {
            if (confirm("是否将当前gugutalk插入《" + title + "》系列")) {
                var newtitle = prompt("请输入标题,为空则生成默认标题");
                insertArchive(id, newtitle).then(res => {
                    $(this).parents().filter(".AL-Series").find(".AL-OneChildList").append(`<div class="AL-TitleDiv">
                <div class="AL-Title word-wrap mhhh">${res.ctitle}</div>
                <div class="AL-imgTools" data-id="${res.id}" data-cid="${res.cid}">
                <img src="/images/replace.png" alt="" srcset="" class="AL-replaceArchive">
                </div>
              </div>`)
                    reLoadLeftArchive()
                });

            }
        }
        e.stopPropagation();
    })
    //存档页面替换存档按钮
    $(".oldArchive").on('click', '.AL-replaceArchive', function () {
        var id = $(this).parent().data("id");
        var cid = $(this).parent().data("cid");
        var title = $(this).parents().filter(".AL-TitleDiv").find(".AL-Title").html();
        if (confirm("是否使用当前gugutalk替换《" + title + "》存档")) {
            var newtitle = prompt("是否修改标题，为空则不修改");
            if (newtitle != null) {
                replaceArchive(id, cid, newtitle).then(res => {
                    reLoadLeftArchive()
                    $(this).parents().filter(".AL-TitleDiv").find(".mhhh").html(newtitle)
                });
                
            }

        }
    })
    /**
     * 加载存档
     * @param {*} obj jquery对象
     * @param {*} type 1:存档 2:展开存档列表
     */
    function LoadArchive(obj, type) {
        getBoxArray().then(res => {
            obj.html("");
            var html = "";
            switch (type) {
                case 1:
                    var a = "";
                    var tempB = `<div class="AL-OneChildList n">`
                    var tempA = `</div>`;
                    $.each(res, function (i, m) {
                        var b = "";
                        $.each(m.boxJsonArrays, function (t, n) {
                            b += `<div class="AL-TitleDiv">
                            <div class="AL-Title word-wrap mhhh">${n.ctitle}</div>
                            <div class="AL-imgTools" data-id="${m.id}" data-cid="${n.cid}">
                            <img src="/images/replace.png" alt="" srcset="" class="AL-replaceArchive">
                            </div>
                          </div>`;
                        })
                        var c = `<div class="AL-ArchiveOne">
                        <div class="AL-TitleDiv">
                          <div class="AL-Title mhh">${m.title}</div>
                          <div class="AL-imgTools" data-id="${m.id}" data-cid="${m.id}">
                          <img src="/images/insert.png" alt="" srcset="" class="AL-insertSeries">
                          </div>
                        </div>
                      </div>`
                        a += `<div class="AL-Series">` + c + tempB + b + tempA + `</div>`;
                    })
                    obj.html(a);
                    return;
                    break;
                case 2:
                    var a = "";
                    var tempB = `<div class="AL-OneChildList n">`
                    var tempA = `</div>`;
                    $.each(res, function (i, m) {
                        var b = "";
                        $.each(m.boxJsonArrays, function (t, n) {
                            b += `<div class="AL-TitleDiv dxx">
                            <div class="AL-Title word-wrap">${n.ctitle}</div>
                            <div class="AL-imgTools" data-id="${m.id}" data-cid="${n.cid}">
                              <img src="/images/updateName.png" alt="" srcset="" class="AL-updateTitle">
                              <img src="/images/gb.png" alt="" srcset="" class="AL-deleteArchive">
                            </div>
                          </div>`;
                        })
                        var c = `<div class="AL-ArchiveOne">
                        <div class="AL-TitleDiv">
                          <div class="AL-Title">${m.title}</div>
                          <div class="AL-imgTools" data-id="${m.id}" data-cid="${m.id}">
                            <img src="/images/updateName.png" alt="" srcset="" class="AL-updateTitle">
                            <img src="/images/gb.png" alt="" srcset="" class="AL-deleteArchive">
                          </div>
                        </div>
                      </div>`
                        a += `<div class="AL-Series">` + c + tempB + b + tempA + `</div>`;
                    })
                    obj.append(a);
                    return;
                    break;
                default:
                    break;
            }


        })
    }
    //图片压缩
    /**
 * 压缩方法 
 * @param {string} file 文件
 * @param {Number} quality  0~1之间
*/
    function compressImg(file, quality) {
        if (file[0]) {
            return Promise.all(Array.from(file).map(e => compressImg(e,
                quality))) // 如果是 file 数组返回 Promise 数组
        } else {
            return new Promise((resolve) => {
                const reader = new FileReader() // 创建 FileReader
                reader.onload = ({
                    target: {
                        result: src
                    }
                }) => {
                    const image = new Image() // 创建 img 元素
                    image.onload = async () => {
                        const canvas = document.createElement('canvas') // 创建 canvas 元素
                        canvas.width = image.width
                        canvas.height = image.height
                        canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height) // 绘制 canvas
                        const canvasURL = canvas.toDataURL('image/jpeg', quality)
                        const buffer = atob(canvasURL.split(',')[1])
                        let length = buffer.length
                        const bufferArray = new Uint8Array(new ArrayBuffer(length))
                        while (length--) {
                            bufferArray[length] = buffer.charCodeAt(length)
                        }
                        const miniFile = new File([bufferArray], file.name, {
                            type: 'image/jpeg'
                        })
                        resolve({
                            file: miniFile,
                            origin: file,
                            beforeSrc: src,
                            afterSrc: canvasURL,
                            beforeKB: Number((file.size / 1024).toFixed(2)),
                            afterKB: Number((miniFile.size / 1024).toFixed(2))
                        })
                    }
                    image.src = src
                }
                reader.readAsDataURL(file)
            })
        }
    }

    //全选
    $("#selectAll").click(function () {
        selectAllOrReSelectAll(1);
    })
    //反选
    $("#reSelectAll").click(function () {
        selectAllOrReSelectAll(2);
    })
    /**
     * 选择方式
     * @param {*} type 1:全选 2反选
     */
    function selectAllOrReSelectAll(type) {
        var selectBox = $(":checked[type='checkbox']");
        var allBox = $("[type='checkbox']");
        var noSelectBox = $("[type='checkbox']:not(:checked)")
        switch (type) {
            case 1:
                if (selectBox.length == allBox.length) {
                    selectBox.prop("checked", false)
                    $(".dc").removeClass("editOpen");

                } else {
                    allBox.prop("checked", true)
                    $("#box>.dc:first").addClass("editOpen").siblings().removeClass("editOpen");
                }

                break;
            case 2:
                allBox.each(function () {
                    $(this).click();
                })
                break;
            default:
                break;
        }
    }
    //创建角色
    $("#newRole").click(function () {
        var roleName = prompt("请输入角色姓名", "");
        if (roleName != null && roleName != '') {
            var link = document.createElement("input");
            var jq = $(link);
            jq.attr({ "type": "file", "accept": "image/*" });
            jq.on("change", function () {
                var json = new Object();
                var imgP = $(this);
                var imgObj = imgP[0].files[0];
                compressImg(imgObj, 0.2).then(res => {//compressImg方法见附录
                    var url = res.afterSrc;
                    json.id = parseInt(getNowTime());
                    json.roleName = roleName;
                    json.description = "newRole";
                    json.imgURl = url;
                    newRoleSave(json);

                })
            })
        }
        jq.click();
    })
    //保存新建角色
    function newRoleSave(ele) {
        ele.belongsImgURL = 'images/gb.png';
        roleArray.unshift(ele);
        createNewRoleArray(ele);
        window.location.reload();
    }
    //删除自定义角色
    function deleteRole(id, e) {
        var c = confirm("确认要删除吗？");
        if (c) {
            var json = roleArray;
            var newJson = new Array();
            for (let i = 0; i < json.length; i++) {
                if (json[i].id != id) {
                    newJson.push(json[i]);
                }
            }
            deleteNewRoleById(id);
            window.location.reload();
        }

        e.stopPropagation();
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
        $('.Gallery').toggleClass('n');
    })
    //打开/关闭设置列表
    $("#updateSet").click(function () {
        $('.Gallery').toggleClass('n');
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
        addTalk(boxJsonArray, json);
    }
    function selectJson() {

    }
    //计算字节长度-弃用
    // function getLength() {
    //     if (localStorage.getItem('boxJson') != null && localStorage.getItem('boxJson') != '') {
    //         var str = localStorage.getItem('boxJson');
    //         var length = localStorage.getItem('boxJson').length;
    //         var init = length;
    //         for (var i = 0; i < init; i++) {
    //             if (str.charCodeAt(i) > 255) {
    //                 length++;
    //             }
    //         }
    //         var strLength = length;
    //         var changdu = parseFloat(strLength / 1000).toFixed(2) > 1000 ? parseFloat(strLength / 1000000).toFixed(2) + "MB" : parseFloat(strLength / 1000).toFixed(2) + "KB";
    //         $('.stringLength').html(changdu);
    //     }
    // }
    /**
     * 实时修改聊天记录
     * @param {*} index 
     * @param {*} text 
     */
    function updateBoxOne(index, text) {
        for (let i = 0; i < boxJsonArray.length; i++) {
            if (boxJsonArray[i].index == index) {
                boxJsonArray[i].content = text;
                break;
            }

        }
        updateTempJson(boxJsonArray, index, text).then(res => {

        });
    }
    //点击显示/隐藏头像和名字
    $("#box").on('click', '.divImg', function (e) {

        ShowOrHidden($(this), e);
    })
    //抽出头像显示隐藏方法
    //点击头像
    function ShowOrHidden(obj, e) {
        var tNs = obj.parents().filter(".dc").prev().find(".roleOverall").data("names");
        var tN = obj.parents().filter(".dc").prev().find(".roleOverall").data("name");
        var bNs = obj.parents().filter(".roleOverall").data("names");
        var bN = obj.parents().filter(".roleOverall").data("name");
        var index = obj.parents().filter(".roleOverall").data("index")
        if (tNs == bNs && bN == tN) {
            if (obj.find("img").is(".width0")) {
                obj.find('.xvb').removeClass("replaceAvatar");
                obj.find('.roleImg').removeClass("width0");
                obj.next().find(".roleNameSpan").removeClass("width0");
                obj.next().find(".horn").removeClass("width0");
                obj.parents().filter(".roleOverall").addClass("roleOverallTopMargin");
            } else {
                obj.find('.roleImg').addClass("width0");
                obj.find(".xvb").addClass("replaceAvatar");
                obj.next().find(".roleNameSpan").addClass("width0");
                obj.next().find(".horn").addClass("width0");
                obj.parents().filter(".roleOverall").removeClass("roleOverallTopMargin");
            }

        }
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

    //选中对话触发横线
    $("#box").on('click', '.ipt', function (e) {
        var list = $(":checked[type='checkbox']")
        var that = $(this);
        for (let index = 0; index < $(".ipt").length; index++) {
            if ($(list[index]).is(":checked")) {
                $(list[index]).parents(".dc").addClass("editOpen").siblings().removeClass("editOpen");
                break;
            }
        }
        if ($(this).is(":checked") != true && $(":checked[type='checkbox']").length < 1) {
            $(".dc").removeClass("editOpen");
        }
    })
    //////////////////////小屏幕时触发事件////////////////////////////
    //点击显示/关闭左侧工具栏
    $(".topimg").click(function () {
        $(".left").css("display") == 'flex' ?
            $(".left").css("display", "none") :
            $(".left").css("display", "flex")
    })
    //点击显示/关闭角色列表
    $(".bxhjc").click(function () {
        // if ($(".center").css("width") == '0') {

        if ($(".right").css("display") == "none") {
            $(".right").css({
                "width": "100%",
                "transition": "width 0.5s",
                "display": "flex"
            });
            $(".center").css({
                "width": "0",
                "transition": "width 0.5s",
                "display": "none"
            });
        } else {
            $(".center").css({
                "width": "100%",
                "transition": "width 0.5s",
                "display": "flex"
            });
            $(".right").css({
                "width": "0",
                "transition": "width 0.5s",
                "display": "none"
            });
        }
    })
});
