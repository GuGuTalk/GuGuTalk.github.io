//初始化绑定按钮事件
window.onload = function () {
	console.log("初始化");



}
const downloadQrcode = () => {
  var scrollHeight = $('#box').prop("scrollHeight")+20   ;
  domtoimage.toJpeg(document.getElementById('box'), { quality: 2,height:scrollHeight })
    .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'gugutalk.jpeg';
        link.href = dataUrl;
        link.click();
});

}

