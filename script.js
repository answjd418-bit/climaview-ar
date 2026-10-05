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

  /*
   * getUserMedia 자체가 없는 경우
   * 정적 현재 이미지로 fallback
   */

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

    /*
     * 이미 카메라가 켜져 있으면
     * 다시 요청하지 않음
     */

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


    /*
     * 권한 요청이 사용자 터치를 요구할 경우
     * 버튼 표시
     */

    cameraStartButton.hidden =
      false;

  }

}


/* 카메라 버튼 */

cameraStartButton.addEventListener(
  "click",
  async () => {

    await startCamera();

  }
);


/*
 * 최초 로딩 시 자동 시도
 */

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

    waterline:
      "2026년 현재 수면선",

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

    waterline:
      "2050년 예상 수면선 · +11.5cm",

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

    waterline:
      "2075년 예상 수면선 · +32.2cm",

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

    waterline:
      "2100년 예상 수면선 · +96.1cm",

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


const waterline =
  document.getElementById(
    "waterline"
  );


const waterlineLabel =
  document.getElementById(
    "waterline-label"
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


  /*
   * 현재로 돌아오면
   * 카메라 재시도
   */

  if (
    key === "current" &&
    !cameraStarted
  ) {

    startCamera();

  }


  /* 타임라인 */

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


  /* 정보 */

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


  waterlineLabel.textContent =
    data.waterline;


  infoCard.setAttribute(
    "aria-label",
    `${data.title} 기후 정보`
  );


  /* =====================================================
     그래프
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
   연도 버튼
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