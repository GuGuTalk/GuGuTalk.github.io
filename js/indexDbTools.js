var gugutalk = "gugutalk";
var boxArray = "kqBoxArray";
var tempJson = "kqTempJson";
var roleArray = "kqRoleArray";
var roleArrayCopy = "kqRoleArrayCopy"
/**
 * 切换开关
 */
function handOff(name) {
    openDB(gugutalk).then(res => {
        getDataByKey(res, gugutalk, "handoff").then(opt => {
            if (opt == undefined) {
                addData(res, gugutalk, "klbq")
            } else {
                switch (name) {
                    case "尘白禁区":
                        updateDB(res, gugutalk, "cbjq", "handoff");
                        boxArray = "cbBoxArray"
                        tempJson = "cbTempJson"
                        roleArray = "cbRoleArray"
                        roleArrayCopy = "cbRoleArrayCopy"
                        break;
                    case "卡拉彼丘":
                        updateDB(res, gugutalk, "klbq", "handoff");
                        boxArray = "kqBoxArray"
                        tempJson = "kqTempJson"
                        roleArray = "kqRoleArray";
                        roleArrayCopy = "kqRoleArrayCopy"
                        break;
                    default:
                        break;
                }
            }
        })
    })
}
/**
 * 全局判断初始化
 */
function handOffInit() {

}
/**
 * 删除角色副本-同步
 */
async function deleteRoleCopy() {
    var db = await openDB(gugutalk);
    await deleteDB(db, gugutalk, roleArrayCopy);
    closeDB(db)
}
/**
 * 修改系列或存档标题-同步
 * @param {*} id 
 * @param {*} title 
 * @param {*} cid 
 */
async function updateTitle(id, title, cid = 9999) {
    var db = await openDB(gugutalk);
    //修改系列标题
    var boxarray = await getDataByKey(db, gugutalk, boxArray);
    if (cid == 9999) {
        for (let index = 0; index < boxarray.length; index++) {
            if (boxarray[index].id == id) {
                boxarray[index].title = title;

                break;
            }
        }
    } else {
        for (let index = 0; index < boxarray.length; index++) {
            if (boxarray[index].id == id) {
                for (let i = 0; i < boxarray[index].boxJsonArrays.length; i++) {
                    if (boxarray[index].boxJsonArrays[i].cid == cid) {
                        boxarray[index].boxJsonArrays[i].ctitle = title;
                        break;
                    }
                }
            }
        }
    }
    await updateDB(db, gugutalk, boxarray, boxArray);
    closeDB(db);

}
/**
 * 通过id修改角色列表副本中指定的角色名称
 * @param {*} id 
 */
async function updateRoleName(id, name) {
    var db = await openDB(gugutalk);
    var rolecopy = await getDataByKey(db, gugutalk, roleArrayCopy);
    for (let index = 0; index < rolecopy.length; index++) {
        if (rolecopy[index].id == id) {
            rolecopy[index].roleName = name;
            break;
        }
    }
    await updateDB(db, gugutalk, rolecopy, roleArrayCopy);
    closeDB(db);
    return rolecopy;
}
/**
 * local迁移到indexdb，临时使用，下个版本废弃
 */
async function LocalMigrate(boxjson) {
    var db = await openDB(gugutalk);
    var a = {
        id: getNowTime(),
        title: '',
        boxJson: boxjson
    }
    await addData(db, gugutalk, a, tempJson);
    closeDB(db)
}
/**
 * 同步获取自定义角色列表
 */
async function getRoleArray() {
    let db = await openDB(gugutalk);
    let temp = await getDataByKey(db, gugutalk, roleArray);
    closeDB(db);
    return temp;
}
/**
 * 创建或修改角色列表副本
 * @param {*} rolearray 初始角色列表
 */
async function createRoleArrayCopy(rolearray) {
    var array;
    var db = await openDB(gugutalk);
    //获取自定义角色列表
    var newrolearray = await getDataByKey(db, gugutalk, roleArray);
    //判断是否存在角色副本，没有则创建
    var exist = await getDataByKey(db, gugutalk, roleArrayCopy);
    if (exist == undefined) {
        if (newrolearray == undefined || newrolearray == "") {
            array = rolearray;
        }
        else {
            newrolearray.forEach(element => {
                rolearray.unshift(element);
            });
            array = rolearray;
        }

        await addData(db, gugutalk, array, roleArrayCopy);
    }
    else {
        if (newrolearray != "" && newrolearray != undefined) {
            for (let index = newrolearray.length - 1; index >= 0; index--) {
                rolearray.unshift(newrolearray[index])
            }
            if (rolearray.length != exist.length) {
                array = rolearray;
                await updateDB(db, gugutalk, rolearray, roleArrayCopy)
            } else {
                array = exist;
            }
        } else {
            array = rolearray;
        }


    }
    closeDB(db);
    return array;
}

/**
 * 根据id删除指定自定义角色
 * @param {*} id 
 */
function deleteNewRoleById(id) {
    openDB(gugutalk).then(res => {
        getDataByKey(res, gugutalk, roleArray).then(opt => {
            var newArray = new Array();
            for (let index = 0; index < opt.length; index++) {
                if (opt[index].id != id) {
                    newArray.push(opt[index]);
                }
            }
            updateDB(res, gugutalk, newArray, roleArray);
            closeDB(res);
        });
    })
}
/**
 * 根据id和cid获取指定存档替换tempJson
 * @param {*} id 
 * @param {*} cid 
 */
async function updateArchive(id, cid) {
    let db = await openDB(gugutalk);
    let temp = await getDataByKey(db, gugutalk, boxArray);

    let aaa = await getDataByKey(db, gugutalk, tempJson);

    var boxjson;
    for (let index = 0; index < temp.length; index++) {
        if (temp[index].id == id) {
            for (let i = 0; i < temp[index].boxJsonArrays.length; i++) {
                if (temp[index].boxJsonArrays[i].cid == cid) {
                    boxjson = temp[index].boxJsonArrays[i];
                    break;
                }
            }
        }
    }
    if (aaa == undefined || aaa == "") {
        aaa = boxjson;
        var obj={
            id:getNowTime(),
            title:aaa.ctitle,
            boxJson:aaa.boxJson
        }
        await addData(db, gugutalk, obj, tempJson);
    } else {
        aaa.boxJson = boxjson.boxJson;
        await updateDB(db, gugutalk, aaa, tempJson);
    }

    closeDB(db);
}

/**
 * 新增角色
 * @param {*} json 
 */
function createNewRoleArray(json) {
    openDB(gugutalk).then(res => {
        getDataByKey(res, gugutalk, roleArray).then(opt => {
            if (opt == undefined) {
                var array = new Array();
                array.push(json);
                addData(res, gugutalk, array, roleArray)
            } else {
                opt.unshift(json);
                updateDB(res, gugutalk, opt, roleArray);
            }
            closeDB(res);
        })
    })
}
/**
 * 获取tempJson
 * @param {*} name 主键名称
 * @returns 
 */
async function getTempJson() {
    let db = await openDB(gugutalk);
    let temp = await getDataByKey(db, gugutalk, tempJson);
    closeDB(db);
    return temp;
}
/**
 * 
 * @returns 获取全部存档
 */
async function getBoxArray() {
    let db = await openDB(gugutalk);
    let temp = await getDataByKey(db, gugutalk, boxArray);
    closeDB(db);
    return temp;
}

function qwe(boxJsonArray) {
    console.log(boxJsonArray);
}
/**
 * 新增对话
 * @param {*} boxJsonArray 存储对话的数组
 * @param {*} obj 对话
 */
function addTalk(boxJsonArray, obj) {
    openDB(gugutalk).then(res => {
        getDataByKey(res, gugutalk, tempJson).then(opt => {
            if (opt == undefined) {
                var a = {
                    id: getNowTime(),
                    title: '',
                    boxJson: boxJsonArray
                }
                addData(res, gugutalk, a, tempJson)
            } else {
                opt.boxJson = boxJsonArray;
                updateDB(res, gugutalk, opt, tempJson);
            }
            closeDB(res);
        })
    })
}
/**
 * 根据Id删除指定系列全部存档-同步
 * @param {*} id 
 */
async function deleteBoxArrayById(id) {
    var db = await openDB(gugutalk);
    var boxarray = await getDataByKey(db, gugutalk, boxArray);
    for (let index = 0; index < boxarray.length; index++) {
        if (boxarray[index].id == id) {
            boxarray.splice(index, 1);
            break;
        }
    }
    await updateDB(db, gugutalk, boxarray, boxArray);
    closeDB(db);
}
/**
 * 根据id和cid删除指定系列中指定存档-同步
 * @param {*} id 
 * @param {*} cid 
 */
async function deleteBoxArrayChild(id, cid) {
    var db = await openDB(gugutalk);
    var boxarray = await getDataByKey(db, gugutalk, boxArray);
    for (let index = 0; index < boxarray.length; index++) {
        if (boxarray[index].id == id) {
            for (let i = 0; i < boxarray[index].boxJsonArrays.length; i++) {
                if (boxarray[index].boxJsonArrays[i].cid == cid) {
                    boxarray[index].boxJsonArrays.splice(i, 1);
                    break;
                }

            }
        }
    }
    await updateDB(db, gugutalk, boxarray, boxArray);
    closeDB(db);
}
/**
 * 插入对话
 * @param {*} obj 插入的对话对象
 * @param {*} index 标识
 */
async function insertTalk(obj, index) {
    var db = await openDB(gugutalk);
    var temp = await getDataByKey(db, gugutalk, tempJson);
    var previousArray = new Array();
    var afterArray = new Array();
    for (let i = 0; i < temp.boxJson.length; i++) {
        if (temp.boxJson[i].index == index) {
            previousArray = temp.boxJson.slice(0, i);
            previousArray.push(obj);
            afterArray = temp.boxJson.slice(i, temp.boxJson.length);
            temp.boxJson = previousArray.concat(afterArray);
            await updateDB(db, gugutalk, temp, tempJson);
            closeDB(db);
            break;
        }
    }
    console.log(temp);
}

/**
 * 修改tempJson -同步
 * @param {*} boxJsonArray
 */
async function updateTempJson(boxJsonArray) {
    var db = await openDB(gugutalk);
    var temp = await getDataByKey(db, gugutalk, tempJson);
    temp.boxJson = boxJsonArray;
    await updateDB(db, gugutalk, temp, tempJson);
    closeDB(db);
}
/**
 * 删除tempJson
 */
function deleteTempJson() {
    openDB(gugutalk).then(res => {
        deleteDB(res, gugutalk, tempJson);
        closeDB(res);
    })
}

/**
 * 存档-同步
 * @param {*} id 
 */
async function Archive() {
    var db = await openDB(gugutalk);
    var boxarray = await getDataByKey(db, gugutalk, boxArray);
    var tempjson = await getDataByKey(db, gugutalk, tempJson);
    var boxJsonArray = new Array();
    if (boxarray == undefined) {
        boxJsonArray = Archives(tempjson);
        if (boxJsonArray == null) return
        await addData(db, gugutalk, boxJsonArray, boxArray)
    } else {
        boxJsonArray = Archives(tempjson);
        if (boxJsonArray == null) return
        boxJsonArray = boxarray.concat(boxJsonArray);
        await updateDB(db, gugutalk, boxJsonArray, boxArray)
    }
    ArchiveAfterUpdateId(db, tempjson);
    closeDB(db);
}

/**
 * 根据id和cid替换指定系列中的指定存档-同步
 * @param {*} id 
 * @param {*} cid 
 */
async function replaceArchive(id, cid, title) {
    var db = await openDB(gugutalk);
    var boxarray = await getDataByKey(db, gugutalk, boxArray);
    var tempjson = await getDataByKey(db, gugutalk, tempJson);
    for (let index = 0; index < boxarray.length; index++) {
        if (boxarray[index].id == id) {
            for (let i = 0; i < boxarray[index].boxJsonArrays.length; i++) {
                if (boxarray[index].boxJsonArrays[i].cid == cid) {
                    boxarray[index].boxJsonArrays[i].ctitle = title == null || "" ? boxarray[index].boxJsonArrays[i].ctitle : title;
                    boxarray[index].boxJsonArrays[i].boxJson = tempjson.boxJson;
                    break;
                }
            }
        }
    }
    await updateDB(db, gugutalk, boxarray, boxArray);
    closeDB(db);
}
/**
 * 根据id插入指定存档
 * @param {*} id 存档id
 */
async function insertArchive(id, title) {
    var db = await openDB(gugutalk);
    var tempjson = await getDataByKey(db, gugutalk, tempJson);
    var boxjson = await getDataByKey(db, gugutalk, boxArray);
    var robj;
    for (let index = 0; index < boxjson.length; index++) {
        if (boxjson[index].id == id) {
            var length = parseInt(boxjson[index].boxJsonArrays.length) + 1;
            var tit = title == "" ? boxjson[index].title + "-" + length : title;
            robj = {
                id: boxjson[index].id,
                cid: boxjson[index].id + "-" + length,
                ctitle: tit
            }
            var newObj = {
                cid: boxjson[index].id + "-" + length,
                ctitle: tit,
                boxJson: tempjson.boxJson
            }
            boxjson[index].boxJsonArrays.push(newObj);
            await updateDB(db, gugutalk, boxjson, boxArray)
            ArchiveAfterUpdateId(db, tempjson);
            closeDB(db)
            break;
        }
    }
    return robj;
}
/**
 * 存档之后修改tempJson的id
 * @param {*} tempJsons
 */
async function ArchiveAfterUpdateId(res, tempJsons) {
    tempJsons.id = getNowTime();
    await updateDB(res, gugutalk, tempJsons, tempJson);
}
/**
 * 抽出存档方法
 */
function Archives(item) {
    var array = new Array();
    //创建新系列
    var boxJsonArray = new Array();
    var boxJsonListTitle = prompt("请输入标题");
    if (boxJsonListTitle != null && boxJsonListTitle != "") {
        var child = {
            cid: item.id + "-1",
            ctitle: boxJsonListTitle + "-1",
            boxJson: item.boxJson
        }
        array.push(child);
        var json = {
            id: item.id,
            title: boxJsonListTitle,
            boxJsonArrays: array
        }
        boxJsonArray.push(json);
        return boxJsonArray;
    } else {
        return;
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