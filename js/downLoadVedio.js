let canvasElement = document.querySelector("#canvas");
let videoElement = document.querySelector("#video");
let startButton = document.querySelector("#button-start");
let stopButton = document.querySelector("#button-stop");

const videoWidth = 640;
const videoHeight = 360;
const frameRate = 60;
const encodeType = "video/webm;codecs=vp8";

let chunks = [];

let frameId = null;

//设置画布背景
const canvasContext = canvasElement.getContext("2d");
canvasContext.fillStyle = "deepskyblue";
canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height);

//创建MediaRecorder，设置媒体参数
const stream = canvasElement.captureStream(frameRate);
const recorder = new MediaRecorder(stream, {
    mimeType: encodeType
});

//收集录制数据
recorder.ondataavailable = e => {
    chunks.push(e.data);
};

//按钮事件
startButton.disabled = true;
stopButton.disabled = true;
startButton.onclick = e => {
    startButton.disabled = true;
    stopButton.disabled = false;
    recorder.start(10);
    drawFrame();
};
stopButton.onclick = e => {
    startButton.disabled = false;
    stopButton.disabled = true;
    recorder.stop();
    cancelAnimationFrame(frameId);
    download();
};

//打开摄像头，并将数据显示到video标签上
navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
}).then(mediaStream => {
    videoElement.srcObject = mediaStream;
    videoElement.play();
    startButton.disabled = false;
}).catch(error => {
    alert("打开摄像头失败");
});

//播放视频
function drawFrame() {
    canvasContext.drawImage(videoElement, 0, 0, videoWidth, videoHeight);
    frameId = requestAnimationFrame(drawFrame);
}

//下载录制内容
function download() {
    let blob = new Blob(chunks);
    let url = window.URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.download = new Date().getTime() + ".mp4";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
}
