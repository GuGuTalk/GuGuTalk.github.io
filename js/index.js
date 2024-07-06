$().ready(function () {
    var roleArray;
    var roleImgArray = new Array();
    var chooseAvatar = {
        roleId: 9999
        //roleId
        //imgId
        //path
        //roleName
    };
    var imgScale = 1;
    var uploadImg_scale = 0.2;
    var boxJsonArray = new Array();
    var cen = 0;
    var kqOptions = {
        isYHZ: false
    }
    var roleObj = {
        type: "img",
        index: 5,
        //content: 1,
        roleId: 1,
        imgId: 3,
        name: "米雪儿",
        mark: "mxr_sf",
        base64: "",
        path: " images/roleImages/mxr_sf.png",
        rtx: "rtx"
    }
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

    /**
     * 读取自定义设置
     */
    function LoadSetOptions() {
        //移动端访问
        var userAgent = navigator.userAgent;
        loadSetList().then(res => {
            if (res != undefined) {
                updateSetList(res);
            }

        })
        // 判断是否包含移动设备关键字，例如 "Android"、"iPhone"、"iPad" 等
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
            // 在移动端执行的代码
            console.log("移动端访问");
            $("#ALLPM").parent().addClass("n");
            $(".bodyN").addClass("margin0");
        } else {
            // 在非移动端执行的代码
            console.log("非移动端访问");
        }
    }
    //临时的导出存档
    $("#dccd").click(function () {
        getTempJson().then(res => {
            var blob = new Blob([JSON.stringify(res)], { type: "text/plain;charset=utf-8" });
            var link = document.createElement('a');
            link.download = '当前编辑内容';
            link.href = URL.createObjectURL(blob);
            link.click();
        })

    })
    //临时的导入存档
    $("#drcd").click(function () {
        var link = document.createElement("input");
        var jq = $(link);
        var reader = new FileReader();
        var imgObj;
        jq.attr({ "type": "file", "accept": "text/plain" });
        jq.on("change", function () {
            var imgP = $(this);
            imgObj = imgP[0].files[0];
            reader.onload = function (e) {
                var content = e.target.result;
                console.log(content);
                if (confirm("导入存档会导致当前编辑内容被替换，是否导入？")) {
                    if (content.indexOf("boxJson") >= 0) {
                        var json = JSON.parse(content);
                        LSupdateTempJson(json).then(res => {
                            loadBoxData();
                        })
                    } else {
                        alert("文件格式错误");
                    }


                }
            };
            reader.readAsText(imgObj);

        })

        jq.click();


    })
    //gugutalk边上的小提示
    $(".whDiv1").click(function () {
        alert(`部分浏览器无法保存生成的图片，目前已查明的有uc、夸克、小米自带浏览器，如果碰上无法保存图片的情况可以点击左侧工具栏的导出存档功能，在新的浏览器上导入存档，另外，导出的只是当前编辑内容，考虑到存档覆盖的问题全部存档的导出功能还在制作中`)
    })
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

        var base64;
        var avatars = $("img[class*='imgd']");
        var a = $("div[class*='roleOverall']");
        if (text != "") {
            json = getRoleJson("txt");
            console.log(json, "json");
            newTalk = createHtml(json)
            insertOrContinue(newTalk, json);
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
            var index = that.find(".gu").data("index");
            var previousArray = new Array();
            var afterArray = new Array();
            for (let i = 0; i < boxJsonArray.length; i++) {
                if (boxJsonArray[i].index == index) {
                    previousArray = boxJsonArray.slice(0, i);
                    previousArray.push(newObj);
                    afterArray = boxJsonArray.slice(i, boxJsonArray.length);
                    boxJsonArray = previousArray.concat(afterArray);
                    break;
                }
            }
            insertTalk(boxJsonArray).then(res => {
                // console.log(newObj,res);
                that.before(newTalk);
            })
        }
        $("#text").val("");
        cen++;
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
        var editOpen = $(".editOpen").prev().find('.gu');
        var lastDc = $("#box").children().last(".dc").find('.gu');
        var tdc;
        listOne.rtx = "";
        if ($(".imgd").length <= 0 && kqOptions.isYHZ) {
            listOne = roleObj
        }
        //var replyTdc;
        if ($(".editOpen").length == 0) {
            type = 1;
            tdc = lastDc;
            //replyTdc = replylastDc;

        } else {
            type = 2;
            tdc = editOpen;
            //replyTdc = replyEditOpen;
        }
        var html = '';
        var a = 'data:image'
        switch (listOne.type) {
            case 'Expression':
                if (listOne.rtx == "rtx") {
                    if (((tdc.data("name") == listOne.mark) && (tdc.data("names") == listOne.name)) && tdc.data("isYhz")) {
                        newTalk = `<div class="dc">
                        <div data-type="${listOne.type}" data-isYhz="true" data-index="${listOne.index}" data-names="${listOne.name}" data-name="${listOne.mark}" class="gu roleOverall rightRoleOverallr">
                          <div class="dfsdfYHZ">
                            <div class="chooseDivYHZ">
                              <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ ipt">
                            </div>
                          </div>
                          <div class="divImg">
                            <div class="xvb replaceAvatar"></div>
                            <img src="${listOne.base64.indexOf(a) >= 0 ? dataURItoBlob(listOne.base64) : listOne.path}" crossorigin="anonymous" alt="" class="roleImg width0" srcset="">
                          </div>
                          <div class="dfsiohbdu">
                            <div class="Righthorn gfuyfhf qp qpW"></div>
                            <div class="yr">
                              <div class="yt">
                                <div class="yhzName roleNameSpan width0">${listOne.name}</div>
                              </div>
                              <div class="yb">
                                <img src="${listOne.content}" alt="" srcset="" class="rightImgExpression">
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>`;
                    } else {
                        newTalk = `<div class="dc">
                        <div data-type="${listOne.type}" data-isYhz="true" data-index="${listOne.index}" data-names="${listOne.name}" data-name="${listOne.mark}" class="gu roleOverall rightRoleOverall roleOverallTopMargin">
                          <div class="dfsdfYHZ">
                            <div class="chooseDivYHZ">
                              <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ ipt">
                            </div>
                          </div>
                          <div class="divImg">
                            <div class="xvb"></div>
                            <img src="${listOne.base64.indexOf(a) >= 0 ? dataURItoBlob(listOne.base64) : listOne.path}" crossorigin="anonymous" alt="" class="roleImg" srcset="">
                          </div>
                          <div class="dfsiohbdu">
                            <div class="Righthorn gfuyfhf qp qpW"></div>
                            <div class="yr">
                              <div class="yt">
                                <div class="yhzName roleNameSpan ">${listOne.name}</div>
                              </div>
                              <div class="yb">
                                <img src="${listOne.content}" alt="" srcset="" class="rightImgExpression">
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>`;
                    }
                } else {

                    if (listOne.roleId == 9999) {
                        if ((tdc.data("name") == listOne.mark)) {
                            newTalk = `<div class="dc"><div class="gu roleOverall rightRoleOverall " data-type="${listOne.type}" data-index="${listOne.index}" data-name="${listOne.mark}">
                            <div class="dfsdfYHZ">
                              <div class="chooseDivYHZ">
                                <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ ipt">
                              </div>
                              <img src="${listOne.content}" alt="" srcset="" class="rightImgExpression udiohsfnds">
                            </div>
                          </div></div>`;
                            newTalk = `<div class="dc"><div class="gu roleOverall rightRoleOverall " data-type="${listOne.type}" data-index="${listOne.index}" data-name="${listOne.mark}">
                  <div class="dfsdfYHZ">
                    <div class="chooseDivYHZ">
                      <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ ipt">
                    </div>
                    <img src="${listOne.content}" alt="" srcset="" class="rightImgExpression udiohsfnds">
                  </div>
                </div></div>`;
                        } else {
                            newTalk = `<div class="dc roleOverallTopMargin"><div class="gu roleOverall rightRoleOverall  " data-type="${listOne.type}" data-index="${listOne.index}" data-name="${listOne.mark}">
                            <div class="dfsdfYHZ">
                              <div class="chooseDivYHZ">
                                <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ ipt">
                              </div>
                              <img src="${listOne.content}" alt="" srcset="" class="rightImgExpression udiohsfnds">
                            </div>
                          </div></div>`;
                        }

                    } else {
                        //表情后面的文字不隐藏头像，所以去掉data-name="${listOne.mark}" 
                        if ((tdc.data("name") == listOne.mark) && (tdc.data("names") == listOne.name)) {
                            newTalk = `<div class="dc">
                            <div class="gu roleOverall" data-type="${listOne.type}" data-names="${listOne.name}" data-index="${listOne.index}">
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
                            <div class="gu roleOverall roleOverallTopMargin" data-type="${listOne.type}" data-name="${listOne.mark}" data-index="${listOne.index}">
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
                }

                html = html + newTalk;
                break;
            case 'img':
                //开启右侧头像
                if (listOne.rtx == "rtx") {
                    if ((tdc.data("name") == listOne.mark) && (tdc.data("names") == listOne.name)) {
                        newTalk = `<div class="dc">
                    <div data-index="${listOne.index}" data-type="${listOne.type}" data-name="${listOne.mark}" class="gu roleOverall rightRoleOverall">
                      <div class="dfsdfYHZ">
                        <div class="chooseDivYHZ">
                          <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ ipt">
                        </div>
                      </div>
                      <div class="divImg">
                        <div class="xvb replaceAvatar"></div>
                        <img src="${listOne.base64.indexOf(a) >= 0 ? dataURItoBlob(listOne.base64) : listOne.path}" crossorigin="anonymous" alt="" class="roleImg width0" srcset="">
                      </div>
                      <div class="dfsiohbdu">
                        <div class="yr">
                          <div class="yt">
                            <div class="yhzName roleNameSpan marginRight1 width0">${listOne.name}</div>
                          </div>
                          <div class="yb">
                            <!-- <img src="images/Expression/10005.png" alt="" srcset="" class="rightImgExpression"> -->
                            <div class="Righthorn qp qpW"></div>
                            <img src="${dataURItoBlob(listOne.content)}" alt="" srcset="" class="rightImg rightImg1">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>`

                    } else {
                        newTalk = `<div class="dc">
                        <div data-index="${listOne.index}" data-type="${listOne.type}" data-name="${listOne.mark}"  class="gu roleOverall rightRoleOverall roleOverallTopMargin">
                          <div class="dfsdfYHZ">
                            <div class="chooseDivYHZ">
                              <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ ipt">
                            </div>
                          </div>
                          <div class="divImg">
                            <div class="xvb"></div>
                            <img src="${listOne.base64.indexOf(a) >= 0 ? dataURItoBlob(listOne.base64) : listOne.path}" crossorigin="anonymous" alt="" class="roleImg" srcset="">
                          </div>
                          <div class="dfsiohbdu">
                            <div class="yr">
                              <div class="yt">
                                <div class="yhzName roleNameSpan marginRight1">${listOne.name}</div>
                              </div>
                              <div class="yb">
                                <div class="Righthorn qp"></div>
                                <img src="${dataURItoBlob(listOne.content)}" alt="" srcset="" class="rightImg rightImg1">
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>`
                    }
                } else {
                    if (listOne.roleId == 9999) {
                        if ((tdc.data("name") == listOne.mark)) {
                            newTalk = `<div class="dc"><div data-index="${listOne.index}"data-type="${listOne.type}" data-name="${listOne.mark}" class="gu roleOverall rightRoleOverall ">
                    <div class="dfsdfYHZ">
                      <div class="chooseDivYHZ">
                        <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ  ipt">
                      </div>
                      <div class="Righthorn qp"></div>
                      <img src="${dataURItoBlob(listOne.content)}" alt="" srcset=""
                        class="rightImg rightImg1">
                    </div>
                  </div></div>`;
                        } else {
                            newTalk = `<div class="dc roleOverallTopMargin"><div data-index="${listOne.index}"data-type="${listOne.type}" data-name="${listOne.mark}" class="gu roleOverall rightRoleOverall ">
                    <div class="dfsdfYHZ">
                      <div class="chooseDivYHZ">
                        <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ  ipt">
                      </div>
                      <div class="Righthorn qp"></div>
                      <img src="${dataURItoBlob(listOne.content)}" alt="" srcset=""
                        class="rightImg rightImg1">
                    </div>
                  </div></div>`;
                        }

                    } else {
                        if ((tdc.data("name") == listOne.mark) && (tdc.data("names") == listOne.name)) {
                            newTalk = `<div class="dc">
                  <div class="gu roleOverall" data-names="${listOne.name}" data-type="${listOne.type}" data-name="${listOne.mark}" data-index="${listOne.index}">
                    <div class="divImg">
                      <div class="xvb replaceAvatar"></div>
                      <img src="${listOne.base64.indexOf(a) >= 0 ? dataURItoBlob(listOne.base64) : listOne.path}" crossorigin="anonymous" alt="" class="roleImg width0" srcset="">
                    </div>
                    <div class="roleTb"><span class="roleNameSpan width0">${listOne.name}</span>
                      <div class="roleRemarkDivImg">
                        <div class="horn qp qpW"></div><img src="${dataURItoBlob(listOne.content)}" alt="" srcset="" class="rightImg rightImg2">
                        <div class="chooseDiv">
                        <input type="checkbox" name="iptChoose" id="" class="iptChoose  ipt">
                      </div>
                      </div>
                    </div>
                  </div>
                </div>`;
                        } else {
                            newTalk = `<div class="dc">
                        <div class="gu roleOverall roleOverallTopMargin" data-names="${listOne.name}" data-type="${listOne.type}" data-name="${listOne.mark}" data-index="${listOne.index}">
                          <div class="divImg">
                            <div class="xvb"></div>
                            <img src="${listOne.base64.indexOf(a) >= 0 ? dataURItoBlob(listOne.base64) : listOne.path}" crossorigin="anonymous" alt="" class="roleImg" srcset="">
                          </div>
                          <div class="roleTb"><span class="roleNameSpan">${listOne.name}</span>
                            <div class="roleRemarkDivImg">
                              <div class="horn qp"></div><img src="${dataURItoBlob(listOne.content)}" alt="" srcset="" class="rightImg rightImg2">
                              <div class="chooseDiv">
                        <input type="checkbox" name="iptChoose" id="" class="iptChoose  ipt">
                      </div>
                            </div>
                          </div>
                        </div>
                      </div>`;
                        }
                    }
                }

                html = html + newTalk;
                break;
            case 'txt':
                //开启右侧头像
                console.log(listOne, 111);
                if (listOne.rtx == "rtx") {
                    console.log(tdc.data("name"), listOne.mark, listOne.name)
                    if ((tdc.data("name") == listOne.mark && tdc.data("names") == listOne.name) && tdc.data("isYhz")) {
                        newTalk = `<div class="dc">
                    <div data-index="${listOne.index}" data-isYhz="true" data-type="${listOne.type}" data-names="${listOne.name}" data-name="${listOne.mark}" class="gu roleOverall rightRoleOverallr">
                      <div class="dfsdfYHZ">
                        <div class="chooseDivYHZ">
                          <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ ipt">
                        </div>
                      </div>
                      <div class="divImg">
                        <div class="xvb replaceAvatar"></div>
                        <img src="${listOne.base64.indexOf(a) >= 0 ? dataURItoBlob(listOne.base64) : listOne.path}" crossorigin="anonymous" alt="" class="roleImg width0" srcset="">
                      </div>
                      <div class="dfsiohbdu ">
                        <div class="Righthorn gfuyfhf qp qpW"></div>
                        <div class="yr">
                          <div class="yt">
                            <div class="yhzName roleNameSpan width0">${listOne.name}</div>
                          </div>
                          <div class="yb">
                            <div class="roleRemarkDiv3r roleRemarkDiv">
                              <div class="roleRemarkDivSpan statistics" contenteditable="true" data-index="${listOne.index}">${listOne.content}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>`;
                    } else {
                        newTalk = `<div class="dc">
                    <div data-index="${listOne.index}" data-isYhz="true" data-type="${listOne.type}" data-names="${listOne.name}" data-name="${listOne.mark}" class="gu roleOverall rightRoleOverall roleOverallTopMargin">
                      <div class="dfsdfYHZ">
                        <div class="chooseDivYHZ">
                          <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ ipt">
                        </div>
                      </div>
                      <div class="divImg">
                        <div class="xvb"></div>
                        <img src="${listOne.base64.indexOf(a) >= 0 ? dataURItoBlob(listOne.base64) : listOne.path}" crossorigin="anonymous" alt="" class="roleImg" srcset="">
                      </div>
                      <div class="dfsiohbdu">
                        <div class="Righthorn gfuyfhf qp"></div>
                        <div class="yr">
                          <div class="yt">
                            <div class="yhzName roleNameSpan ">${listOne.name}</div>
                          </div>
                          <div class="yb">
                            <div class="roleRemarkDiv3r roleRemarkDiv">
                              <div class="roleRemarkDivSpan statistics" contenteditable="true" data-index="${listOne.index}">${listOne.content}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>`;
                    }
                } else {
                    if (listOne.roleId == 9999) {
                        if ((tdc.data("name") == listOne.mark)) {
                            newTalk = `<div class="dc"><div data-index="${listOne.index}" data-type="${listOne.type}" data-name="${listOne.mark}" class="gu roleOverall rightRoleOverall">
                    <div class="dfsdfYHZ width100">
                      <div class="chooseDivYHZ">
                        <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ  ipt">
                      </div>
                      <div class="Righthorn qp"></div>
                      <div class="roleRemarkDiv3 roleRemarkDiv">
                        <div class="roleRemarkDivSpan statistics" contenteditable="true" data-index="${listOne.index}">${listOne.content}</div>
                      </div>
                    </div>
                  </div></div>`;
                        } else {
                            newTalk = `<div class="dc roleOverallTopMargin"><div data-index="${listOne.index}" data-type="${listOne.type}" data-name="${listOne.mark}" class="gu roleOverall rightRoleOverall ">
                            <div class="dfsdfYHZ width100">
                              <div class="chooseDivYHZ">
                                <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ  ipt">
                              </div>
                              <div class="Righthorn qp"></div>
                              <div class="roleRemarkDiv3 roleRemarkDiv">
                                <div class="roleRemarkDivSpan statistics" contenteditable="true" data-index="${listOne.index}">${listOne.content}</div>
                              </div>
                            </div>
                          </div></div>`;
                        }

                    } else {

                        if ((tdc.data("name") == listOne.mark) && (tdc.data("names") == listOne.name)) {
                            newTalk = `<div class="dc">
                        <div class="gu roleOverall" data-names="${listOne.name}" data-type="${listOne.type}" data-name="${listOne.mark}" data-index="${listOne.index}">
                          <div class="divImg">
                            <div class="xvb replaceAvatar"></div>
                            <img src="${listOne.base64.indexOf(a) >= 0 ? dataURItoBlob(listOne.base64) : listOne.path}" crossorigin="anonymous" alt="" class="roleImg width0" srcset="">
                          </div>
                          <div class="roleTb"><span class="roleNameSpan width0">${listOne.name} </span>
                            <div class="roleRemarkDivs">
                              <div class="horn qp qpW "></div>
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
                    <div class="gu roleOverall roleOverallTopMargin" data-names="${listOne.name}" data-type="${listOne.type}" data-name="${listOne.mark}" data-index="${listOne.index}">
                      <div class="divImg">
                        <div class="xvb"></div>
                        <img src="${listOne.base64.indexOf(a) >= 0 ? dataURItoBlob(listOne.base64) : listOne.path}" crossorigin="anonymous" alt="" class="roleImg" srcset="">
                      </div>
                      <div class="roleTb"><span class="roleNameSpan">${listOne.name} </span>
                        <div class="roleRemarkDivs">
                          <div class="horn qp"></div>
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
                }

                html = html + newTalk;
                break;
            case 'aside':
                newTalk = `<div class="dc">
                <div class="replyDiv">
                  <div class="pangbaiDiv rla gu" data-type="${listOne.type}" data-index="${listOne.index}" data-name="${listOne.mark}"><span class="pangbaiSpan statistics"
                      contenteditable="true" data-index="${listOne.index}">${listOne.content}</span></div>
                  <div class="chooseDivYHZ">
                    <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ  ipt">
                  </div>
                </div>
              </div>`;
                html = html + newTalk;
                break;
            case 'reply':
                if (tdc.data("type") == listOne.type) {
                    newTalk = "";
                    tdc.append(`<div class='eContentBlue statistics' contenteditable='true' data-index='${listOne.index}' >${listOne.content}</div>`);
                } else {
                    newTalk = `<div class="dc">
                <div class="replyDiv">
                  <div class='eventContainerReply rla gu'  data-index='${listOne.index}' data-type="${listOne.type}" data-name='${listOne.mark}'>
                    <div class="eTopTitle">
                      <div class="colorBlue"></div>
                      <div class="eTitle">回复</div>
                    </div>
                    <div class="eLine"></div>
                    <div class="eContentBlue statistics" contenteditable="true" data-index="${listOne.index}">${listOne.content}</div>
                  </div>
                  <div class="chooseDivYHZ">
                    <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ  ipt">
                  </div>
                </div>
              </div>`;

                }

                html = html + newTalk;
                break;
            case 'love':
                newTalk = `<div class="dc">
                <div class="replyDiv">
                  <div class='eventContainerLove rla gu' data-type="${listOne.type}" data-index='${listOne.index}' data-name='${listOne.mark}'>
                    <div class="eTopTitle">
                      <div class="colorRed"></div>
                      <div class="eTitle">羁绊事件</div>
                    </div>
                    <div class="eLine"></div>
                    <div class="eContentRed statistics" contenteditable="true" data-index="${listOne.index}">${listOne.content}</div>
                  </div>
                  <div class="chooseDivYHZ">
                    <input type="checkbox" name="iptChoose" id="" class="iptChooseYHZ  ipt">
                  </div>
                </div>
              </div>`;
                html = html + newTalk;
                break;
            case 'Transfer':
                if (listOne.rtx == "rtx") {
                    if ((tdc.data("name") == listOne.mark) && (tdc.data("names") == listOne.name)) {
                        newTalk = ``;
                    } else {
                        newTalk = ``;
                    }
                } else {
                    if (listOne.roleId == 9999) {
                        newTalk = `<div class="dc">
                        <div class="zzDivd MarLeftAuto rightRoleOverall gu ${listOne.Transfer == "djs" ? "" : "opacity05"}" data-type="${listOne.type}" data-index='${listOne.index}' data-name='${listOne.mark}'>
                        <div class="ColorOrangeHornR"></div>  
                        <div class="zzDiv ">
                            <div class="zzDiv_top">
                              <div class="zt_divImg">
                                <img src="images/${listOne.Transfer == "djs" ? "z" : (listOne.Transfer == "gq" ? "g" : (listOne.Transfer == "bjs" ? "d" : "d"))}.png" class="zt_img" alt="" srcset="">
                              </div>
                              <div class="zt_font">
                              <div style="font-size: 1rem;" class="zt-price">￥<span>${listOne.content}</span></div>
                              <div style="font-size: 12px;" class="zt-desc">${listOne.Transfer == "djs" ? "等待确认" : (listOne.Transfer == "gq" ? "已过期" : (listOne.Transfer == "js" ? "已接收" : "已被接收"))}</div>
                              </div>
                              <div class="zt_cz">
                                <div class="zt_gq">过期</div>
                                <div class="zt_js">接收</div>
                                <div class="zt_djs">待接收</div>
                              </div>
                            </div>
                            <div class="zzDiv_bottom">卡丘转账</div>
                          </div>
                          
                        </div>
                      </div>`;
                        html = html + newTalk;
                    } else {
                        newTalk = `<div class="dc">
                            <div class="gu roleOverall roleOverallTopMargin" data-names="${listOne.name}" data-type="${listOne.type}"  data-index="${listOne.index}">
                              <div class="divImg">
                                <div class="xvb"></div>
                                <img src="${listOne.base64.indexOf(a) >= 0 ? dataURItoBlob(listOne.base64) : listOne.path}" crossorigin="anonymous" alt="" class="roleImg" srcset="">
                              </div>
                              <div class="roleTb"><span class="roleNameSpan">${listOne.name} </span>
                                <div class="roleRemarkDivs padNone">
                                <div class="zzDivd ${listOne.Transfer == "djs" ? "" : "opacity05"}">
                            <div class="ColorOrangeHorn qp"></div>
                            <div class="zzDiv">
                              <div class="zzDiv_top">
                                <div class="zt_divImg">
                                  <img src="images/${listOne.Transfer == "djs" ? "z" : (listOne.Transfer == "gq" ? "g" : (listOne.Transfer == "bjs" ? "d" : "d"))}.png" class="zt_img" alt="" srcset="">
                                </div>
                                <div class="zt_font">
                                <div  style="font-size: 1rem;" class="zt-price">￥<span>${listOne.content}</span></div>
                                  <div style="font-size: 12px;" class="zt-desc">${listOne.Transfer == "djs" ? "等待确认" : (listOne.Transfer == "gq" ? "已过期" : "已接收")}</div>
                                </div>
                                <div class="zt_cz">
                                  <div class="zt_gq">过期</div>
                                  <div class="zt_js">接收</div>
                                  <div class="zt_djs">等待确认</div>
                                </div>
      
                              </div>
                              <div class="zzDiv_bottom">卡丘转账</div>
                            </div>
                          </div>
                                  <div class="chooseDiv">
                                <input type="checkbox" name="iptChoose" id="" class="iptChoose  ipt">
                              </div>
                                </div>
                              </div>
                            </div>
                          </div>`;
                        html = html + newTalk;
                    }
                }
                break;
        }
        return html;
    }
    /**
     * 隐藏全/反/区间选
     */
    function hiddenDrop_down() {
        $(".dufgdusybvcis").addClass("disNoneD");
    }
    //打开下拉框
    $("#drop-down").click(function () {
        $(".dufgdusybvcis").toggleClass("disNoneD");
    })
    //区间选择
    $("#intervalSelection").click(function () {
        var b = $(":checked[type='checkbox']").parents(".dc");
        if (b.length < 2) {
            alert("请选择两条或以上数据");
        } else {
            var n = [];
            //获取两个选中项
            var a = $("#box>.dc input[type='checkbox']");
            //获取第一个
            for (let index = 0; index < a.length; index++) {
                if ($(a[index]).is(":checked")) {
                    n.push(index);
                    break;
                }
            }
            //获取第二个
            for (let index = a.length; index > 0; index--) {
                if ($(a[index]).is(":checked")) {
                    n.push(index);
                    break;
                }
            }
            //区间选
            $("#box>.dc input[type='checkbox']").each(function (i, item) {
                if (i > n[0] && i < n[1]) {
                    if (!$(item).is(":checked")) {
                        $(item).click();
                    }
                }
            });
        }
        hiddenDrop_down()
    })
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
        $("#box").addClass("height100");
        var scrollHeight = $('#box').prop("scrollHeight") + 9999
        $('#box').scrollTop(scrollHeight);
        console.log("触发", scrollHeight);
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
            // textHeightRest ()
        }
    }
    /**
     * 抽出获取发言角色json
     * @param {*} type 类型
     * @returns 
     */
    function getRoleJson(type) {
        var json = new Object();
        var text = $("#text").val();
        var value;
        var base64;
        var avatars = $("img[class*='imgd']");
        if (avatars.length <= 0) {
            value = 9999;
        } else {
            value = chooseAvatar.roleId
            base64 = getBase64(chooseAvatar.roleId);
        }

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
        json.type = type;
        return json
    }

    //特殊事件 回复/羁绊事件
    $('.propIco').click(function () {
        $("#text").css("height", "24px");
        var text = $("#text").val();
        var a = $(this).attr('alt');
        var json = new Object();
        var avatars = $("img[class*='imgd']");

        switch (a) {
            case "转账":
                if (text != "") {
                    json.type = 'Transfer';
                } else {
                    return false
                }
                break;
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
            case 'Transfer':
                // if (avatars.length > 0) {
                //     json.roleId = chooseAvatar.roleId,
                //         json.imgId = chooseAvatar.imgId,
                //         json.name = chooseAvatar.name,
                //         json.content = text,
                //         json.mark = chooseAvatar.mark;
                //     if (chooseAvatar.roleId != undefined) {
                //         json.base64 = '';
                //         json.path = chooseAvatar.path;
                //     } else {
                //         if (getNewRoleType(chooseAvatar.roleId) == "newRole" || getNewRoleType(chooseAvatar.roleId) == null) {
                //             json.base64 = base64;
                //         }
                //         json.path = chooseAvatar.path
                //     }
                // } else {
                //     json.roleId = '9999';
                //     json.mark = '9999';
                //     json.content = text;
                json = getRoleJson(json.type);
                json.Transfer = "djs";
                break;
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
        var newTalk = createHtml(json)
        insertOrContinue(newTalk, json);
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
            $('#box').html("");
            boxJsonArray = res.boxJson;
            var tempArr = [];
            for (let i = 0; i < boxJsonArray.length; i++) {
                tempArr.push(boxJsonArray[i].index);
                var newTalk = createHtml(boxJsonArray[i]);
                $('#box').append(newTalk);
            }
            cen = $.isEmptyObject(tempArr) ? 0 : Math.max.apply(null, tempArr) + 1;
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
    /**
     * 页面加载完成
     */
    function Initd() {
        $(".overlay").addClass("disNoneD");
        $(".donut").addClass("disNoneD");
        $(".bodyN").removeClass("opacity05");
    }
    //初始化数据
    function Init() {
        toNewPath();
        Initd()
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
                    LoadAvatar().then(res => {
                        if (res != undefined) {
                            roleImgArray = res;
                            var conImg = $(".conImg");
                            for (let index = 0; index < roleImgArray.length; index++) {
                                for (let i = 0; i < conImg.length; i++) {
                                    if ($(conImg[i]).data("imgid") == roleImgArray[index].imgId) {
                                        $(conImg[i]).toggleClass("imgb bj");
                                        $(conImg[i]).parent().siblings(".xq").addClass("qx");
                                        break;
                                    }
                                }
                            }
                            btnAvatars();
                        }

                    })
                    LoadSetOptions();
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
    $("#test").click(function () {
        test();
    })
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
        var imgObj = e.attr('src');
        var newTalk = '';
        // var avatars = $("img[class*='imgd']");
        // if (avatars.length <= 0) {
        //     value = 9999;
        // } else {
        //     value = chooseAvatar.roleId
        // }
        // if (value == 9999) {
        //     json.roleId = 9999;
        //     json.content = imgObj;
        //     json.mark = '9999';
        //     newTalk = createHtml(json)
        //     insertOrContinue(newTalk, json);
        // } else {
        //     json.roleId = chooseAvatar.roleId,
        //         json.imgId = chooseAvatar.imgId,
        //         json.path = chooseAvatar.path,
        //         json.name = chooseAvatar.name,
        //         json.content = imgObj;
        //     json.mark = chooseAvatar.mark;
        //     json.base64 = chooseAvatar.roleId == "undefined" ? chooseAvatar.path : getBase64(chooseAvatar.roleId);
        //     newTalk = createHtml(json)
        //     insertOrContinue(newTalk, json);
        // }
        var json = getRoleJson("Expression");
        json.content = imgObj;
        newTalk = createHtml(json)
        insertOrContinue(newTalk, json);

        closeExpression()
    }
    //角色头像点击事件
    function roleAvatarClick(e) {
        $("#js").removeClass("border2sy");
        roleImgArray = new Array();
        var avatars = $("img[class*='bj']");
        console.log(avatars);
        for (var i = 0; i < avatars.length; i++) {
            var newObj = {
                roleId: $(avatars[i]).data("roleid"),
                imgId: $(avatars[i]).data("imgid"),
                imgPath: $(avatars[i]).attr("src"),
                mark: $(avatars[i]).data("mark")
            }
            roleImgArray.push(newObj);
        }
        updateAvatar(roleImgArray);
        btnAvatars();
    }
    //生成底部备选头像列表
    function btnAvatars() {
        $(".bottomImgs").html("");
        var txt = '';
        roleImgArray.forEach(item => {
            txt = txt + "<img data-name=" + item.mark + " class='conAvataar zz' data-roleid='" + item.roleId + "' data-imgId='" + item.imgId + "' src='" + item.imgPath + "' srcset=''>";
        });
        $(".bottomImgs").html(txt);
    }


    //点击选取底部备选头像
    $(".bottom1").on("click", ".conAvataar", function () {
        if ($("#js").is(".border2sy")) {
            var imgid = $(this).data("imgid");
            var temp = new Array();
            roleImgArray.forEach(item => {
                if (imgid != item.imgId) {
                    temp.push(item);
                }
            })
            roleImgArray = temp;
            updateAvatar(roleImgArray);
            $(this).remove();
            if (roleImgArray == "") {
                $("#js").removeClass("border2sy");
            }
            $(".conImg").each(function () {
                if ($(this).data("imgid") == imgid) {
                    $(this).toggleClass("imgb bj");
                    if (!$(this).siblings().is(".bj")) {
                        $(this).parent().siblings(".xq").removeClass("qx");
                    }
                }

            })
            return;
        }
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
                if ((obj.roleId == "undefined" && obj.imgId == list[i].id) || list[i].id == obj.roleId) {
                    roleName = list[i].roleName;
                }
            }
            obj.mark = $(this).data('name');
            obj.name = roleName;
            chooseAvatar = obj;
        }
    })
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
        if (b.length > 0) {
            if (confirm("确认要删除" + b.length + "条数据吗")) {
                b.each(function () {
                    for (let index = 0; index < boxJsonArray.length; index++) {
                        if ($(this).find(".gu").data("index") == boxJsonArray[index].index) {
                            var i = index;
                            console.log($(this).find(".gu").data("index"));
                            if (boxJsonArray[index].type == "reply") {
                                while (boxJsonArray[i].type == "reply") {
                                    i++;
                                }
                                boxJsonArray.splice(index, i - index - 1);
                            }
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
            for (let i = 0; i < boxJsonArray.length; i++) {
                if (editOpen.prev().find(".gu").data("index") == boxJsonArray[i].index) {
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
        var link = document.createElement("input");
        var jq = $(link);
        jq.attr({ "type": "file", "accept": "image/*" });
        jq.on("change", function () {

            var imgP = $(this);
            var imgObj = imgP[0].files[0];
            var newImg;
            //压缩图片
            compressImg(imgObj, uploadImg_scale).then(res => {
                newImg = res.afterSrc;
                var url = newImg;
                var json = getRoleJson("img");
                json.content = url;
                var newTalk = createHtml(json)
                insertOrContinue(newTalk, json);
            })
        })
        jq.click();
    })
    //打开设置列表
    $("#setList").click(function () {
        $("#knopiji").html("");
        loadSetList().then(res => {
            console.log("res", res);
            if (res != undefined) {
                var html = `<div class="setList">
              <div>字体大小<input type="text" id="guFont-size" value="${res.guFont_size}" placeholder="数字，默认1.2">rem</div>
              <div>背景颜色<input type="text" name="" id="guBackColor" value="${res.guBackColor}" placeholder="white、#ffffff、rgb(0,0,0)"><div style="display:inline;" class="whDiv whDiv2 layui-icon layui-icon-tips-fill"></div></div>
              <div>旁白字体大小<input type="text" name="" id="guAsideFont-size" value="${res.guAsideFont_size}" placeholder="数字，默认1.1">rem</div>
              <div>下载图片清晰度等级<input type="text" name="" id="loadImg-scale" value="${res.loadImg_scale}" placeholder="1-4，不要乱填！"></div>
              <div>上传图片清晰度<input type="text" name="" id="uploadImg-scale" value="${res.uploadImg_scale}" placeholder="0-1"><div style="display:inline;" class="whDiv whDiv3 layui-icon layui-icon-tips-fill"></div></div>
              <div><button type="button" id="setSave">保存</button></div>
              <div><button type="button" id="setRe">重置</button></div>
               <div><button type="button" id="reBmAvatar">重置底部备选头像列表</button></div>
            </div>`;
                $("#knopiji").append(html);
            }
        })

    })
    $("#knopiji").on("click", ".whDiv3", function () {
        alert("自定义角色头像清晰度/发送图片清晰度");
    })
    //颜色格式提示
    $("#knopiji").on("click", ".whDiv2", function () {
        alert("支持颜色格式如下,例：\n英文单词：white\n16进制：#FFFFFF\nrgb格式：rgb(207,207,206)");
    })
    //保存设置参数
    $("#knopiji").on("click", "#setSave", function () {
        var guFont_size = $("#guFont-size").val();
        var guBackColor = $("#guBackColor").val()
        var guAsideFont_size = $("#guAsideFont-size").val();
        var loadImg_scale = $("#loadImg-scale").val();
        var uploadImg_scale = $("#uploadImg-scale").val();
        var options = {
            guFont_size: guFont_size,
            guBackColor: guBackColor,
            guAsideFont_size: guAsideFont_size,
            loadImg_scale: loadImg_scale,
            uploadImg_scale: uploadImg_scale
        }
        setOption(options);
        updateSetList(options);
    })
    /**
     * 启用修改后的设置
     * @param {*} options 
     */
    function updateSetList(options) {
        //对话样式
        $(".roleRemarkDivSpan").css({
            "font-size": options.guFont_size + "rem",
        })
        //背景颜色
        $(".right").css({
            "background-color": options.guBackColor,
        })
        $("#box").css({
            "background-color": options.guBackColor,
        })
        //旁白字体大小
        $(".pangbaiSpan").css({
            "font-size": options.guAsideFont_size + "rem",
        })
        //下载图片清晰度
        imgScale = options.loadImg_scale;
        //上传图片清晰度
        uploadImg_scale = options.uploadImg_scale;
    }
    //重置设置列表
    $("#knopiji").on("click", "#setRe", function () {
        var options = {
            guFont_size: "1.2",
            guBackColor: "rgb(207,207,206)",
            guAsideFont_size: "1.1",
            loadImg_scale: "1",
            uploadImg_scale: "0.2"
        }
        setOption(options);
        $("#guFont-size").val(options.guFont_size)
        $("#guBackColor").val(options.guBackColor)
        $("#guAsideFont-size").val(options.guAsideFont_size);
        $("#loadImg-scale").val(options.loadImg_scale);
        $("#uploadImg-scale").val(options.uploadImg_scale);
        updateSetList(options);
    })
    //重置底部头像列表
    $("#knopiji").on("click", "#reBmAvatar", function () {
        reSet();
    })
    /**
     * 重置底部备选头像列表
     */
    function reSet() {
        DeleteAvatar();
        window.location.reload();
    }
    /**
     * 截图保存
     */
    $("#save").click(function () {
        var b = $(":checked[type='checkbox']").parents(".dc");
        if (b.length > 0) {
            if (confirm("是否只保存选中信息")) {
                $("#box>.dc input[type='checkbox']:not(:checked)").each(function () {
                    $(this).parents().filter(".dc").addClass("disNoneD");
                });
            }
        }

        $("#box").removeClass("height100");
        var scrollHeight = $('#box').prop("scrollHeight");
        var scrollWidth = $('#box').prop("scrollWidth");
        $(".iptChoose").addClass("chooseNone");
        $(".iptChooseYHZ").addClass("chooseNone");
        $("[type='checkbox']").prop("checked", false);
        $(".zt_cz").addClass("disNoneD")
        $(".dc").removeClass("editOpen");//document.getElementById('box')
        //页面等待动画
        $("#app").addClass("opacity05");
        $(".donut").removeClass("disNoneD");
        $(".donut").css("opacity", "1")
        $(".overlay").toggleClass("disNoneD");
        domtoimage.toJpeg($("#box")[0], { scale: imgScale, height: scrollHeight, width: scrollWidth })
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'gugutalk.png';
                link.href = dataUrl;
                link.click();
                $(".iptChoose").removeClass("chooseNone");
                $(".iptChooseYHZ").removeClass("chooseNone");
                $(".zt_cz").removeClass("disNoneD")
                $("#app").removeClass("opacity05");
                $(".donut").addClass("disNoneD");
                $(".overlay").toggleClass("disNoneD");
                loadBoxData();
                ToBtm();
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
            console.log(res, "长度");

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
                    if (res == undefined) {
                        alert("当前没有存档");
                    } else {
                        if (res.length == 0) {
                            alert("当前没有存档");
                        }
                    }
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
        hiddenDrop_down()
    })
    //反选
    $("#reSelectAll").click(function () {
        selectAllOrReSelectAll(2);
        hiddenDrop_down();
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
                compressImg(imgObj, uploadImg_scale).then(res => {//compressImg方法见附录
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
        console.log(roleArray, ele);
        createNewRoleArray(ele).then(res => {
            Init();
        });

        //window.location.reload();
    }
    //删除自定义角色
    function deleteRole(id, e) {
        var c = confirm("确认要删除吗？");
        if (c) {
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
    //修改转账状态
    $("#box").on("click", ".zt_cz>div", function () {
        var obj = $(this).parents().filter(".dc");
        var c = $(this).attr("class");
        var a;
        switch (c) {
            case "zt_gq"://过期
                //修改图片
                obj.find(".zt_img").attr("src", "images/g.png")
                obj.find(".zzDivd").addClass("opacity05");
                //修改名称
                obj.find(".zt-desc").html("已过期")
                a = "gq";
                break;
            case "zt_js"://接收
                obj.find(".zt_img").attr("src", "images/d.png")
                obj.find(".zzDivd").addClass("opacity05");
                obj.find(".zt-desc").html("已被接收")
                var json = getRoleJson();
                json.type = "Transfer";
                json.Transfer = "js";
                json.content = obj.find(".zt-price>span").html();
                var newTalk = createHtml(json)
                insertOrContinue(newTalk, json);
                a = "bjs";
                break;
            case "zt_djs"://等待确认
                obj.find(".zt_img").attr("src", "images/z.png")
                obj.find(".zzDivd").removeClass("opacity05");
                obj.find(".zt-desc").html("等待确认")
                a = "djs";
                break;
            default:
                break;
        }
        for (let index = 0; index < boxJsonArray.length; index++) {
            if (boxJsonArray[index].index == obj.find(".gu").data("index")) {
                console.log(boxJsonArray[index]);
                boxJsonArray[index].Transfer = a;
                updateTempJson(boxJsonArray)
                break;
            }
        }
    })
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

        var tNs = obj.parents().filter(".dc").prev().find(".gu").data("names");
        var tN = obj.parents().filter(".dc").prev().find(".gu").data("name");
        var bNs = obj.parents().filter(".gu").data("names");
        var bN = obj.parents().filter(".gu").data("name");
        var index = obj.parents().filter(".gu").data("index")
        console.log("上一个names:", tNs, "上一个name:", tN);
        console.log("这一个names:", bNs, "这一个name:", bN);
        if (tNs == bNs && bN == tN) {
            if (obj.find("img").is(".width0")) {
                obj.find('.xvb').removeClass("replaceAvatar");
                obj.find('.roleImg').removeClass("width0");
                obj.next().find(".roleNameSpan").removeClass("width0");
                obj.parents().filter(".gu").toggleClass("roleOverallTopMargin");
                obj.next().find(".qp").removeClass("qpW");
                // if(obj.parents().is(".rightRoleOverall")){

                // }else{
                //     obj.next().find(".qp").removeClass("width0");
                // }
            } else {
                obj.find('.roleImg').addClass("width0");
                obj.find(".xvb").addClass("replaceAvatar");
                obj.next().find(".roleNameSpan").addClass("width0");
                //obj.next().find(".qp").addClass("width0");
                obj.parents().filter(".gu").toggleClass("roleOverallTopMargin");
                obj.next().find(".qp").addClass("qpW");
                // if(obj.parents().is(".rightRoleOverall")){

                // }else{
                //     obj.next().find(".qp").addClass("width0");
                // }
            }

        }
    }
    //点击开启移出备选头像队列
    $("#js").click(function () {
        $(this).toggleClass("border2sy");
    })
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
    //网页全屏
    $("#ALLPM").click(function () {
        $(".bodyN").toggleClass("margin0");
    })
    //#region layui事件
    layui.use(['form', 'laydate', 'util'], function () {
        var layer = layui.layer;
        var form = layui.form;
        form.on('switch(isYHZ)', function (data) {
            // layer.msg('开关 checked：' + (this.checked ? 'true' : 'false'), {
            //     offset: '6px'
            // });
            if (this.checked) {
                $(".YHZTX").removeClass("width0");
                chooseAvatar = {
                    roleId: 1,
                    imgId: 3,
                    path: " images/roleImages/mxr_sf.png",
                    mark: "mxr_sf",
                    name: "米雪儿"
                }
            } else {
                $(".YHZTX").addClass("width0");
                chooseAvatar = {
                    roleId: 9999,
                    // imgId: 3,
                    // path: " images/roleImages/mxr_sf.png",
                    // mark: "mxr_sf",
                    // name: "米雪儿"
                }
            }
            kqOptions.isYHZ = this.checked;
            setOption(kqOptions);
        });
    });
    //#endregion

    //#region 小屏幕时触发事件
    //点击显示/关闭左侧工具栏
    $(".topimg").click(function () {
        var leftObj = $(".left");
        leftObj.is(".disNone") ? leftObj.removeClass("disNone") : leftObj.addClass("disNone")
    })
    //点击显示/关闭角色列表
    $("#qh").click(function () {
        var centerObj = $(".center");
        var rightObj = $(".right");
        // if ($(".center").css("width") == '0') {
        if (centerObj.is(".width00")) {
            centerObj.addClass("width100");
            centerObj.removeClass("width00");
            rightObj.addClass("width00");
            rightObj.removeClass("width100");
        } else {
            centerObj.addClass("width00");
            centerObj.removeClass("width100");
            rightObj.addClass("width100");
            rightObj.removeClass("width00");
        }
    })
    //#endregion



});
