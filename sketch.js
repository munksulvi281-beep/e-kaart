
// ========================================
// E-KAART – PÄIKE, ÜMBRIK, FOTOD
// ========================================

// MUUDETAVAD PARAMEETRID

const PALLIDE_ARV = 25;
const MIN_SUURUS = 12;
const MAX_SUURUS = 45;

const MIN_KIIRUS = 0.55;
const MAX_KIIRUS = 1.2;

const HOLJUMINE = 20;
const KIIRTE_ARV = 9;
const KIIRTE_LABIPAISTVUS = 22;

const RAPUTUSE_AEG = 480;
const AVAMISE_AEG = 1150;

const KONFETI_ARV = 110;
const KONFETI_KAUGUS = 450;

const SUDAMETE_ARV = 15;

// ========================================
// TAUSTA AKTIIVSUS
// ========================================

// Seda globaalset muutujat muudab index.html.
// 0 = rahulik taust
// 1 = elav taust

var TAUSTA_AKTIIVSUS = 0;

// Sisemine sujuv üleminek
let taustaSujuvus = 0;

// Väiksem number = aeglasem üleminek
const TAUSTA_SUJUVUS = 0.025;

// ========================================
// TAUSTA MUUTUJAD
// ========================================

let pallid = [];
let kiired = [];
let taust;

// ========================================
// P5.JS ALGSEADISTUS
// ========================================

function setup() {
  const canvas = createCanvas(
    windowWidth,
    windowHeight
  );

  canvas.position(0, 0);
  canvas.style("z-index", "0");
  canvas.style("pointer-events", "none");

  frameRate(30);

  looTaust();
  looKiired();

  for (let i = 0; i < PALLIDE_ARV; i++) {
    pallid.push(new Paikesepall(true));
  }
}

// ========================================
// PÕHIANIMATSIOON
// ========================================

function draw() {

  // Sujuv üleminek kahe oleku vahel
  taustaSujuvus = lerp(
    taustaSujuvus,
    TAUSTA_AKTIIVSUS,
    TAUSTA_SUJUVUS
  );

  image(taust, 0, 0);

  // Avatud kirja korral muutub taevas
  // soojemaks ja heledamaks.
  noStroke();

  fill(
    255,
    245,
    190,
    taustaSujuvus * 42
  );

  rect(0, 0, width, height);

  joonistaPaike();
  joonistaKiired();
  joonistaPilved();

  for (const pall of pallid) {
    pall.liigu();
    pall.joonista();
  }
}

// ========================================
// BRAUSERIAKNA SUURUSE MUUTMINE
// ========================================

function windowResized() {
  const vanaLaius = width;
  const vanaKorgus = height;

  resizeCanvas(windowWidth, windowHeight);
  looTaust();

  for (const pall of pallid) {
    pall.algX *= width / Math.max(1, vanaLaius);
    pall.y *= height / Math.max(1, vanaKorgus);
  }
}

// ========================================
// TAEVA GRADIENT
// ========================================

function looTaust() {
  if (taust) {
    taust.remove();
  }

  taust = createGraphics(width, height);

  for (let y = 0; y < height; y += 2) {
    const t = y / height;

    const r = lerp(255, 255, t);
    const g = lerp(249, 221, t);
    const b = lerp(238, 190, t);

    taust.stroke(r, g, b);
    taust.strokeWeight(2);
    taust.line(0, y, width, y);
  }
}

// ========================================
// PÄIKESE KUMA
// ========================================

function joonistaPaike() {
  noStroke();

  const x = width / 2;
  const y = Math.max(90, height * 0.13);

  // Aktiivses olekus tugevam päikesekuma
  const kumaKordaja = 1 + taustaSujuvus * 0.6;

  for (let i = 8; i > 0; i--) {
    fill(
      255,
      225,
      155,
      5 * kumaKordaja
    );

    circle(x, y, i * 55);
  }

  fill(
    255,
    248,
    220,
    110 + taustaSujuvus * 35
  );
  circle(x, y, 120);

  fill(
    255,
    252,
    235,
    160 + taustaSujuvus * 45
  );
  circle(x, y, 65);
}

// ========================================
// VALGUSKIIRTE LOOMINE
// ========================================

function looKiired() {
  kiired = [];

  for (let i = 0; i < KIIRTE_ARV; i++) {
    kiired.push({
      nurk: map(
        i, 0, KIIRTE_ARV - 1,
        -1.1, 1.1
      ),
      faas: random(TWO_PI),
      laius: random(70, 140)
    });
  }
}

// ========================================
// LIIKUVAD VALGUSKIIRED
// ========================================

function joonistaKiired() {
  noStroke();

  const paikeY = Math.max(90, height * 0.13);

  for (const kiir of kiired) {

    // Aktiivses olekus kiirem suunamuutus
    const nurk =
      kiir.nurk +
      sin(
        frameCount *
        (0.003 + taustaSujuvus * 0.004) +
        kiir.faas
      ) *
      (0.04 + taustaSujuvus * 0.04);

    // Aktiivses olekus heledamad kiired
    const heledus =
      KIIRTE_LABIPAISTVUS *
      (1 + taustaSujuvus * 1.2) *
      (
        0.7 +
        0.3 * sin(
          frameCount * 0.005 + kiir.faas
        )
      );

    push();
    translate(width / 2, paikeY);
    rotate(nurk);

    fill(255, 245, 205, heledus);

    beginShape();
    vertex(-8, 0);
    vertex(8, 0);
    vertex(kiir.laius, height * 1.6);
    vertex(-kiir.laius, height * 1.6);
    endShape(CLOSE);

    pop();
  }
}

// ========================================
// ÕHULISED PILVED
// ========================================

function joonistaPilved() {
  noStroke();

  fill(
    255, 250, 240,
    32 + taustaSujuvus * 15
  );

  ellipse(
    width * 0.22,
    height * 0.40,
    width * 0.48,
    85
  );

  ellipse(
    width * 0.78,
    height * 0.53,
    width * 0.42,
    75
  );

  fill(255, 245, 228, 25);

  ellipse(
    width * 0.50,
    height * 0.75,
    width * 0.65,
    100
  );
}

// ========================================
// PÄIKESEPALL
// ========================================

class Paikesepall {
  constructor(algus) {
    this.taasta(algus);
  }

  taasta(algus) {
    this.algX = random(width);

    this.y = algus
      ? random(-height, height)
      : random(-120, -20);

    this.suurus = random(MIN_SUURUS, MAX_SUURUS);
    this.kiirus = random(MIN_KIIRUS, MAX_KIIRUS);
    this.labi = random(90, 190);
    this.faas = random(TWO_PI);
    this.x = this.algX;
  }

  // =====================================
  // PÄIKESEPALLIDE LIIKUMINE
  // =====================================

  liigu() {

    // Aktiivses olekus kuni 2,3 korda kiirem
    const kiiruseKordaja = lerp(
      1,
      2.3,
      taustaSujuvus
    );

    this.y += this.kiirus * kiiruseKordaja;

    // Aktiivses olekus elavam hõljumine
    this.x =
      this.algX +
      sin(
        frameCount *
        (0.008 + taustaSujuvus * 0.006) +
        this.faas
      ) *
      HOLJUMINE *
      (1 + taustaSujuvus * 0.5);

    if (this.y > height + this.suurus) {
      this.taasta(false);
    }
  }

  // =====================================
  // PÄIKESEPALLI JOONISTAMINE
  // =====================================

  joonista() {
    push();

    translate(this.x, this.y);
    noStroke();

    // Elavamas olekus tugevam kuma
    const kuma = 1 + taustaSujuvus * 0.5;

    fill(
      255,
      210,
      120,
      this.labi * 0.12 * kuma
    );
    circle(0, 0, this.suurus * 1.8);

    fill(
      255,
      220,
      145,
      this.labi * 0.2 * kuma
    );
    circle(0, 0, this.suurus * 1.3);

    // Väikesed kiired
    stroke(
      255,
      191,
      90,
      this.labi * 0.5
    );

    strokeWeight(1.3);

    const raadius = this.suurus / 2;

    for (let i = 0; i < 10; i++) {
      const a = TWO_PI * i / 10;

      line(
        cos(a) * (raadius + 2),
        sin(a) * (raadius + 2),
        cos(a) * (raadius + 7),
        sin(a) * (raadius + 7)
      );
    }

    noStroke();

    fill(
      255,
      195,
      90,
      Math.min(255, this.labi * kuma)
    );
    circle(0, 0, this.suurus);

    fill(
      255,
      235,
      175,
      this.labi * 0.7
    );

    circle(
      -this.suurus * 0.1,
      -this.suurus * 0.1,
      this.suurus * 0.55
    );

    pop();
  }
}

// ========================================
// E-KAARDI ELEMENDID
// ========================================

const centerStage =
  document.getElementById("centerStage");

const envelopeButton =
  document.getElementById("envelopeButton");

const paperCard =
  document.getElementById("paperCard");

const resetButton =
  document.getElementById("resetButton");

const photos = Array.from(
  document.querySelectorAll(".photo")
);

// ========================================
// SEADETE RAKENDAMINE
// ========================================

document.getElementById("introTitle").textContent =
  SEADED.avaleheTekst;

document.getElementById("peekText").textContent =
  SEADED.kirjaPiilumiseTekst;

document.getElementById("cardHeading").textContent =
  SEADED.pealkiri;

document.getElementById("cardMessage").textContent =
  SEADED.tekst;

document.getElementById("cardSignature").textContent =
  SEADED.allkiri;

resetButton.textContent =
  SEADED.tagasinupuTekst;

photos.forEach((foto, indeks) => {
  const andmed = SEADED.pildid[indeks];

  if (!andmed) {
    foto.hidden = true;
    return;
  }

  const pilt = foto.querySelector("img");
  const allkiri = foto.querySelector(".photo-caption");

  pilt.src = andmed.fail;
  pilt.alt = andmed.allkiri;
  allkiri.textContent = andmed.allkiri;

  foto.setAttribute("aria-label", andmed.allkiri);
});

// ========================================
// AJASTUSED
// ========================================

let kaartAvatud = false;
let animatsiooniKord = 0;
let ajastused = [];

function juhuslik(min, max) {
  return Math.random() * (max - min) + min;
}

function ajasta(tegevus, viivitus) {
  const kord = animatsiooniKord;

  const id = setTimeout(() => {
    if (kord !== animatsiooniKord) return;
    tegevus();
  }, viivitus);

  ajastused.push(id);
}

function puhastaAjastused() {
  ajastused.forEach(clearTimeout);
  ajastused = [];
}

// ========================================
// ÜMBRIKU AVAMINE
// ========================================

envelopeButton.addEventListener("click", () => {
  if (kaartAvatud) return;

  kaartAvatud = true;
  envelopeButton.disabled = true;
  animatsiooniKord++;

  // Tausta aktiivsust muudab index.html.

  // 1. Raputus
  centerStage.classList.add("shaking");

  ajasta(() => {
    centerStage.classList.remove("shaking");

    // 2. Klapp ja kiri
    centerStage.classList.add("opening");

    ajasta(() => {
      const rect =
        envelopeButton.getBoundingClientRect();

      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // 3. Plahvatus
      centerStage.classList.add("exploding");
      looKonfetti(x, y);

      // 4. Fotod
      ajasta(() => {
        lennutaFotod(x, y);
      }, 120);

      // 5. Paberkaart
      ajasta(() => {
        paperCard.classList.add("visible");
      }, 650);

    }, AVAMISE_AEG);

  }, RAPUTUSE_AEG);
});

// ========================================
// KONFETTIPLAHVATUS
// ========================================

function looKonfetti(x, y) {
  const varvid = [
    "#f6c56e",
    "#ffdf9d",
    "#f0a87d",
    "#d99160",
    "#fff5dc",
    "#e6b96f",
    "#f8d0bd"
  ];

  for (let i = 0; i < KONFETI_ARV; i++) {
    const tykk = document.createElement("span");

    tykk.className = "particle confetti";

    const suurus = juhuslik(5, 13);

    tykk.style.left = x + "px";
    tykk.style.top = y + "px";
    tykk.style.width = suurus + "px";
    tykk.style.height = suurus * 1.4 + "px";

    tykk.style.background =
      varvid[Math.floor(juhuslik(0, varvid.length))];

    if (Math.random() > 0.7) {
      tykk.style.borderRadius = "50%";
    }

    document.body.appendChild(tykk);

    const nurk = juhuslik(0, Math.PI * 2);
    const kaugus = juhuslik(90, KONFETI_KAUGUS);

    const dx = Math.cos(nurk) * kaugus;
    const dy = Math.sin(nurk) * kaugus;

    const keerlemine = juhuslik(-1000, 1000);

    const animatsioon = tykk.animate(
      [
        {
          transform:
            "translate(0,0) rotate(0deg) scale(.3)",
          opacity: 1
        },
        {
          transform:
            `translate(${dx * 0.65}px,` +
            `${dy * 0.65 - 75}px) ` +
            `rotate(${keerlemine * 0.6}deg)`,
          opacity: 1,
          offset: 0.45
        },
        {
          transform:
            `translate(${dx}px,${dy + 180}px) ` +
            `rotate(${keerlemine}deg)`,
          opacity: 0
        }
      ],
      {
        duration: juhuslik(1400, 2600),
        easing: "cubic-bezier(.15,.6,.35,1)",
        fill: "forwards"
      }
    );

    animatsioon.onfinish = () => tykk.remove();
  }
}

// ========================================
// FOTODE LEND
// ========================================

function lennutaFotod(x, y) {
  photos.forEach((foto, indeks) => {
    if (foto.hidden) return;

    const sihtX =
      foto.offsetLeft + foto.offsetWidth / 2;

    const sihtY =
      foto.offsetTop + foto.offsetHeight / 2;

    const algDx = x - sihtX;
    const algDy = y - sihtY;

    foto.style.transition = "none";

    foto.style.setProperty(
      "--dx",
      algDx + "px"
    );

    foto.style.setProperty(
      "--dy",
      algDy + "px"
    );

    void foto.offsetWidth;

    ajasta(() => {
      foto.style.removeProperty("transition");

      requestAnimationFrame(() => {
        foto.classList.add("landed");
      });

    }, indeks * 110 + 40);
  });
}

// ========================================
// FOTODELE VAJUTAMINE
// ========================================

photos.forEach((foto) => {
  const sisemine =
    foto.querySelector(".photo-inner");

  foto.addEventListener("click", () => {
    if (!foto.classList.contains("landed")) {
      return;
    }

    sisemine.classList.remove("pop");
    void sisemine.offsetWidth;
    sisemine.classList.add("pop");

    const rect = foto.getBoundingClientRect();

    looSudamed(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    );
  });

  sisemine.addEventListener(
    "animationend",
    (event) => {
      if (event.animationName === "photoPop") {
        sisemine.classList.remove("pop");
      }
    }
  );
});

// ========================================
// SÜDAMED
// ========================================

function looSudamed(x, y) {
  const varvid = [
    "#e6a071",
    "#eeb1aa",
    "#db8e8e",
    "#efbb85",
    "#d8826c"
  ];

  for (let i = 0; i < SUDAMETE_ARV; i++) {
    const syda = document.createElement("span");

    syda.className = "particle heart";
    syda.textContent = "♥";

    syda.style.left = x + "px";
    syda.style.top = y + "px";
    syda.style.fontSize = juhuslik(13, 27) + "px";

    syda.style.color =
      varvid[Math.floor(juhuslik(0, varvid.length))];

    document.body.appendChild(syda);

    const nurk = juhuslik(0, Math.PI * 2);
    const kaugus = juhuslik(55, 160);

    const dx = Math.cos(nurk) * kaugus;
    const dy = Math.sin(nurk) * kaugus - 50;

    const animatsioon = syda.animate(
      [
        {
          transform:
            "translate(-50%,-50%) scale(.2)",
          opacity: 0
        },
        {
          transform:
            `translate(calc(-50% + ${dx * 0.35}px),` +
            `calc(-50% + ${dy * 0.35}px)) scale(1.2)`,
          opacity: 1,
          offset: 0.3
        },
        {
          transform:
            `translate(calc(-50% + ${dx}px),` +
            `calc(-50% + ${dy}px)) scale(.6)`,
          opacity: 0
        }
      ],
      {
        duration: juhuslik(900, 1600),
        easing: "ease-out",
        fill: "forwards"
      }
    );

    animatsioon.onfinish = () => syda.remove();
  }
}

// ========================================
// KIRJA TAGASI PANEMINE
// ========================================

resetButton.addEventListener("click", () => {
  // index.html seab TAUSTA_AKTIIVSUS = 0.
  // Taust rahuneb sujuvalt.

  animatsiooniKord++;
  puhastaAjastused();

  kaartAvatud = false;

  paperCard.classList.remove("visible");

  // Peidame fotod
  photos.forEach((foto) => {
    foto.style.transition = "none";
    foto.classList.remove("landed");

    const sisemine =
      foto.querySelector(".photo-inner");

    sisemine.classList.remove("pop");

    foto.style.removeProperty("--dx");
    foto.style.removeProperty("--dy");

    void foto.offsetWidth;

    foto.style.removeProperty("transition");
  });

  // Eemaldame konfeti ja südamed
  document.querySelectorAll(".particle")
    .forEach((osake) => {
      osake.getAnimations().forEach(
        (animatsioon) => animatsioon.cancel()
      );
      osake.remove();
    });

  // Taastame ümbriku
  centerStage.style.animation = "none";

  const flap = centerStage.querySelector(".flap");
  const letter = centerStage.querySelector(".letter");

  flap.style.transition = "none";
  letter.style.transition = "none";

  centerStage.classList.remove(
    "shaking",
    "opening",
    "exploding"
  );

  void centerStage.offsetWidth;

  centerStage.style.removeProperty("animation");
  flap.style.removeProperty("transition");
  letter.style.removeProperty("transition");

  envelopeButton.disabled = false;
  envelopeButton.focus();
});
