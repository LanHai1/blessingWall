// 根据id获取元素
function $(id) {
    return document.getElementById(id)
}

// 首次加载数据
var messages = [{
    "id": 1,
    "name": "张学友",
    "content": "刘德华说的对",
    "time": "2017-12-26 00:00:00"
}, {
    "id": 2,
    "name": "刘德华",
    "content": "周林林比林利群帅",
    "time": "2017-12-25 12:40:00"
}, {
    "id": 3,
    "name": "郭富城",
    "content": "我认同张学友说的",
    "time": "2017-12-25 12:45:00"
}, {
    "id": 4,
    "name": "林利群",
    "content": "把朋友家厕所拉堵了 不敢出去 掏了半小时了都",
    "time": "2017-12-24 12:40:00"
}, {
    "id": 5,
    "name": "周林林",
    "content": "师者，所以传道受业解惑也。",
    "time": "2016-02-22 12:40:00"
}, {
    "id": 6,
    "name": "紫霞",
    "content": "至尊宝，等我",
    "time": "2017-12-23 09:30:00"
}, {
    "id": 7,
    "name": "孙悟空",
    "content": "吃俺老孙一棒！",
    "time": "2017-12-23 09:30:00"
}, {
    "id": 8,
    "name": "某某",
    "content": "旋转，跳跃，我不停歇…………舞娘的喜悲没人看见",
    "time": "2017-12-26 01:30:00"
}, {
    "id": 9,
    "name": "哎呦哎呦",
    "content": "今天谁的礼物最好看！！？答：朋友圈。。。",
    "time": "2017-12-25 20:30:00"
}];

// id处理 => 无数据库 从100开始
let id = getLocalStorage("id")
    // id是否已存在本地 默认100开始
id = id ? id : 100
    // 存储id
setLocalStorage("id", id)

// 获取留言数据
let data = getLocalStorage("data")
    //  是否存在数据 => 不能删除到一条都不剩
data = data ? data : messages
    // 存储原有数据
setLocalStorage("data", data)


// 将数据本地存储
function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}
// 获取数据
function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}
// 删除数据
function removeLocalStorage(key) {
    localStorage.removeItem(key)
}

// 找到 content 元素
var content = document.getElementById('content');

// 层级
let zIndex = 1;

// 为祝福墙贴纸做对应的事件与绑定
function setMessageCreateNew(data) {
    let tip = document.createElement("div")

    let obj = data

    tip.className = "tip"
    tip.innerHTML = '<div class="tip-h clearfix" title="双击关闭纸条">' +
        '<div class="text">第[' + obj.id + ']条 ' + obj.time + '</div>' +
        '<div class="close" title="关闭纸条">x</div>' +
        '</div>' +
        '<div class="tip-m">' + obj.content + '</div>' +
        '<div class="tip-f clearfix">' +
        '<div class="icon">' +
        '<img src="images/bpic_1.gif" alt="" />' +
        '</div>' +
        '<div class="name">' + obj.name + '</div>' +
        '</div>';

    // 将元素追加到对应的父盒子中
    content.appendChild(tip)
        // 随机设置位置
    setElXY(tip)
        // 删除留言板
    tip.getElementsByClassName("close")[0].onclick = function() {
            // 
            removeTip(obj)
                // 找到当前留言 并通过父盒子删除该元素
            this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode)
        }
        // 双击删除
    tip.getElementsByClassName("tip-h")[0].ondblclick = function() {
            removeTip(obj)
            this.parentNode.parentNode.removeChild(this.parentNode)
        }
        // z-index
    tip.onclick = function() {
        this.style.zIndex = ++zIndex
    }
}

// 删除留言板
function removeTip(obj) {
    // 获取所有数据
    let datas = getLocalStorage("data")
        // 循环遍历
    for (let i = 0; i < datas.length; i++) {
        // 通过id 找 对应的数据对象
        if (datas[i]["id"] == obj.id) {
            // 删除该数据
            datas.splice(i, 1)
                // 直接跳出循环
            break
        }
    }
    // 将处理好的新数据 重新设置回本地存储里
    setLocalStorage("data", datas)

}

// 渲染至页面
for (let i = 0; i < data.length; i++) {
    setMessageCreateNew(data[i])
}

// 设置元素topleft
function setElXY(el) {
    el.style.left = randomXY(content.offsetWidth, 227)
    el.style.top = randomXY(content.offsetHeight, 190)
}

// 随机数 x y
function randomXY(max, min) {
    max = parseInt(max)
    min = parseInt(min)
    return parseInt(Math.random() * (max - min + 1)) + "px"
}

let flagDTClose = true
    // 动态添加数据层
$("addMessage").onclick = function() {
    this.style.display = flagDTClose ? "none" : "block"
    $("submit_con").style.display = flagDTClose ? "block" : "none"
    flagDTClose = false
}

// 关闭添加
function closeDT() {
    $("addMessage").style.display = flagDTClose ? "none" : "block"
    $("submit_con").style.display = flagDTClose ? "block" : "none"
    flagDTClose = true
}
// 关闭
$("closeDT").onclick = function() {
    closeDT()
}

// 添加数据
$("submit").onclick = function() {
    setMessage()
}

// 数据处理
function setMessage() {
    // 获取用户输入
    let text_con = $("text_con").value
    let name_con = $("name_con").value
    let date = getDate(new Date())
        // 判读是否输入
    if (text_con.length == 0 || name_con.length == 0) {
        $("errSpan").innerHTML = "请填写留言信息和留言人"
        return false
    }
    // 获取全部数据
    let data = getLocalStorage("data")
        // 用户输入的单条数据
    let idOne = getLocalStorage("id") + 1
        // id重新+1 
    setLocalStorage("id", idOne)
        // 单条数据对象
    let oneData = {
            "id": idOne,
            "name": name_con,
            "content": text_con,
            "time": date
        }
        // 将数据添加到原数据的最后面
    data.push(oneData)

    // 保存本地
    setLocalStorage("data", data)

    // 将新数据追加到页面
    setMessageCreateNew(oneData)

    // 添加完毕 关闭
    closeDT()
}

// 获取时间 
// 2017-12-25 20:30:00
function getDate(newDate) {
    let date = newDate
    return `${date.getFullYear()}-${setDateOne(date.getMonth()+1)}-${setDateOne(date.getDate())} ${setDateOne(date.getHours())}:${setDateOne(date.getMinutes())}:${setDateOne(date.getSeconds())}`
}

// 时间日期一位数 转 二位数
function setDateOne(data) {
    return data >= 10 ? data : `0${data}`
}