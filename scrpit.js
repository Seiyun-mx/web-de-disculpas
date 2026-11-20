const envelope = document.getElementById("openLetter");
const letter = document.getElementById("carta");

const overlay = document.getElementById("forgiveOverlay");
const video = document.getElementById("forgiveVideo");
const actions = document.getElementById("forgiveActions");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const noSlot = document.getElementById("noSlot");
const thanks = document.getElementById("forgiveThanks");
const readBtn = document.getElementById("readLetter");

/* ---------- Abrir el sobre -> mostrar video ---------- */

envelope.addEventListener("click", () => {

  envelope.classList.add("open");
  envelope.setAttribute("aria-label", "Carta abierta");

  setTimeout(openOverlay, 650);

});

function openOverlay() {

  overlay.classList.add("visible");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  video.currentTime = 0;
  const playing = video.play();
  if (playing) playing.catch(() => {});

}

function closeOverlay() {

  overlay.classList.remove("visible");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  video.pause();

}

/* ---------- Botón "No te perdono": huye y se encoge ---------- */

let noScale = 1;
let dodging = false;

const MIN_SCALE = 0.25;
const SHRINK = 0.75;
const MARGIN = 12;
const DANGER_DISTANCE = 110;

function startDodging() {

  if (dodging) return;

  const rect = noBtn.getBoundingClientRect();

  // el espacio original se conserva para que el botón verde no se mueva
  noSlot.style.width = `${rect.width}px`;
  noSlot.style.height = `${rect.height}px`;

  noBtn.classList.add("running");
  noBtn.style.left = `${rect.left}px`;
  noBtn.style.top = `${rect.top}px`;

  dodging = true;

}

function moveAway(px, py) {

  startDodging();

  const w = noBtn.offsetWidth;
  const h = noBtn.offsetHeight;

  const maxX = Math.max(MARGIN, window.innerWidth - w - MARGIN);
  const maxY = Math.max(MARGIN, window.innerHeight - h - MARGIN);

  let best = { x: MARGIN, y: MARGIN };
  let bestDistance = -1;

  for (let i = 0; i < 30; i++) {

    const x = MARGIN + Math.random() * (maxX - MARGIN);
    const y = MARGIN + Math.random() * (maxY - MARGIN);

    const distance = Math.hypot(x + w / 2 - px, y + h / 2 - py);

    if (distance > bestDistance) {
      bestDistance = distance;
      best = { x, y };
    }

    if (distance > 240) break;

  }

  noBtn.style.left = `${best.x}px`;
  noBtn.style.top = `${best.y}px`;

}

// El mouse se acerca al botón -> huye
overlay.addEventListener("pointermove", (e) => {

  if (e.pointerType !== "mouse" || noBtn.hidden) return;

  const r = noBtn.getBoundingClientRect();
  const distance = Math.hypot(
    e.clientX - (r.left + r.width / 2),
    e.clientY - (r.top + r.height / 2)
  );

  if (distance < DANGER_DISTANCE) moveAway(e.clientX, e.clientY);

});

// En celular: al tocarlo casi siempre se mueve antes de que cuente el click
noBtn.addEventListener("pointerdown", (e) => {

  if (Math.random() < 0.7) {
    e.preventDefault();
    moveAway(e.clientX, e.clientY);
  }

});

// Si alcanzan a darle click, se hace más pequeño y vuelve a escaparse
noBtn.addEventListener("click", (e) => {

  noScale = Math.max(MIN_SCALE, noScale * SHRINK);
  noBtn.style.setProperty("--s", noScale);

  const x = e.clientX || window.innerWidth / 2;
  const y = e.clientY || window.innerHeight / 2;

  moveAway(x, y);

});

window.addEventListener("resize", () => {

  if (!dodging) return;

  const maxX = Math.max(MARGIN, window.innerWidth - noBtn.offsetWidth - MARGIN);
  const maxY = Math.max(MARGIN, window.innerHeight - noBtn.offsetHeight - MARGIN);

  noBtn.style.left = `${Math.min(parseFloat(noBtn.style.left) || 0, maxX)}px`;
  noBtn.style.top = `${Math.min(parseFloat(noBtn.style.top) || 0, maxY)}px`;

});

/* ---------- Botón "Te perdono" ---------- */

yesBtn.addEventListener("click", () => {

  actions.hidden = true;
  noBtn.hidden = true;

  thanks.textContent =
    "Gracias por perdonarme ♡ Voy a esforzarme cada día para ser mejor para ti.";

  readBtn.hidden = false;

  burstHearts();

});

readBtn.addEventListener("click", () => {

  closeOverlay();

  letter.classList.add("visible");
  letter.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    letter.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 350);

});

/* ---------- Corazones ---------- */

function burstHearts() {

  const layer = document.getElementById("hearts");

  for (let i = 0; i < 18; i++) {

    const heart = document.createElement("span");

    heart.className = "float-heart";
    heart.textContent = Math.random() > .5 ? "♡" : "♥";
    heart.style.left = `${8 + Math.random() * 84}%`;
    heart.style.fontSize = `${12 + Math.random() * 17}px`;
    heart.style.animationDuration = `${3 + Math.random() * 3}s`;

    layer.appendChild(heart);

    heart.addEventListener("animationend", () => heart.remove());

  }

}

setInterval(() => {

  const layer = document.getElementById("hearts");

  if (Math.random() > .45) {

    const heart = document.createElement("span");

    heart.className = "float-heart";
    heart.textContent = "♡";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${10 + Math.random() * 10}px`;
    heart.style.animationDuration = `${7 + Math.random() * 4}s`;

    layer.appendChild(heart);

    heart.addEventListener("animationend", () => heart.remove());

  }

}, 1700);