"use strict";


/* =========================================================
   화면 비율
========================================================= */

const scene =
  document.getElementById(
    "scene"
  );


function fitScene() {

  const scale =
    Math.min(
      window.innerWidth / 1366,
      window.innerHeight / 1024
    );


  scene.style.setProperty(
    "--scene-scale",
    scale
  );


  scene.style.position =
    "absolute";


  scene.style.left =
    `${
      (
        window.innerWidth
        - 1366
      ) / 2
    }px`;


  scene.style.top =
    `${
      (
        window.innerHeight
        - 1024
      ) / 2
    }px`;

}


fitScene();


window.addEventListener(
  "resize",
  fitScene
);



/* =========================================================
   카메라
========================================================= */

const cameraFeed =
  document.getElementById(
    "camera-feed"
  );


const cameraStartButton =
  document.getElementById(
    "camera-start-button"
  );


let cameraStream =
  null;


let cameraStarted =
  false;



async function startCamera() {

  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {

    console.warn(
      "이 브라우저에서는 카메라 접근을 사용할 수 없습니다."
    );


    cameraStartButton.hidden =
      true;


    return;

  }


  try {

    if (
      cameraStarted &&
      cameraStream
    ) {

      return;

    }


    cameraStream =
      await navigator.mediaDevices.getUserMedia({

        video: {

          facingMode: {
            ideal:
              "environment"
          },


          width: {
            ideal:
              1920
          },


          height: {
            ideal:
              1080
          }

        },


        audio:
          false

      });


    cameraFeed.srcObject =
      cameraStream;


    await cameraFeed.play();


    cameraStarted =
      true;


    cameraStartButton.hidden =
      true;


    console.log(
      "ClimaView 카메라 시작 완료"
    );

  }


  catch (error) {

    console.warn(
      "카메라 자동 시작 실패:",
      error
    );


    cameraStartButton.hidden =
      false;

  }

}



cameraStartButton.addEventListener(
  "click",
  async () => {

    await startCamera();

  }
);



startCamera();



/* =========================================================
   연도별 데이터
========================================================= */

const climateData = {


  current: {

    title:
      "2026년 현재의 한강",

    seaLevel:
      "+0",

    temperature:
      "11.7°C",

    floodImpact:
      "없음",

    warningArea:
      "해당 없음",

    waterlineImage:
      null,

    chartValue:
      "+0 cm",

    selectedX:
      null,

    selectedY:
      null,

    riskLeft:
      null,

    riskRight:
      null

  },


  2050: {

    title:
      "2050년의 한강",

    seaLevel:
      "+11.5",

    temperature:
      "14.4°C  (약 2.7°C 상승)",

    floodImpact:
      "낮음",

    warningArea:
      "반포 한강공원 저지대 일대",

    waterlineImage:
      "./2050_waterline.png",

    chartValue:
      "+11.5 cm",

    selectedX:
      102,

    selectedY:
      104,

    riskLeft:
      58,

    riskRight:
      150

  },


  2075: {

    title:
      "2075년의 한강",

    seaLevel:
      "+32.2",

    temperature:
      "17.2°C  (약 5.5°C 상승)",

    floodImpact:
      "중간",

    warningArea:
      "반포 한강공원, 한강 산책로",

    waterlineImage:
      "./2075_waterline.png",

    chartValue:
      "+32.2 cm",

    selectedX:
      224,

    selectedY:
      76,

    riskLeft:
      168,

    riskRight:
      277

  },


  2100: {

    title:
      "2100년의 한강",

    seaLevel:
      "+96.1",

    temperature:
      "18.9°C  (약 7.2°C 상승)",

    floodImpact:
      "높음",

    warningArea:
      "반포 한강공원, 한강변 전역",

    waterlineImage:
      "./2100_waterline.png",

    chartValue:
      "+96.1 cm",

    selectedX:
      265,

    selectedY:
      63,

    riskLeft:
      215,

    riskRight:
      310

  }

};



/* =========================================================
   DOM
========================================================= */

const yearButtons =
  document.querySelectorAll(
    ".year[data-year]"
  );


const infoCard =
  document.getElementById(
    "info-card"
  );


const infoTitle =
  document.getElementById(
    "info-title"
  );


const seaLevelValue =
  document.getElementById(
    "sea-level-value"
  );


const waterTemperature =
  document.getElementById(
    "water-temperature"
  );


const floodImpact =
  document.getElementById(
    "flood-impact"
  );


const warningArea =
  document.getElementById(
    "warning-area"
  );


const waterlineImage =
  document.getElementById(
    "waterline-image"
  );


const selectedPoint =
  document.getElementById(
    "chart-selected-point"
  );


const chartValueLabel =
  document.getElementById(
    "chart-value-label"
  );


const chartValueText =
  document.getElementById(
    "chart-value-text"
  );


const riskGradient =
  document.getElementById(
    "risk-gradient"
  );



/* =========================================================
   연도 변경
========================================================= */

function changeYear(key) {

  const data =
    climateData[key];


  if (!data) {
    return;
  }


  document.body.dataset.year =
    key;



  /* 현재 화면으로 돌아오면 카메라 재시도 */

  if (
    key === "current" &&
    !cameraStarted
  ) {

    startCamera();

  }



  /* 타임라인 버튼 상태 변경 */

  yearButtons.forEach(
    (button) => {

      const selected =
        button.dataset.year ===
        key;


      button.classList.toggle(
        "selected",
        selected
      );


      button.setAttribute(
        "aria-pressed",
        String(selected)
      );

    }
  );



  /* 오른쪽 정보 카드 */

  infoTitle.textContent =
    data.title;


  seaLevelValue.textContent =
    data.seaLevel;


  waterTemperature.textContent =
    data.temperature;


  floodImpact.textContent =
    data.floodImpact;


  warningArea.textContent =
    data.warningArea;


  infoCard.setAttribute(
    "aria-label",
    `${data.title} 기후 정보`
  );



  /* 침수 PNG 변경 */

  if (
    data.waterlineImage
  ) {

    waterlineImage.src =
      data.waterlineImage;

  }



  /* =====================================================
     현재 화면
  ====================================================== */

  if (
    key === "current"
  ) {

    selectedPoint.style.display =
      "none";


    chartValueLabel.style.opacity =
      "0";


    return;

  }



  /* =====================================================
     미래 연도 그래프
  ====================================================== */

  selectedPoint.style.display =
    "block";


  selectedPoint.setAttribute(
    "cx",
    data.selectedX
  );


  selectedPoint.setAttribute(
    "cy",
    data.selectedY
  );


  chartValueText.textContent =
    data.chartValue;


  chartValueLabel.style.opacity =
    "1";


  chartValueLabel.setAttribute(
    "transform",
    `translate(
      ${data.selectedX}
      ${data.selectedY - 8}
    )`
  );


  riskGradient.setAttribute(
    "x1",
    data.riskLeft
  );


  riskGradient.setAttribute(
    "x2",
    data.riskRight
  );

}



/* =========================================================
   연도 버튼 클릭
========================================================= */

yearButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        changeYear(
          button.dataset.year
        );

      }
    );

  }
);



/* =========================================================
   메뉴
========================================================= */

const menuButtons =
  document.querySelectorAll(
    ".menu[aria-controls]"
  );


function closeMenu(
  button
) {

  const panel =
    document.getElementById(
      button.getAttribute(
        "aria-controls"
      )
    );


  if (!panel) {
    return;
  }


  button.setAttribute(
    "aria-expanded",
    "false"
  );


  panel.classList.remove(
    "open"
  );


  panel.setAttribute(
    "aria-hidden",
    "true"
  );

}



menuButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        const shouldOpen =
          button.getAttribute(
            "aria-expanded"
          ) !== "true";


        /* 다른 메뉴 먼저 닫기 */

        menuButtons.forEach(
          closeMenu
        );


        if (!shouldOpen) {
          return;
        }


        const panel =
          document.getElementById(
            button.getAttribute(
              "aria-controls"
            )
          );


        if (!panel) {
          return;
        }


        button.setAttribute(
          "aria-expanded",
          "true"
        );


        panel.classList.add(
          "open"
        );


        panel.setAttribute(
          "aria-hidden",
          "false"
        );

      }
    );

  }
);



/* =========================================================
   초기 화면
========================================================= */

changeYear(
  "current"
);