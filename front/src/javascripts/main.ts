import "../images/Cordinate.png";
import "../images/BaseFace.png";
import "../images/Beard.png";
import "../images/BaseFaceGlasses.png";
import "../images/face.png";
import "../images/dangerman.png";
import "../stylesheets/main.scss";
import Mouse from "../javascripts/@types/mouse";
import Eyebrow from "../javascripts/@types/eyebrows";
import Eye from "../javascripts/@types/eye";
import coordinate from "../javascripts/@types/coordinate";
import PostImageData from "./PostImageData";
import ConvertRgbFormat from "./ConvertRgbFormat";
import html2canvas from "html2canvas";
import {
  INITIAL_FACE_COLOR,
  ANGRY,
  HAPPY,
  SAD,
  PLEASURE,
} from "./emotionColor";

enum Color {
  BLACK = "black",
  BLUE = "#629BEAa",
  RED = "#FF5823",
}

let mouse: Mouse = {
  startPosX: 0,
  startPosY: 0,
  bezierControlPosX: 0,
  bezierControlPosY: 0,
  endPosX: 0,
  endPosY: 0,
  maxUShapePos: 0,
  lineWidth: 0,
};

let leftEyebrow: Eyebrow = {
  startPosX: 0,
  startPosY: 0,
  endPosX: 0,
  endPosY: 0,
  lineWidth: 0,
  maxEndHeight: 0,
};
let rightEyebrow: Eyebrow = {
  startPosX: 0,
  startPosY: 0,
  endPosX: 0,
  endPosY: 0,
  lineWidth: 0,
  maxEndHeight: 0,
};

let rightEye: Eye = {
  pos: 0,
  size: 0,
};
let leftEye: Eye = {
  pos: 0,
  size: 0,
};

const emotionFaceDiv: HTMLElement | null = document.getElementById(
  "emotion-face"
);
const coordinateDiv: HTMLElement | null = document.getElementById("coordinate");

//座標部分のCanvas
const coordinateCanvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("coordinate")
);
const cctx: CanvasRenderingContext2D | null = coordinateCanvas.getContext("2d");

let corrdinate: coordinate = {
  width: 0,
  height: 0,
};

//顔の変化のデータを格納しておく。大体60fpsくらいで入る
let dataX: number[] = [];
let dataY: number[] = [];

//顔画像のBase64のデータ
let base64Images: string[] = [];

let isApplyFaceColor: boolean = false;

// 顔アイコンの口を描画のCanvas
const facialPartsCanvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("facial-parts")
);
const fpctx: CanvasRenderingContext2D | null = facialPartsCanvas.getContext(
  "2d"
);

// 顔アイコン作成Canvasの背景画像を描画
const DrawCoordinateImage = (): void => {
  let background: HTMLImageElement = new Image();
  const imageURL: string = "../images/Cordinate.png";

  background.src = imageURL;
  //画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
  background.onload = () => {
    if (cctx) {
      cctx.drawImage(
        background,
        0,
        0,
        coordinateCanvas.width,
        (background.height * coordinateCanvas.width) / background.width
      );
    }
  };
};

//顔アイコンの口パーツを描画する。X座標の大きさによって口の傾き具合が変わる
const RenderMouth = (x: number): void => {
  //x座標から口の傾きを計算する width400で-66から66くらい
  //xの値を0 ~ mouse.maxUShapePos*2の範囲に正規化
  let curveDegree = (x * (mouse.maxUShapePos * 2)) / corrdinate.width;
  if (curveDegree > mouse.maxUShapePos) {
    curveDegree = curveDegree - mouse.maxUShapePos;
  } else if (x < corrdinate.height / 2) {
    curveDegree = curveDegree - mouse.maxUShapePos;
  } else {
    //x座標が0のとき
    curveDegree = 0;
  }
  //口の描画
  if (fpctx) {
    fpctx.beginPath();
    fpctx.strokeStyle = Color.BLACK;
    fpctx.lineWidth = mouse.lineWidth;
    fpctx.lineCap = "round";
    fpctx.globalCompositeOperation = "source-over";
    fpctx.moveTo(mouse.startPosX, mouse.endPosY);
    fpctx.quadraticCurveTo(
      mouse.bezierControlPosX,
      mouse.bezierControlPosY + curveDegree,
      mouse.endPosX,
      mouse.endPosY
    );
    fpctx.stroke();
  }
};

//顔アイコンの眉パーツを描画する。Y座標の大きさによって眉の傾き具合が変わる
const RenderEyebrows = (y: number): void => {
  // y座標から眉尻の高さを計算する height:0~400で 眉:-15~15くらい
  let endOfEyebrowsHeight =
    (y * (rightEyebrow.maxEndHeight * 2)) / corrdinate.height;
  if (endOfEyebrowsHeight > rightEyebrow.maxEndHeight) {
    endOfEyebrowsHeight = endOfEyebrowsHeight - rightEyebrow.maxEndHeight;
  } else if (y < corrdinate.height / 2) {
    endOfEyebrowsHeight = endOfEyebrowsHeight - rightEyebrow.maxEndHeight;
  } else {
    //y座標が0のとき
    endOfEyebrowsHeight = 0;
  }

  //眉の描画
  if (fpctx) {
    //left
    fpctx.beginPath();
    fpctx.strokeStyle = "black";
    fpctx.lineWidth = leftEyebrow.lineWidth;
    fpctx.lineCap = "round";
    fpctx.globalCompositeOperation = "source-over";
    fpctx.moveTo(
      leftEyebrow.startPosX,
      leftEyebrow.startPosY + endOfEyebrowsHeight
    ); //眉尻
    fpctx.lineTo(leftEyebrow.endPosX, leftEyebrow.endPosY);
    fpctx.stroke();

    //right
    fpctx.beginPath();
    fpctx.strokeStyle = "black";
    fpctx.lineWidth = rightEyebrow.lineWidth;
    fpctx.lineCap = "round";
    fpctx.globalCompositeOperation = "source-over";
    fpctx.moveTo(
      rightEyebrow.startPosX,
      rightEyebrow.startPosY + endOfEyebrowsHeight
    ); //眉尻
    fpctx.lineTo(rightEyebrow.endPosX, rightEyebrow.endPosY);
    fpctx.stroke();
  }
};

const RenderEye = (): void => {
  if (fpctx) {
    //左目
    fpctx.beginPath();
    fpctx.strokeStyle = "black";
    fpctx.lineWidth = leftEye.size;
    fpctx.lineCap = "round";
    fpctx.globalCompositeOperation = "source-over";
    fpctx.lineTo(
      facialPartsCanvas.clientWidth / 2 - leftEye.pos,
      facialPartsCanvas.clientHeight / 2
    );
    fpctx.stroke();

    //右目
    fpctx.beginPath();
    fpctx.strokeStyle = "black";
    fpctx.lineWidth = rightEye.size;
    fpctx.lineCap = "round";
    fpctx.globalCompositeOperation = "source-over";
    fpctx.lineTo(
      facialPartsCanvas.clientWidth / 2 + rightEye.pos,
      facialPartsCanvas.clientHeight / 2
    );
    fpctx.stroke();
  }
};

const DrawFace = (x: number, y: number): void => {
  ResetFacialParts();
  RenderMouth(x);
  RenderEye();
  RenderEyebrows(y);
};

const ResetCoordinate = (): void => {
  if (cctx) {
    cctx.clearRect(0, 0, cctx.canvas.clientWidth, cctx.canvas.clientHeight);
    dataX.splice(0);
    dataY.splice(0);

    DrawCoordinateImage();
  }
};

const ResetFacialParts = (): void => {
  if (fpctx) {
    fpctx.clearRect(0, 0, fpctx.canvas.clientWidth, fpctx.canvas.clientHeight);
  }
};

const CalculateColor = (
  x: number,
  y: number,
  zone: number
): { r: number; g: number; b: number } => {
  let r = 255;
  let g = 255;
  let b = 255;
  switch (zone) {
    case 1:
      //怒りx
      r =
        INITIAL_FACE_COLOR.r +
        (ANGRY.r - INITIAL_FACE_COLOR.r) * (1.0 - x / 160);
      g =
        INITIAL_FACE_COLOR.g +
        (ANGRY.g - INITIAL_FACE_COLOR.g) * (1.0 - x / 160);
      b =
        INITIAL_FACE_COLOR.b +
        (ANGRY.b - INITIAL_FACE_COLOR.b) * (1.0 - x / 160);
      break;

    case 2:
      //怒りy
      r =
        INITIAL_FACE_COLOR.r +
        (ANGRY.r - INITIAL_FACE_COLOR.r) * (1.0 - y / 160);
      g =
        INITIAL_FACE_COLOR.g +
        (ANGRY.g - INITIAL_FACE_COLOR.g) * (1.0 - y / 160);
      b =
        INITIAL_FACE_COLOR.b +
        (ANGRY.b - INITIAL_FACE_COLOR.b) * (1.0 - y / 160);
      break;

    case 3:
      //悲しみx
      r = INITIAL_FACE_COLOR.r + (SAD.r - INITIAL_FACE_COLOR.r) * (y / 160);
      g = INITIAL_FACE_COLOR.g + (SAD.g - INITIAL_FACE_COLOR.g) * (y / 160);
      b = INITIAL_FACE_COLOR.b + (SAD.b - INITIAL_FACE_COLOR.b) * (y / 160);
      break;

    case 4:
      //悲しみx
      r =
        INITIAL_FACE_COLOR.r + (SAD.r - INITIAL_FACE_COLOR.r) * (1.0 - x / 160);
      g =
        INITIAL_FACE_COLOR.g + (SAD.g - INITIAL_FACE_COLOR.g) * (1.0 - x / 160);
      b =
        INITIAL_FACE_COLOR.b + (SAD.b - INITIAL_FACE_COLOR.b) * (1.0 - x / 160);
      break;

    case 5:
      //楽しみ
      r =
        INITIAL_FACE_COLOR.r + (PLEASURE.r - INITIAL_FACE_COLOR.r) * (x / 160);
      g =
        INITIAL_FACE_COLOR.g + (PLEASURE.g - INITIAL_FACE_COLOR.g) * (x / 160);
      b =
        INITIAL_FACE_COLOR.b + (PLEASURE.b - INITIAL_FACE_COLOR.b) * (x / 160);
      break;

    case 6:
      //楽しみx>y:xが増加するほど色に近く
      r =
        INITIAL_FACE_COLOR.r + (PLEASURE.r - INITIAL_FACE_COLOR.r) * (y / 160);
      g =
        INITIAL_FACE_COLOR.g + (PLEASURE.g - INITIAL_FACE_COLOR.g) * (y / 160);
      b =
        INITIAL_FACE_COLOR.b + (PLEASURE.b - INITIAL_FACE_COLOR.b) * (y / 160);
      break;

    case 7:
      //happy x>y: yが減少するほど色に近く

      r = INITIAL_FACE_COLOR.r + (HAPPY.r - INITIAL_FACE_COLOR.r) * (y / 160);
      g = INITIAL_FACE_COLOR.g + (HAPPY.g - INITIAL_FACE_COLOR.g) * (y / 160);
      b = INITIAL_FACE_COLOR.b + (HAPPY.b - INITIAL_FACE_COLOR.b) * (y / 160);
      break;

    case 8:
      //happy x<y:x画像するほど色に近く
      r = INITIAL_FACE_COLOR.r + (HAPPY.r - INITIAL_FACE_COLOR.r) * (x / 160);
      g = INITIAL_FACE_COLOR.g + (HAPPY.g - INITIAL_FACE_COLOR.g) * (x / 160);
      b = INITIAL_FACE_COLOR.b + (HAPPY.b - INITIAL_FACE_COLOR.b) * (x / 160);
      break;
  }
  return { r, g, b };
};

//x座標とy座標から感情に対応した色人変化させる
const SetEmotionColor = (x: number, y: number): void => {
  if (x >= 0 && x < 160 && y >= 0 && y <= 160) {
    // x: 0 ~ 200 && y: 0 ~ 200 -> 怒り
    let faceColor = { r: 255, g: 0, b: 0 };
    if (x >= y) {
      faceColor = CalculateColor(x, y, 1);
    } else {
      faceColor = CalculateColor(x, y, 2);
    }

    if (emotionFaceDiv) {
      emotionFaceDiv.style.backgroundColor = ConvertRgbFormat(
        faceColor.r,
        faceColor.g,
        faceColor.b
      );
    }
  } else if (x >= 0 && x <= 160 && y > 240 && y <= 400) {
    // x: 0 ~ 200 && y: 200 ~ 400 -> 悲しみ

    let faceColor = { r: 255, g: 0, b: 0 };
    if (160 - x >= y - 240) {
      faceColor = CalculateColor(160 - x, y - 240, 3);
    } else {
      faceColor = CalculateColor(x, y, 4);
    }

    if (emotionFaceDiv) {
      emotionFaceDiv.style.backgroundColor = ConvertRgbFormat(
        faceColor.r,
        faceColor.g,
        faceColor.b
      );
    }
  } else if (x >= 240 && x <= 400 && y > 240 && y <= 400) {
    // x: 200 ~ 400 && y: 0 ~ 200 -> 喜び
    let faceColor = { r: 255, g: 0, b: 0 };
    if (x >= y) {
      faceColor = CalculateColor(x - 240, y - 240, 6);
    } else {
      faceColor = CalculateColor(x - 240, y - 240, 5);
    }

    if (emotionFaceDiv) {
      emotionFaceDiv.style.backgroundColor = ConvertRgbFormat(
        faceColor.r,
        faceColor.g,
        faceColor.b
      );
    }
  } else if (x >= 240 && x <= 400 && y >= 0 && y <= 160) {
    // x: 200 ~ 400 && y: 200 ~ 400 -> 楽しみ
    let faceColor = { r: 255, g: 0, b: 0 };
    if (x - 240 > 160 - y) {
      faceColor = CalculateColor(x - 240, 160 - y, 7);
    } else if (x - 240 === 160 - y) {
      console.log("SAME");
    } else {
      faceColor = CalculateColor(x - 240, 160 - y, 8);
    }
    if (emotionFaceDiv) {
      emotionFaceDiv.style.backgroundColor = ConvertRgbFormat(
        faceColor.r,
        faceColor.g,
        faceColor.b
      );
    }
  } else {
    if (emotionFaceDiv) {
      emotionFaceDiv.style.backgroundColor = ConvertRgbFormat(
        INITIAL_FACE_COLOR.r,
        INITIAL_FACE_COLOR.g,
        INITIAL_FACE_COLOR.b
      );
    }
  }
};

let isMouseDrag: boolean = false;
//前フレームの点を保持する変数
let preMousePosX: number;
let preMousePosY: number;
//ドラッグ開始
coordinateCanvas.addEventListener("mousedown", (e: MouseEvent) => {
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
    cctx.globalCompositeOperation = "source-over";
    //全フレームの点と結ぶ
    cctx.lineTo(preMousePosX, preMousePosY);
    cctx.stroke();

    if (fpctx) {
      DrawFace(e.offsetX, e.offsetY);
    }
  }
});

//ドラッグ中
let pre: any = 0;
let cur: any = 0;
let elapsedTime: number = 0;
const fpsInterval: number = (1.0 / 30) * 1000; //60fps
let faceScale: number = 1.0;
coordinateCanvas.addEventListener("mousemove", (e: MouseEvent) => {
  //時刻の引き算をたす
  //60fpsにしたい
  if (isMouseDrag) {
    cur = Date.now();
    elapsedTime += cur - pre;
    if (elapsedTime > fpsInterval) {
      //canvasの原点は左上
      const mousePosX: number = e.offsetX;
      const mousePosY: number = e.offsetY;

      //軌跡の描画
      if (cctx) {
        cctx.beginPath();
        cctx.strokeStyle = Color.BLACK;
        cctx.lineWidth = 2;
        cctx.lineCap = "round";
        cctx.globalCompositeOperation = "source-over";
        cctx.moveTo(mousePosX, mousePosY);
        //前フレームの点と結ぶ
        cctx.lineTo(preMousePosX, preMousePosY);
        cctx.stroke();

        if (fpctx) {
          DrawFace(mousePosX, mousePosY);
          //画像の64進数のデータにする
          // base64Images.push(facialPartsCanvas.toDataURL());
          html2canvas(emotionFaceDiv, {
            scale: faceScale,
          }).then((canvas) => {
            base64Images.push(canvas.toDataURL());
            // console.log(canvas.toDataURL());
          });
          dataX.push(mousePosX);
          dataY.push(mousePosY);
          //座標によって顔アイコンの顔を変化させる
          //SetEmotionColor(preMousePosX, preMousePosY);
        }
      }
      preMousePosX = mousePosX;
      preMousePosY = mousePosY;
      if (isApplyFaceColor) {
        SetEmotionColor(preMousePosX, preMousePosY);
      }
      elapsedTime = 0;
    }
    pre = Date.now();
  }
});

//ドラッグ終わり！
coordinateCanvas.addEventListener("mouseup", (e: MouseEvent) => {
  isMouseDrag = false;
  //終点の描画
  if (cctx) {
    cctx.beginPath();
    cctx.strokeStyle = "red";
    cctx.lineWidth = 20;
    cctx.lineCap = "round";
    cctx.globalCompositeOperation = "source-over";
    //全フレームの点と結ぶ
    cctx.lineTo(e.offsetX, e.offsetY);
    cctx.stroke();
  }
});

const InitFacialParts = (): void => {
  if (!emotionFaceDiv) {
    console.log("ERR! emotion-face div-element does not exit");
    return;
  }
  // emotionFaceDiv.style.backgroundImage = "url(../images/BaseFace.png)";
  emotionFaceDiv.style.backgroundColor = ConvertRgbFormat(255, 194, 0);
  //  $elementReference.style.backgroundImage = "url( " + $image + " )";

  if (!coordinateDiv) {
    console.log("ERR! coordinate div-element does not exit");
    return;
  }

  corrdinate.width = coordinateDiv.clientWidth;
  corrdinate.height = coordinateDiv.clientHeight;

  const faceWidth = emotionFaceDiv.clientWidth;
  const faceHeight = emotionFaceDiv.clientWidth;

  //顔画像の中心座標
  const centerPosX: number = faceWidth / 2;
  const centerPosY: number = faceHeight / 2;

  //口の相対的な位置（中心からの距離）
  const offsetMouseWidth: number = faceWidth / 5;
  const offsetMouseHeight: number = faceHeight / 4;

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
const Init = (): void => {
  DrawCoordinateImage();
  InitFacialParts();
};

const main = (() => {
  Init();
})();

window.onload = () => {};

let faceAnimation: any;
let pullDataX: number[] = [];
let pullDataY: number[] = [];
const faceAnimationStep = (): void => {
  let progress: any = pullDataX.shift();
  let progressY: any = pullDataY.shift();

  DrawFace(progress, progressY);

  if (pullDataX.length != 0 || pullDataY.length != 0) {
    faceAnimation = requestAnimationFrame(faceAnimationStep);
  } else {
    cancelAnimationFrame(faceAnimation);
  }
};

//画像データをpostように１行の文字列に変換する
const FormatImageData = (base64Images: string[]): string => {
  const images: string[] = base64Images.map((imageWithInfo) => {
    return imageWithInfo.split(",")[1] + ",";
  });

  const imageDataLine: string = images.reduce((str1, str2) => str1 + str2);
  return imageDataLine;
};

const GCE_URL = "//34.84.133.169/returnGIF";
const GCE_2_URL = "http://35.200.88.160/returnGIF";
const localURL = "http://0.0.0.0:80/returnGIF";
const GCS_URL = "https://storage.googleapis.com/faceicons/";
const imgElement = document.getElementById("gif");
const gifDownload = <HTMLAnchorElement>imgElement;

const okButton = document.getElementById("decide-button");
if (okButton) {
  okButton.onclick = async () => {
    //大体60fps
    pullDataX = dataX.concat();
    pullDataY = dataY.concat();
    faceAnimation = requestAnimationFrame(faceAnimationStep);

    await PostImageData(FormatImageData(base64Images), GCE_URL)
      .then((image_name) => {
        console.log(`${image_name}が届いたよ`);
        setGIF(image_name);
      })
      .catch((err) => {
        console.log("Hello");
      });
  };
}

const gif: HTMLElement | null = document.getElementById("gif");
const gifImage = <HTMLImageElement>gif;
const setGIF = (name: string) => {
  if (gif) {
    gifImage.src = `${GCS_URL}${name}`;
  }
};

const baseFaceSelectButtonNormal = document.getElementById(
  "mask-select-area-normal"
);
if (baseFaceSelectButtonNormal) {
  baseFaceSelectButtonNormal.style.backgroundImage = "url(../images/Beard.png)";

  baseFaceSelectButtonNormal.onclick = () => {
    console.log(baseFaceSelectButtonNormal);
    emotionFaceDiv.style.backgroundImage = "url(../images/BaseFace.png)";
  };
}

const baseFaceSelectButtonCat = document.getElementById("mask-select-area-cat");
baseFaceSelectButtonCat.style.backgroundImage = "url(../images/Beard.png)";

if (baseFaceSelectButtonCat) {
  baseFaceSelectButtonCat.onclick = () => {
    emotionFaceDiv.style.backgroundImage = "url(../images/Beard.png)";
  };
}

const baseFaceSelectButtonGlasses = document.getElementById(
  "mask-select-area-glasses"
);
if (baseFaceSelectButtonGlasses) {
  baseFaceSelectButtonGlasses.onclick = () => {
    emotionFaceDiv.style.backgroundImage = "url(../images/BaseFaceGlasses.png)";
  };
}

let preDom: HTMLDivElement = undefined;
const setFaceSize = (size: number, dom: HTMLDivElement) => {
  dom.style.backgroundColor = "red";
  faceScale = size / 200;
};

const sizeSelectAreaDiv = document.getElementById("size-select-area");
if (sizeSelectAreaDiv) {
  console.log("hello, sizeSelectIDv");
  const normalSize = document.createElement("div");
  normalSize.style.height = "200px";
  normalSize.style.width = "200px";
  normalSize.style.cursor = "pointer";
  normalSize.onclick = () => {
    setFaceSize(200, normalSize);
  };
  normalSize.style.backgroundImage = "url(../images/face.png)";
  normalSize.style.backgroundSize = "cover";

  const size150 = document.createElement("div");
  size150.style.height = "150px";
  size150.style.width = "150px";
  size150.style.cursor = "pointer";

  size150.onclick = () => {
    setFaceSize(150, size150);
  };
  size150.style.backgroundImage = "url(../images/face.png)";
  size150.style.backgroundSize = "cover";

  const size100 = document.createElement("div");
  size100.style.height = "100px";
  size100.style.width = "100px";
  size100.style.cursor = "pointer";

  size100.onclick = () => {
    setFaceSize(100, size100);
  };
  size100.style.backgroundImage = "url(../images/face.png)";
  size100.style.backgroundSize = "cover";

  const size50 = document.createElement("div");
  size50.style.height = "50px";
  size50.style.width = "50px";
  size50.style.cursor = "pointer";

  size50.onclick = () => {
    setFaceSize(50, size50);
  };
  size50.style.backgroundImage = "url(../images/face.png)";
  size50.style.backgroundSize = "cover";

  sizeSelectAreaDiv.appendChild(normalSize);
  sizeSelectAreaDiv.appendChild(size150);
  sizeSelectAreaDiv.appendChild(size100);
  sizeSelectAreaDiv.appendChild(size50);
}

const settingFaceColorDom = document.getElementById("setting-face-color");
const settingColorButton = <HTMLInputElement>settingFaceColorDom;
if (settingColorButton) {
  settingColorButton.onclick = () => {
    if (settingColorButton.checked) {
      console.log("cheked");
      isApplyFaceColor = true;
    } else {
      isApplyFaceColor = false;
    }
  };
}

//color-map
const colorMapCanvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("color-map")
);
const cmctx: CanvasRenderingContext2D | null = colorMapCanvas.getContext("2d");

if (cmctx) {
  cmctx.clearRect(0, 0, cmctx.canvas.clientWidth, cmctx.canvas.clientHeight);
}

// キャンバス全体のピクセル情報を取得
let imageData = cmctx.getImageData(
  0,
  0,
  colorMapCanvas.width,
  colorMapCanvas.height
);
let width = imageData.width;
let height = imageData.height;

let pixels = imageData.data; // ピクセル配列：RGBA4要素で1ピクセル

// ピクセル単位で操作できる
for (let y = 0; y < height; ++y) {
  for (let x = 0; x < width; ++x) {
    let faceColor = { r: 255, g: 194, b: 0 };
    if (x >= 0 && x <= 160 && y >= 0 && y <= 160) {
      // x: 0 ~ 200 && y: 0 ~ 200 -> 怒り
      if (x >= y) {
        faceColor = CalculateColor(x, y, 1);
      } else {
        faceColor = CalculateColor(x, y, 2);
      }
    } else if (x >= 0 && x <= 160 && y >= 240 && y <= 400) {
      // x: 0 ~ 200 && y: 200 ~ 400 -> 悲しみ

      if (160 - x >= y - 240) {
        faceColor = CalculateColor(160 - x, y - 240, 3);
      } else {
        faceColor = CalculateColor(x, y, 4);
      }
    } else if (x >= 240 && x <= 400 && y >= 240 && y <= 400) {
      // x: 200 ~ 400 && y: 0 ~ 200 -> 喜び
      if (x >= y) {
        faceColor = CalculateColor(x - 240, y - 240, 6);
      } else {
        faceColor = CalculateColor(x - 240, y - 240, 5);
      }
    } else if (x >= 240 && x <= 400 && y >= 0 && y <= 160) {
      // x: 200 ~ 400 && y: 200 ~ 400 -> 楽しみ
      if (x - 240 >= 160 - y) {
        faceColor = CalculateColor(x - 240, 160 - y, 7);
      } else {
        faceColor = CalculateColor(x - 240, 160 - y, 8);
      }
    }

    let base = (y * width + x) * 4;
    // なんかピクセルに書き込む
    pixels[base + 0] = faceColor.r; // Red
    pixels[base + 1] = faceColor.g; // Green
    pixels[base + 2] = faceColor.b; // Blue
    pixels[base + 3] = 255; // Alpha
  }
}

// 変更した内容をキャンバスに書き戻す
cmctx.putImageData(imageData, 0, 0);

console.log(colorMapCanvas.toDataURL());