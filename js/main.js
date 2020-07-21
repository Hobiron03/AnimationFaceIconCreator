var Color;
(function (Color) {
    Color["BLACK"] = "black";
    Color["BLUE"] = "#629BEAa";
    Color["RED"] = "#FF5823";
})(Color || (Color = {}));
;
var mouse = {
    startPosX: 0,
    startPosY: 0,
    bezierControlPosX: 0,
    bezierControlPosY: 0,
    endPosX: 0,
    endPosY: 0,
    maxUShapePos: 0,
    lineWidth: 0
};
;
var leftEyebrow = {
    startPosX: 0,
    startPosY: 0,
    endPosX: 0,
    endPosY: 0,
    lineWidth: 0,
    maxEndHeight: 0
};
var rightEyebrow = {
    startPosX: 0,
    startPosY: 0,
    endPosX: 0,
    endPosY: 0,
    lineWidth: 0,
    maxEndHeight: 0
};
;
var rightEye = {
    pos: 0,
    size: 0
};
var leftEye = {
    pos: 0,
    size: 0
};
//座標部分のCanvas
var coordinateCanvas = document.getElementById('coordinate');
var cctx = coordinateCanvas.getContext('2d');
;
var corrdinate = {
    width: 0,
    height: 0
};
// 顔アイコンの口を描画のCanvas
var facialPartsCanvas = document.getElementById('facial-parts');
var fpctx = facialPartsCanvas.getContext('2d');
// 顔アイコン作成Canvasの背景画像を描画
var DrawCoordinateImage = function () {
    var background = new Image();
    var imageURL = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/Cordinate.png";
    background.src = imageURL;
    //画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
    background.onload = function () {
        if (cctx) {
            cctx.drawImage(background, 0, 0, coordinateCanvas.width, background.height * coordinateCanvas.width / background.width);
        }
    };
};
//顔アイコンの口パーツを描画する。X座標の大きさによって口の傾き具合が変わる
var RenderMouth = function (x) {
    //x座標から口の傾きを計算する width400で-66から66くらい
    //xの値を0 ~ mouse.maxUShapePos*2の範囲に正規化
    var curveDegree = (x * (mouse.maxUShapePos * 2)) / corrdinate.width;
    if (curveDegree > mouse.maxUShapePos) {
        curveDegree = curveDegree - mouse.maxUShapePos;
    }
    else if (x < corrdinate.height / 2) {
        curveDegree = curveDegree - mouse.maxUShapePos;
    }
    else {
        //x座標が0のとき
        curveDegree = 0;
    }
    //口の描画
    if (fpctx) {
        fpctx.beginPath();
        fpctx.strokeStyle = 'black';
        fpctx.lineWidth = mouse.lineWidth;
        fpctx.lineCap = 'round';
        fpctx.globalCompositeOperation = 'source-over';
        fpctx.moveTo(mouse.startPosX, mouse.endPosY);
        fpctx.quadraticCurveTo(mouse.bezierControlPosX, mouse.bezierControlPosY + curveDegree, mouse.endPosX, mouse.endPosY);
        fpctx.stroke();
    }
};
//顔アイコンの眉パーツを描画する。Y座標の大きさによって眉の傾き具合が変わる
var RenderEyebrows = function (y) {
    // y座標から眉尻の高さを計算する height:0~400で 眉:-15~15くらい
    var endOfEyebrowsHeight = (y * (rightEyebrow.maxEndHeight * 2)) / corrdinate.height;
    if (endOfEyebrowsHeight > rightEyebrow.maxEndHeight) {
        endOfEyebrowsHeight = endOfEyebrowsHeight - rightEyebrow.maxEndHeight;
    }
    else if (y < corrdinate.height / 2) {
        endOfEyebrowsHeight = endOfEyebrowsHeight - rightEyebrow.maxEndHeight;
    }
    else {
        //y座標が0のとき
        endOfEyebrowsHeight = 0;
    }
    //眉の描画
    if (fpctx) {
        //left
        fpctx.beginPath();
        fpctx.strokeStyle = 'black';
        fpctx.lineWidth = leftEyebrow.lineWidth;
        fpctx.lineCap = 'round';
        fpctx.globalCompositeOperation = 'source-over';
        fpctx.moveTo(leftEyebrow.startPosX, leftEyebrow.startPosY + endOfEyebrowsHeight); //眉尻
        fpctx.lineTo(leftEyebrow.endPosX, leftEyebrow.endPosY);
        fpctx.stroke();
        //right
        fpctx.beginPath();
        fpctx.strokeStyle = 'black';
        fpctx.lineWidth = rightEyebrow.lineWidth;
        fpctx.lineCap = 'round';
        fpctx.globalCompositeOperation = 'source-over';
        fpctx.moveTo(rightEyebrow.startPosX, rightEyebrow.startPosY + endOfEyebrowsHeight); //眉尻
        fpctx.lineTo(rightEyebrow.endPosX, rightEyebrow.endPosY);
        fpctx.stroke();
    }
};
var RenderEye = function () {
    if (fpctx) {
        //左目
        fpctx.beginPath();
        fpctx.strokeStyle = 'black';
        fpctx.lineWidth = leftEye.size;
        fpctx.lineCap = 'round';
        fpctx.globalCompositeOperation = 'source-over';
        fpctx.lineTo(facialPartsCanvas.clientWidth / 2 - leftEye.pos, facialPartsCanvas.clientHeight / 2);
        fpctx.stroke();
        //右目
        fpctx.beginPath();
        fpctx.strokeStyle = 'black';
        fpctx.lineWidth = rightEye.size;
        fpctx.lineCap = 'round';
        fpctx.globalCompositeOperation = 'source-over';
        fpctx.lineTo(facialPartsCanvas.clientWidth / 2 + rightEye.pos, facialPartsCanvas.clientHeight / 2);
        fpctx.stroke();
    }
};
var DrawFace = function (x, y) {
    ResetFacialParts();
    RenderMouth(x);
    RenderEye();
    RenderEyebrows(y);
};
var ResetCoordinate = function () {
    if (cctx) {
        cctx.clearRect(0, 0, cctx.canvas.clientWidth, cctx.canvas.clientHeight);
        DrawCoordinateImage();
    }
};
var ResetFacialParts = function () {
    if (fpctx) {
        fpctx.clearRect(0, 0, fpctx.canvas.clientWidth, fpctx.canvas.clientHeight);
    }
};
var dataX = [];
var dataY = [];
var isMouseDrag = false;
//前フレームの点を保持する変数
var preMousePosX;
var preMousePosY;
//ドラッグ開始
coordinateCanvas.addEventListener('mousedown', function (e) {
    //前の軌跡を消去
    ResetCoordinate();
    isMouseDrag = true;
    //canvasの原点は左上
    preMousePosX = e.offsetX;
    preMousePosY = e.offsetY;
    //始点の描画
    if (cctx) {
        cctx.beginPath();
        cctx.strokeStyle = "blue";
        cctx.lineWidth = 20;
        cctx.lineCap = "round";
        cctx.globalCompositeOperation = 'source-over';
        //全フレームの点と結ぶ
        cctx.lineTo(preMousePosX, preMousePosY);
        cctx.stroke();
        if (fpctx) {
            DrawFace(e.offsetX, e.offsetY);
        }
    }
});
//ドラッグ中
var pre = 0;
var cur = 0;
var elapsedTime = 0;
var fpsInterval = (1.0 / 60) * 1000; //60fps
coordinateCanvas.addEventListener('mousemove', function (e) {
    //時刻の引き算をたす
    //60fpsにしたい
    if (isMouseDrag) {
        cur = Date.now();
        elapsedTime += cur - pre;
        if (elapsedTime > fpsInterval) {
            //canvasの原点は左上
            var mousePosX = e.offsetX;
            var mousePosY = e.offsetY;
            //軌跡の描画
            if (cctx) {
                cctx.beginPath();
                cctx.strokeStyle = Color.BLACK;
                cctx.lineWidth = 2;
                cctx.lineCap = "round";
                cctx.globalCompositeOperation = 'source-over';
                cctx.moveTo(mousePosX, mousePosY);
                //前フレームの点と結ぶ
                cctx.lineTo(preMousePosX, preMousePosY);
                cctx.stroke();
                if (fpctx) {
                    DrawFace(mousePosX, mousePosY);
                    dataX.push(mousePosX);
                    dataY.push(mousePosY);
                }
            }
            preMousePosX = mousePosX;
            preMousePosY = mousePosY;
            elapsedTime = 0;
        }
        pre = Date.now();
    }
});
//ドラッグ終わり！
coordinateCanvas.addEventListener('mouseup', function (e) {
    isMouseDrag = false;
    //終点の描画
    if (cctx) {
        cctx.beginPath();
        cctx.strokeStyle = "red";
        cctx.lineWidth = 20;
        cctx.lineCap = "round";
        cctx.globalCompositeOperation = 'source-over';
        //全フレームの点と結ぶ
        cctx.lineTo(e.offsetX, e.offsetY);
        cctx.stroke();
    }
    console.log(dataX.length);
});
var InitFacialParts = function () {
    var emotionFaceDiv = document.getElementById('emotion-face');
    var coordinateDiv = document.getElementById('coordinate');
    if (!emotionFaceDiv) {
        console.log("ERR! emotion-face div-element does not exit");
        return;
    }
    if (!coordinateDiv) {
        console.log("ERR! coordinate div-element does not exit");
        return;
    }
    corrdinate.width = coordinateDiv.clientWidth;
    corrdinate.height = coordinateDiv.clientHeight;
    var faceWidth = emotionFaceDiv.clientWidth;
    var faceHeight = emotionFaceDiv.clientWidth;
    //顔画像の中心座標
    var centerPosX = faceWidth / 2;
    var centerPosY = faceHeight / 2;
    //口の相対的な位置（中心からの距離）
    var offsetMouseWidth = faceWidth / 5;
    var offsetMouseHeight = faceHeight / 4;
    //顔アイコンにおける口の相対的な場所を求める
    //顔アイコンの大きさに変化があっても良いように
    mouse.startPosX = centerPosX - offsetMouseWidth;
    mouse.startPosY = centerPosY + offsetMouseHeight;
    mouse.bezierControlPosX = centerPosX;
    mouse.bezierControlPosY = centerPosY + offsetMouseHeight;
    mouse.endPosX = centerPosX + offsetMouseWidth;
    mouse.endPosY = centerPosY + offsetMouseHeight;
    mouse.maxUShapePos = faceWidth / 3;
    mouse.lineWidth = 4;
    //眉の相対的な場所を求める
    leftEyebrow.lineWidth = 4;
    leftEyebrow.startPosX = centerPosX - 45;
    leftEyebrow.startPosY = centerPosY - 33;
    leftEyebrow.endPosX = centerPosX - 20;
    leftEyebrow.endPosY = centerPosY - 33;
    leftEyebrow.maxEndHeight = faceHeight / 13;
    //右眉
    rightEyebrow.lineWidth = 4;
    rightEyebrow.startPosX = centerPosX + 45;
    rightEyebrow.startPosY = centerPosY - 33;
    rightEyebrow.endPosX = centerPosX + 20;
    rightEyebrow.endPosY = centerPosY - 33;
    rightEyebrow.maxEndHeight = faceHeight / 13;
    //目の設定
    rightEye.size = 25;
    rightEye.pos = 35;
    leftEye.size = 25;
    leftEye.pos = 35;
    DrawFace(corrdinate.height / 2, corrdinate.height / 2);
};
//初期設定
var Init = function () {
    DrawCoordinateImage();
    InitFacialParts();
};
var main = (function () {
    Init();
})();
window.onload = function () {
};
var faceAnimation;
var faceAnimationStep = function () {
    var progress = dataX.shift();
    var progressY = dataY.shift();
    DrawFace(progress, progressY);
    if (dataX.length != 0 || dataY.length != 0) {
        faceAnimation = requestAnimationFrame(faceAnimationStep);
    }
    else {
        cancelAnimationFrame(faceAnimation);
    }
};
var okButton = document.getElementById("decide-button");
if (okButton) {
    okButton.onclick = function () {
        console.log("Clicked!!");
        //大体60fps
        faceAnimation = requestAnimationFrame(faceAnimationStep);
    };
}
