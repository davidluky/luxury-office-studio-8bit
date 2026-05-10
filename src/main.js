import "./styles.css";

const sceneCanvas = document.querySelector("#sceneCanvas");
const sceneCtx = sceneCanvas.getContext("2d");
const renderForm = document.querySelector("#renderForm");
const renderButton = document.querySelector("#renderButton");
const approveImageButton = document.querySelector("#approveImageButton");
const newImageButton = document.querySelector("#newImageButton");
const downloadImageButton = document.querySelector("#downloadImageButton");
const approvalStatus = document.querySelector("#approvalStatus");
const audioInput = document.querySelector("#audioInput");
const audioList = document.querySelector("#audioList");
const hoursInput = document.querySelector("#hoursInput");
const minutesInput = document.querySelector("#minutesInput");
const widthInput = document.querySelector("#widthInput");
const heightInput = document.querySelector("#heightInput");
const fpsInput = document.querySelector("#fpsInput");
const audioModeInput = document.querySelector("#audioModeInput");
const videoSettings = document.querySelector("#videoSettings");
const progressTitle = document.querySelector("#progressTitle");
const progressPercent = document.querySelector("#progressPercent");
const progressFill = document.querySelector("#progressFill");
const progressDescription = document.querySelector("#progressDescription");
const downloadArea = document.querySelector("#downloadArea");

let audioFiles = [];
let currentSeed = Date.now();
let lastDownloadUrl = "";
let imageApproved = false;
let isRendering = false;
let currentImageIndex = 0;

const generatedImageSources = [
  "/assets/office-cinematic-1.png",
  "/assets/office-cinematic-2.png",
  "/assets/office-cinematic-3.png"
];
const loadedImages = new Map();

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "--:--";
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = (total % 60).toString().padStart(2, "0");
  return hours ? `${hours}h ${mins}min ${secs}s` : `${mins}min ${secs}s`;
};

const createRng = (seed) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

async function loadGeneratedImage(src) {
  if (loadedImages.has(src)) return loadedImages.get(src);

  const image = new Image();
  image.decoding = "async";
  image.src = src;

  await new Promise((resolve, reject) => {
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", () => reject(new Error(`Não foi possível carregar ${src}.`)), { once: true });
  });

  loadedImages.set(src, image);
  return image;
}

function drawCoverImage(ctx, image, width, height) {
  const sourceRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = image.naturalWidth;
  let sh = image.naturalHeight;

  if (sourceRatio > targetRatio) {
    sw = Math.round(image.naturalHeight * targetRatio);
    sx = Math.round((image.naturalWidth - sw) / 2);
  } else if (sourceRatio < targetRatio) {
    sh = Math.round(image.naturalWidth / targetRatio);
    sy = Math.round((image.naturalHeight - sh) / 2);
  }

  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
}

function setProgress(percent, title, description) {
  const safePercent = clamp(Math.round(percent), 0, 100);
  progressFill.style.width = `${safePercent}%`;
  progressPercent.textContent = `${safePercent}%`;
  progressTitle.textContent = title;
  progressDescription.textContent = description;
}

function getCurrentMode() {
  return new FormData(renderForm).get("mode");
}

function updateRenderAvailability() {
  const mode = getCurrentMode();
  const needsImageApproval = mode === "video";
  renderButton.textContent = mode === "video" ? "Gerar vídeo" : "Gerar áudio";
  renderButton.disabled = isRendering || (needsImageApproval && !imageApproved);
  approveImageButton.disabled = isRendering || imageApproved;
  newImageButton.disabled = isRendering;
  downloadImageButton.disabled = isRendering;
}

function setImageApproval(approved) {
  imageApproved = approved;
  approvalStatus.dataset.state = approved ? "approved" : "pending";
  approvalStatus.textContent = approved ? "Imagem aprovada" : "Aguardando aprovação";
  updateRenderAvailability();
}

function clearDownloads() {
  if (lastDownloadUrl) {
    URL.revokeObjectURL(lastDownloadUrl);
    lastDownloadUrl = "";
  }
  downloadArea.hidden = true;
  downloadArea.replaceChildren();
}

function exposeDownload(blob, fileName, label) {
  clearDownloads();
  lastDownloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = lastDownloadUrl;
  link.download = fileName;
  link.textContent = label;
  downloadArea.append(link);
  downloadArea.hidden = false;
}

async function drawLuxuryOffice(index = currentImageIndex) {
  currentImageIndex = index;
  currentSeed = Date.now();
  sceneCanvas.width = 1920;
  sceneCanvas.height = 1080;
  const ctx = sceneCtx;

  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0, 0, sceneCanvas.width, sceneCanvas.height);
  ctx.fillStyle = "#030406";
  ctx.fillRect(0, 0, sceneCanvas.width, sceneCanvas.height);

  const source = generatedImageSources[currentImageIndex];
  const image = await loadGeneratedImage(source);
  drawCoverImage(ctx, image, sceneCanvas.width, sceneCanvas.height);
}

function drawCinematicBackdrop(ctx, rng) {
  const sky = ctx.createLinearGradient(0, 0, 0, 1080);
  sky.addColorStop(0, "#02060b");
  sky.addColorStop(0.45, "#07111c");
  sky.addColorStop(0.78, "#111417");
  sky.addColorStop(1, "#030404");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 1920, 1080);

  const moonGlow = ctx.createRadialGradient(1450, 130, 10, 1450, 130, 390);
  moonGlow.addColorStop(0, "rgba(166, 199, 219, 0.46)");
  moonGlow.addColorStop(0.34, "rgba(72, 106, 132, 0.18)");
  moonGlow.addColorStop(1, "rgba(2, 6, 11, 0)");
  ctx.fillStyle = moonGlow;
  ctx.fillRect(980, 0, 850, 530);

  ctx.save();
  ctx.globalAlpha = 0.7;
  for (let layer = 0; layer < 3; layer += 1) {
    const baseY = 520 + layer * 74;
    const minH = 150 + layer * 50;
    const maxH = 430 + layer * 70;
    let x = -90;
    while (x < 2020) {
      const w = 44 + Math.floor(rng() * 94);
      const h = minH + Math.floor(rng() * (maxH - minH));
      const y = baseY - h;
      ctx.fillStyle = layer === 0 ? "#0a1a28" : layer === 1 ? "#07131d" : "#050b11";
      ctx.fillRect(x, y, w, h);

      const lightChance = layer === 0 ? 0.38 : 0.23;
      for (let wx = x + 10; wx < x + w - 8; wx += 17) {
        for (let wy = y + 20; wy < baseY - 10; wy += 24) {
          if (rng() < lightChance) {
            const warm = rng() > 0.42;
            ctx.fillStyle = warm ? "rgba(241, 183, 89, 0.75)" : "rgba(117, 191, 222, 0.48)";
            ctx.fillRect(wx, wy, 6, 8);
          }
        }
      }
      x += w + Math.floor(rng() * 28);
    }
  }
  ctx.restore();
}

function drawRainyWindows(ctx, rng) {
  const panes = [
    [118, 82, 520, 690],
    [680, 82, 560, 690],
    [1282, 82, 520, 690]
  ];

  ctx.fillStyle = "#060809";
  ctx.fillRect(0, 0, 1920, 82);
  ctx.fillRect(0, 772, 1920, 308);
  ctx.fillRect(0, 82, 118, 690);
  ctx.fillRect(638, 82, 42, 690);
  ctx.fillRect(1240, 82, 42, 690);
  ctx.fillRect(1802, 82, 118, 690);

  panes.forEach(([x, y, w, h], paneIndex) => {
    const glass = ctx.createLinearGradient(x, y, x + w, y + h);
    glass.addColorStop(0, "rgba(34, 73, 92, 0.18)");
    glass.addColorStop(0.48, "rgba(137, 160, 164, 0.07)");
    glass.addColorStop(1, "rgba(5, 7, 10, 0.28)");
    ctx.fillStyle = glass;
    ctx.fillRect(x, y, w, h);

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    ctx.strokeStyle = "rgba(196, 219, 221, 0.16)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 90; i += 1) {
      const sx = x + rng() * w;
      const sy = y + rng() * h;
      const len = 22 + rng() * 78;
      ctx.globalAlpha = 0.2 + rng() * 0.38;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - 8 - rng() * 12, sy + len);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.22;
    ctx.fillStyle = paneIndex === 1 ? "#d5e8f1" : "#7fb4c8";
    for (let i = 0; i < 22; i += 1) {
      const rx = x + rng() * w;
      const ry = y + rng() * h;
      const radius = 2 + rng() * 7;
      ctx.beginPath();
      ctx.arc(rx, ry, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  });

  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, 1920, 82);
  ctx.fillRect(0, 772, 1920, 46);
  ctx.fillRect(0, 0, 118, 818);
  ctx.fillRect(638, 0, 42, 818);
  ctx.fillRect(1240, 0, 42, 818);
  ctx.fillRect(1802, 0, 118, 818);

  const frameGlow = ctx.createLinearGradient(0, 82, 0, 818);
  frameGlow.addColorStop(0, "rgba(220, 195, 130, 0.22)");
  frameGlow.addColorStop(0.42, "rgba(220, 195, 130, 0.05)");
  frameGlow.addColorStop(1, "rgba(0, 0, 0, 0.4)");
  ctx.fillStyle = frameGlow;
  ctx.fillRect(96, 76, 1728, 12);
  ctx.fillRect(96, 772, 1728, 12);
}

function drawLuxuryInterior(ctx, rng) {
  const floor = ctx.createLinearGradient(0, 770, 0, 1080);
  floor.addColorStop(0, "#17100d");
  floor.addColorStop(0.48, "#251912");
  floor.addColorStop(1, "#070504");
  ctx.fillStyle = floor;
  ctx.fillRect(0, 770, 1920, 310);

  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.strokeStyle = "#89643e";
  ctx.lineWidth = 2;
  for (let y = 814; y < 1080; y += 54) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1920, y + (y - 814) * 0.16);
    ctx.stroke();
  }
  for (let x = -260; x < 2160; x += 150) {
    ctx.beginPath();
    ctx.moveTo(x, 1080);
    ctx.lineTo(920 + (x - 920) * 0.2, 772);
    ctx.stroke();
  }
  ctx.restore();

  const deskShadow = ctx.createRadialGradient(960, 850, 110, 960, 905, 730);
  deskShadow.addColorStop(0, "rgba(0, 0, 0, 0.45)");
  deskShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = deskShadow;
  ctx.fillRect(260, 720, 1400, 320);

  const desk = ctx.createLinearGradient(280, 688, 1640, 968);
  desk.addColorStop(0, "#6f4423");
  desk.addColorStop(0.22, "#b1783d");
  desk.addColorStop(0.55, "#4c2d18");
  desk.addColorStop(1, "#140d0a");
  ctx.fillStyle = desk;
  roundedRect(ctx, 250, 680, 1420, 190, 18);
  ctx.fill();

  const deskTop = ctx.createLinearGradient(270, 650, 1650, 720);
  deskTop.addColorStop(0, "#2a1a12");
  deskTop.addColorStop(0.35, "#9c6635");
  deskTop.addColorStop(0.62, "#c28b4d");
  deskTop.addColorStop(1, "#2a170f");
  ctx.fillStyle = deskTop;
  roundedRect(ctx, 230, 636, 1460, 86, 16);
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#fff1c8";
  ctx.fillRect(340, 648, 550, 8);
  ctx.fillRect(985, 654, 460, 5);
  ctx.restore();

  drawLeatherChair(ctx);
  drawDeskObjects(ctx, rng);
}

function drawLeatherChair(ctx) {
  const shadow = ctx.createRadialGradient(960, 1004, 40, 960, 1004, 260);
  shadow.addColorStop(0, "rgba(0, 0, 0, 0.68)");
  shadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = shadow;
  ctx.fillRect(700, 880, 520, 200);

  const back = ctx.createLinearGradient(770, 660, 1150, 950);
  back.addColorStop(0, "#1b1115");
  back.addColorStop(0.35, "#4a1f2c");
  back.addColorStop(1, "#0a0708");
  ctx.fillStyle = back;
  roundedRect(ctx, 730, 696, 460, 236, 42);
  ctx.fill();

  const seat = ctx.createLinearGradient(760, 872, 1160, 1010);
  seat.addColorStop(0, "#100a0c");
  seat.addColorStop(0.35, "#4d2230");
  seat.addColorStop(1, "#090606");
  ctx.fillStyle = seat;
  roundedRect(ctx, 690, 860, 560, 118, 34);
  ctx.fill();

  ctx.strokeStyle = "rgba(223, 159, 92, 0.26)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(780, 732);
  ctx.bezierCurveTo(890, 690, 1040, 690, 1140, 736);
  ctx.stroke();
}

function drawDeskObjects(ctx, rng) {
  const monitorGlow = ctx.createRadialGradient(950, 602, 20, 950, 602, 270);
  monitorGlow.addColorStop(0, "rgba(68, 201, 220, 0.22)");
  monitorGlow.addColorStop(1, "rgba(68, 201, 220, 0)");
  ctx.fillStyle = monitorGlow;
  ctx.fillRect(650, 385, 600, 360);

  const monitor = ctx.createLinearGradient(660, 438, 1220, 720);
  monitor.addColorStop(0, "#0d1215");
  monitor.addColorStop(1, "#020303");
  ctx.fillStyle = monitor;
  roundedRect(ctx, 664, 426, 592, 310, 14);
  ctx.fill();

  const screen = ctx.createLinearGradient(700, 464, 1218, 680);
  screen.addColorStop(0, "#0e4247");
  screen.addColorStop(0.55, "#1e6d73");
  screen.addColorStop(1, "#07181d");
  ctx.fillStyle = screen;
  roundedRect(ctx, 698, 462, 524, 232, 6);
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#b8ffff";
  ctx.fillRect(724, 488, 360, 5);
  ctx.fillRect(724, 526, 210, 4);
  ctx.fillRect(724, 565, 300, 4);
  ctx.restore();

  ctx.fillStyle = "#0b0c0d";
  ctx.fillRect(914, 736, 92, 44);
  ctx.fillRect(834, 778, 252, 28);

  const lampX = 1350 + Math.floor(rng() * 90);
  ctx.fillStyle = "#11100e";
  ctx.fillRect(lampX + 52, 490, 18, 170);
  ctx.fillRect(lampX - 8, 650, 140, 20);
  const lamp = ctx.createLinearGradient(lampX, 385, lampX + 150, 510);
  lamp.addColorStop(0, "#78612d");
  lamp.addColorStop(0.45, "#f1cf76");
  lamp.addColorStop(1, "#4b3516");
  ctx.fillStyle = lamp;
  roundedRect(ctx, lampX, 374, 150, 94, 24);
  ctx.fill();

  const lampGlow = ctx.createRadialGradient(lampX + 74, 472, 20, lampX + 74, 566, 310);
  lampGlow.addColorStop(0, "rgba(255, 205, 112, 0.5)");
  lampGlow.addColorStop(1, "rgba(255, 205, 112, 0)");
  ctx.fillStyle = lampGlow;
  ctx.fillRect(lampX - 230, 300, 610, 500);

  const papers = ctx.createLinearGradient(410, 646, 570, 690);
  papers.addColorStop(0, "#d9d0b3");
  papers.addColorStop(1, "#75664f");
  ctx.fillStyle = papers;
  ctx.save();
  ctx.translate(480, 674);
  ctx.rotate(-0.05);
  ctx.fillRect(-92, -26, 190, 54);
  ctx.restore();

  ctx.fillStyle = "#711923";
  roundedRect(ctx, 402, 612, 104, 28, 5);
  ctx.fill();

  const glass = ctx.createLinearGradient(1535, 602, 1590, 690);
  glass.addColorStop(0, "rgba(200, 234, 236, 0.4)");
  glass.addColorStop(1, "rgba(30, 70, 76, 0.18)");
  ctx.fillStyle = glass;
  roundedRect(ctx, 1530, 598, 58, 88, 14);
  ctx.fill();
}

function drawSuspenseLighting(ctx, rng) {
  const leftShadow = ctx.createLinearGradient(0, 0, 720, 0);
  leftShadow.addColorStop(0, "rgba(0, 0, 0, 0.84)");
  leftShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = leftShadow;
  ctx.fillRect(0, 0, 760, 1080);

  const rightShadow = ctx.createLinearGradient(1920, 0, 1200, 0);
  rightShadow.addColorStop(0, "rgba(0, 0, 0, 0.82)");
  rightShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = rightShadow;
  ctx.fillRect(1130, 0, 790, 1080);

  const topVignette = ctx.createLinearGradient(0, 0, 0, 1080);
  topVignette.addColorStop(0, "rgba(0, 0, 0, 0.68)");
  topVignette.addColorStop(0.42, "rgba(0, 0, 0, 0.05)");
  topVignette.addColorStop(1, "rgba(0, 0, 0, 0.78)");
  ctx.fillStyle = topVignette;
  ctx.fillRect(0, 0, 1920, 1080);

  const coldSlash = ctx.createLinearGradient(340, 0, 1220, 1080);
  coldSlash.addColorStop(0, "rgba(122, 172, 203, 0)");
  coldSlash.addColorStop(0.42, "rgba(122, 172, 203, 0.13)");
  coldSlash.addColorStop(0.52, "rgba(122, 172, 203, 0.04)");
  coldSlash.addColorStop(1, "rgba(122, 172, 203, 0)");
  ctx.fillStyle = coldSlash;
  ctx.fillRect(0, 0, 1920, 1080);

  ctx.save();
  ctx.globalAlpha = 0.08 + rng() * 0.04;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 54, 1920, 132);
  ctx.restore();
}

function addFilmGrain(ctx, rng) {
  const imageData = ctx.getImageData(0, 0, 1920, 1080);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (rng() - 0.5) * 15;
    data[i] = clamp(data[i] + noise, 0, 255);
    data[i + 1] = clamp(data[i + 1] + noise, 0, 255);
    data[i + 2] = clamp(data[i + 2] + noise, 0, 255);
  }
  ctx.putImageData(imageData, 0, 0);

  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, 1920, 88);
  ctx.fillRect(0, 992, 1920, 88);
  ctx.restore();
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawSky(ctx, rng) {
  const bands = [
    ["#142640", 0, 28],
    ["#1f4264", 28, 54],
    ["#b45b62", 54, 74],
    ["#f2a35e", 74, 90],
    ["#ffe08a", 90, 104]
  ];
  bands.forEach(([color, y, h]) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, y, 320, h);
  });

  ctx.fillStyle = "#fff2a8";
  ctx.fillRect(247, 33, 18, 18);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(250, 36, 12, 12);

  for (let i = 0; i < 16; i += 1) {
    const x = Math.floor(rng() * 300);
    const y = 18 + Math.floor(rng() * 54);
    const w = 10 + Math.floor(rng() * 24);
    ctx.fillStyle = i % 2 ? "#f7d0a1" : "#b9ddff";
    ctx.globalAlpha = 0.6;
    ctx.fillRect(x, y, w, 3);
    ctx.fillRect(x + 4, y + 3, Math.max(4, w - 8), 3);
    ctx.globalAlpha = 1;
  }
}

function drawWindowWall(ctx) {
  ctx.fillStyle = "#1a1718";
  ctx.fillRect(0, 0, 320, 12);
  ctx.fillRect(0, 0, 14, 132);
  ctx.fillRect(306, 0, 14, 132);
  ctx.fillRect(0, 128, 320, 16);

  ctx.fillStyle = "#050707";
  [13, 102, 204, 304].forEach((x) => ctx.fillRect(x, 10, 4, 121));
  ctx.fillRect(12, 10, 296, 4);
  ctx.fillRect(12, 126, 296, 5);
  ctx.fillRect(14, 68, 292, 3);

  ctx.fillStyle = "#f7d67b";
  ctx.fillRect(10, 132, 300, 5);
  ctx.fillStyle = "#5a3d22";
  ctx.fillRect(10, 137, 300, 7);
}

function drawCity(ctx, rng) {
  ctx.fillStyle = "#142640";
  ctx.globalAlpha = 0.24;
  ctx.fillRect(17, 14, 86, 112);
  ctx.fillRect(106, 14, 98, 112);
  ctx.fillRect(208, 14, 95, 112);
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#203f55";
  for (let x = 19; x < 302; x += 10 + Math.floor(rng() * 8)) {
    const h = 16 + Math.floor(rng() * 44);
    const y = 107 - h;
    ctx.fillRect(x, y, 7 + Math.floor(rng() * 9), h);
  }

  ctx.fillStyle = "#2f6278";
  for (let x = 15; x < 306; x += 28) {
    const h = 24 + Math.floor(rng() * 34);
    ctx.fillRect(x, 104 - h, 18, h);
  }

  ctx.fillStyle = "#f6e7a8";
  for (let x = 21; x < 300; x += 13) {
    for (let y = 70; y < 110; y += 10) {
      if (rng() > 0.56) ctx.fillRect(x, y, 3, 3);
    }
  }

  ctx.fillStyle = "#6dcff6";
  ctx.globalAlpha = 0.38;
  ctx.fillRect(17, 110, 286, 16);
  ctx.globalAlpha = 1;
}

function drawInterior(ctx, rng) {
  ctx.fillStyle = "#29211f";
  ctx.fillRect(0, 128, 320, 52);

  for (let y = 130; y < 180; y += 12) {
    ctx.fillStyle = y % 24 === 0 ? "#3b302a" : "#201a18";
    ctx.fillRect(0, y, 320, 4);
  }

  for (let x = -30; x < 360; x += 38) {
    ctx.fillStyle = "#66513c";
    ctx.fillRect(x, 143, 24, 3);
    ctx.fillRect(x + 8, 160, 28, 3);
  }

  ctx.fillStyle = "#3c2a1d";
  ctx.fillRect(51, 116, 218, 39);
  ctx.fillStyle = "#7a4d2a";
  ctx.fillRect(42, 110, 236, 20);
  ctx.fillStyle = "#c89545";
  ctx.fillRect(42, 108, 236, 5);
  ctx.fillStyle = "#211511";
  ctx.fillRect(58, 130, 16, 37);
  ctx.fillRect(244, 130, 16, 37);

  ctx.fillStyle = "#0e1014";
  ctx.fillRect(124, 73, 70, 42);
  ctx.fillStyle = "#48e0d6";
  ctx.fillRect(130, 79, 58, 28);
  ctx.fillStyle = "#182328";
  ctx.fillRect(142, 116, 34, 4);
  ctx.fillRect(136, 120, 46, 4);

  ctx.fillStyle = "#ffd166";
  ctx.fillRect(220, 79, 10, 4);
  ctx.fillRect(226, 83, 4, 29);
  ctx.fillRect(210, 93, 30, 5);
  ctx.fillStyle = "#fff0ac";
  ctx.fillRect(204, 72, 27, 11);

  ctx.fillStyle = "#171112";
  ctx.fillRect(20, 52, 58, 70);
  ctx.fillStyle = "#51341f";
  ctx.fillRect(24, 56, 50, 8);
  ctx.fillRect(24, 74, 50, 8);
  ctx.fillRect(24, 92, 50, 8);
  ctx.fillStyle = "#e7b756";
  for (let i = 0; i < 14; i += 1) {
    const x = 27 + Math.floor(rng() * 42);
    const y = 58 + Math.floor(rng() * 43);
    ctx.fillRect(x, y, 3, 10);
  }

  ctx.fillStyle = "#120e12";
  ctx.fillRect(248, 80, 42, 52);
  ctx.fillStyle = "#2d1d23";
  ctx.fillRect(251, 83, 36, 46);
  ctx.fillStyle = "#6a2131";
  ctx.fillRect(256, 90, 26, 31);
  ctx.fillStyle = "#c89545";
  ctx.fillRect(252, 82, 36, 4);
  ctx.fillRect(252, 127, 36, 4);

  ctx.fillStyle = "#0b0c0e";
  ctx.fillRect(140, 134, 43, 32);
  ctx.fillStyle = "#272229";
  ctx.fillRect(134, 121, 55, 25);
  ctx.fillStyle = "#5a2530";
  ctx.fillRect(140, 126, 43, 13);
  ctx.fillStyle = "#20181c";
  ctx.fillRect(153, 145, 16, 20);

  ctx.fillStyle = "#f7e2a2";
  ctx.fillRect(86, 116, 18, 3);
  ctx.fillRect(86, 121, 26, 3);
  ctx.fillStyle = "#e85b5f";
  ctx.fillRect(92, 112, 16, 5);

  ctx.fillStyle = "#c89545";
  ctx.fillRect(292, 116, 7, 20);
  ctx.fillStyle = "#215d48";
  ctx.fillRect(286, 104, 18, 14);
  ctx.fillRect(290, 96, 10, 12);
}

function refreshAudioList() {
  audioList.replaceChildren();
  if (!audioFiles.length) {
    const empty = document.createElement("li");
    empty.innerHTML = "<span>Nenhum áudio</span><span>--:--</span>";
    audioList.append(empty);
    return;
  }

  audioFiles.forEach((file) => {
    const item = document.createElement("li");
    const name = document.createElement("span");
    const meta = document.createElement("span");
    name.textContent = file.name;
    meta.textContent = `${(file.size / 1048576).toFixed(1)} MB`;
    item.append(name, meta);
    audioList.append(item);
  });
}

function getSettings() {
  const hours = clamp(Math.floor(Number(hoursInput.value) || 0), 0, 12);
  const minutes = clamp(Math.floor(Number(minutesInput.value) || 0), 0, 59);
  const duration = hours * 3600 + minutes * 60;
  const width = clamp(Number(widthInput.value) || 1920, 320, 3840);
  const height = clamp(Number(heightInput.value) || 1080, 180, 2160);
  const fps = clamp(Number(fpsInput.value) || 30, 1, 60);
  const mode = getCurrentMode();

  hoursInput.value = String(hours);
  minutesInput.value = String(minutes);

  return {
    duration,
    hours,
    minutes,
    width: Math.round(width / 2) * 2,
    height: Math.round(height / 2) * 2,
    fps,
    mode,
    audioMode: audioModeInput.value
  };
}

function updateModeVisibility() {
  const mode = getCurrentMode();
  videoSettings.classList.toggle("hidden", mode !== "video");
  updateRenderAvailability();
}

async function decodeAudioFiles(files, titleStart = "Lendo áudio") {
  const audioContext = new AudioContext();
  const decoded = [];

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const percent = 8 + (i / Math.max(files.length, 1)) * 24;
    setProgress(percent, titleStart, `Decodificando ${file.name}`);
    const data = await file.arrayBuffer();
    const buffer = await audioContext.decodeAudioData(data);
    decoded.push({ file, buffer });
  }

  await audioContext.close();
  return decoded;
}

function scheduleAudio(ctx, destination, tracks, duration, audioMode, startAt = 0) {
  if (!tracks.length) return;

  if (audioMode === "mix") {
    const gainValue = Math.max(0.16, 1 / Math.sqrt(tracks.length));
    tracks.forEach(({ buffer }) => {
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = buffer;
      source.loop = true;
      gain.gain.value = gainValue;
      source.connect(gain);
      gain.connect(destination);
      source.start(startAt);
      source.stop(startAt + duration);
    });
    return;
  }

  let cursor = startAt;
  const endAt = startAt + duration;
  while (cursor < endAt - 0.001) {
    for (const { buffer } of tracks) {
      if (cursor >= endAt - 0.001) break;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(destination);
      const segmentDuration = Math.min(buffer.duration, endAt - cursor);
      source.start(cursor, 0, segmentDuration);
      cursor += segmentDuration;
    }
  }
}

function pickVideoMimeType() {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm"
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function pickAudioMimeType() {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/ogg;codecs=opus",
    "audio/webm"
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function drawVideoFrame(targetCtx, width, height) {
  targetCtx.imageSmoothingEnabled = true;
  targetCtx.fillStyle = "#050607";
  targetCtx.fillRect(0, 0, width, height);

  const sourceRatio = sceneCanvas.width / sceneCanvas.height;
  const targetRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;
  let x = 0;
  let y = 0;

  if (targetRatio > sourceRatio) {
    drawWidth = Math.round(height * sourceRatio);
    x = Math.round((width - drawWidth) / 2);
  } else if (targetRatio < sourceRatio) {
    drawHeight = Math.round(width / sourceRatio);
    y = Math.round((height - drawHeight) / 2);
  }

  targetCtx.drawImage(sceneCanvas, x, y, drawWidth, drawHeight);
}

async function renderVideo(settings) {
  if (typeof MediaRecorder === "undefined") {
    throw new Error("Este navegador não oferece MediaRecorder.");
  }

  setProgress(5, "Preparando", "Validando imagem e áudios");
  const tracks = audioFiles.length ? await decodeAudioFiles(audioFiles, "Lendo áudio") : [];

  setProgress(34, "Preparando vídeo", "Criando canvas de gravação");
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = settings.width;
  outputCanvas.height = settings.height;
  const outputCtx = outputCanvas.getContext("2d", { alpha: false });
  drawVideoFrame(outputCtx, settings.width, settings.height);

  const canvasStream = outputCanvas.captureStream(settings.fps);
  const stream = new MediaStream(canvasStream.getVideoTracks());
  let audioContext = null;

  if (tracks.length) {
    audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    scheduleAudio(audioContext, destination, tracks, settings.duration, settings.audioMode, audioContext.currentTime + 0.2);
    destination.stream.getAudioTracks().forEach((track) => stream.addTrack(track));
  }

  const mimeType = pickVideoMimeType();
  const chunks = [];
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  const videoTrack = canvasStream.getVideoTracks()[0];
  let animationFrame = 0;
  let progressTimer = 0;
  let frameTimer = 0;

  const paintLoop = () => {
    drawVideoFrame(outputCtx, settings.width, settings.height);
    videoTrack.requestFrame?.();
    animationFrame = requestAnimationFrame(paintLoop);
  };

  return new Promise((resolve, reject) => {
    recorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    });

    recorder.addEventListener("error", () => {
      reject(new Error("Falha ao gravar o vídeo."));
    });

    recorder.addEventListener("stop", async () => {
      cancelAnimationFrame(animationFrame);
      clearInterval(progressTimer);
      clearInterval(frameTimer);
      stream.getTracks().forEach((track) => track.stop());
      await audioContext?.close();
      setProgress(96, "Finalizando", "Montando arquivo para download");
      const blob = new Blob(chunks, { type: recorder.mimeType || "video/webm" });
      resolve(blob);
    });

    setProgress(40, "Gravando", `Renderizando ${formatTime(settings.duration)}`);
    paintLoop();
    frameTimer = window.setInterval(() => drawVideoFrame(outputCtx, settings.width, settings.height), 1000 / settings.fps);

    const startedAt = performance.now();
    progressTimer = window.setInterval(() => {
      const elapsed = (performance.now() - startedAt) / 1000;
      const percent = 40 + Math.min(elapsed / settings.duration, 1) * 52;
      setProgress(percent, "Gravando", `Tempo renderizado: ${formatTime(elapsed)} de ${formatTime(settings.duration)}`);
    }, 180);

    if (audioContext?.state === "suspended") {
      audioContext.resume().catch(reject);
    }

    recorder.start(1000);
    window.setTimeout(() => {
      if (recorder.state !== "inactive") recorder.stop();
    }, settings.duration * 1000 + 350);
  });
}

async function renderAudio(settings) {
  if (typeof MediaRecorder === "undefined") {
    throw new Error("Este navegador não oferece MediaRecorder.");
  }

  if (!audioFiles.length) {
    throw new Error("Envie pelo menos um arquivo de áudio.");
  }

  const tracks = await decodeAudioFiles(audioFiles, "Lendo áudio");
  const audioContext = new AudioContext();
  const destination = audioContext.createMediaStreamDestination();
  scheduleAudio(audioContext, destination, tracks, settings.duration, settings.audioMode, audioContext.currentTime + 0.1);

  const mimeType = pickAudioMimeType();
  const chunks = [];
  const recorder = new MediaRecorder(destination.stream, mimeType ? { mimeType } : undefined);
  let progressTimer = 0;

  return new Promise((resolve, reject) => {
    recorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    });

    recorder.addEventListener("error", () => {
      reject(new Error("Falha ao gravar o áudio."));
    });

    recorder.addEventListener("stop", async () => {
      clearInterval(progressTimer);
      destination.stream.getTracks().forEach((track) => track.stop());
      await audioContext.close();
      setProgress(96, "Finalizando", "Montando arquivo para download");
      const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
      resolve(blob);
    });

    setProgress(40, "Gravando áudio", `Renderizando ${formatTime(settings.duration)}`);
    const startedAt = performance.now();
    progressTimer = window.setInterval(() => {
      const elapsed = (performance.now() - startedAt) / 1000;
      const percent = 40 + Math.min(elapsed / settings.duration, 1) * 52;
      setProgress(percent, "Gravando áudio", `Tempo renderizado: ${formatTime(elapsed)} de ${formatTime(settings.duration)}`);
    }, 180);

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(reject);
    }

    recorder.start(1000);
    window.setTimeout(() => {
      if (recorder.state !== "inactive") recorder.stop();
    }, settings.duration * 1000 + 180);
  });
}

async function handleRender(event) {
  event.preventDefault();
  clearDownloads();
  isRendering = true;
  updateRenderAvailability();

  try {
    const settings = getSettings();
    if (settings.duration < 60) {
      throw new Error("Defina pelo menos 1 minuto.");
    }

    if (settings.mode === "video") {
      if (!imageApproved) {
        throw new Error("Aprove a imagem antes de gerar o vídeo.");
      }

      const blob = await renderVideo(settings);
      exposeDownload(blob, "office-video-8bit.webm", "Baixar vídeo WEBM");
      setProgress(100, "Vídeo pronto", "Arquivo disponível para download");
    } else {
      const blob = await renderAudio(settings);
      exposeDownload(blob, "audio-loopado.webm", "Baixar áudio WEBM");
      setProgress(100, "Áudio pronto", "Arquivo disponível para download");
    }
  } catch (error) {
    console.error(error);
    setProgress(0, "Erro", error.message || "Não foi possível concluir.");
  } finally {
    isRendering = false;
    updateRenderAvailability();
  }
}

function downloadCurrentImage() {
  sceneCanvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "escritorio-luxuoso-cinematico-full-hd.png";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
}

audioInput.addEventListener("change", () => {
  audioFiles = Array.from(audioInput.files || []);
  refreshAudioList();
  clearDownloads();
  setProgress(0, "Áudios carregados", `${audioFiles.length} arquivo(s) selecionado(s)`);
});

renderForm.addEventListener("change", updateModeVisibility);
renderForm.addEventListener("submit", handleRender);
downloadImageButton.addEventListener("click", downloadCurrentImage);
approveImageButton.addEventListener("click", () => {
  setImageApproval(true);
  clearDownloads();
  setProgress(0, "Imagem aprovada", "Vídeo liberado para renderização.");
});
newImageButton.addEventListener("click", () => {
  const nextIndex = (currentImageIndex + 1) % generatedImageSources.length;
  drawLuxuryOffice(nextIndex).catch((error) => {
    console.error(error);
    setProgress(0, "Erro", error.message || "Não foi possível gerar a imagem.");
  });
  setImageApproval(false);
  clearDownloads();
  setProgress(0, "Imagem recriada", "Aprove a imagem para liberar o vídeo.");
});

setImageApproval(false);
refreshAudioList();
updateModeVisibility();
drawLuxuryOffice(0).then(() => {
  setProgress(0, "Imagem pronta", "Aprove a imagem para liberar o vídeo.");
}).catch((error) => {
  console.error(error);
  setProgress(0, "Erro", error.message || "Não foi possível carregar a imagem.");
});
