// ============================================================
// Week 2: Beki maki jump
// ============================================================

let bg;
let playerimg;

function preload() {
  bg = loadImage("assets/images/background.png");
  playerimg = loadImage("assets/images/character.png");
}

let platforms = [
  // { x, y, w, h }
  { x: 0, y: 410, w: 800, h: 40 }, // ground (full width floor)

  { x: 280, y: 310, w: 120, h: 16 }, //  low platform
  { x: 280, y: 140, w: 140, h: 16 }, // centre top platform
];

// modded platform
let moddedplatform = { x: 280, y: 310, w: 120, h: 16 };
let boostJump = false;

let player = {
  x: 100,
  y: 100,

  vx: 0, // horizontal velocity
  vy: 0, // vertical velocity

  r: 20, // visual radius for blob drawing and collision

  // Movement tuning — change these to adjust how the game feels
  speed: 0.55, // horizontal acceleration per frame
  maxSpeed: 4.5, // maximum horizontal speed
  jumpForce: -12, // upward velocity applied when jumping (negative = upward)
  friction: 0.78, // horizontal slowdown when no key is pressed (0–1, lower = more friction)

  onGround: false, // tracks whether the player is standing on something
};

const GRAVITY = 0.6; // downward force added to vy every frame

// Blob animation time — increases each frame to animate the wobble
let blobT = 0;

// Platform colour stored as an array so it can be reused easily
const PLATFORM_COLOR = [255, 160, 50]; // warm orange

function setup() {
  createCanvas(800, 450);

  // Place player on top of the ground platform (index 0 in the array)
  player.y = platforms[0].y - player.r;
}

function draw() {
  image(bg, 0, 0, width, height);

  handleInput();
  applyPhysics();
  resolvePlatformCollisions();

  drawPlatforms();
  drawModplatform();
  drawPlayer();
  drawHUD();

  blobT += 0.015;
}

function handleInput() {
  // --- Horizontal movement ---
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    // LEFT or A
    player.vx -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    // RIGHT or D
    player.vx += player.speed;
  }

  player.vx = constrain(player.vx, -player.maxSpeed, player.maxSpeed);

  if (
    !keyIsDown(LEFT_ARROW) &&
    !keyIsDown(65) &&
    !keyIsDown(RIGHT_ARROW) &&
    !keyIsDown(68)
  ) {
    player.vx *= player.friction;
  }

  // --- Jump ---
  // The player can only jump when standing on the ground (onGround = true).
  // This prevents jumping again mid-air.
  if (
    (keyIsDown(UP_ARROW) || keyIsDown(87) || keyIsDown(32)) &&
    player.onGround
  ) {
    // UP or W

    if (boostJump) {
      player.vy = player.jumpForce * 1.4;
    } else {
      player.vy = player.jumpForce;
    }
  }
}

function applyPhysics() {
  // 1. Apply gravity — pulls the player down every frame
  player.vy += GRAVITY;

  // 2. Move player by its current velocity
  player.x += player.vx;
  player.y += player.vy;

  // 3. Keep player inside canvas horizontally
  player.x = constrain(player.x, player.r, width - player.r);

  // 4. If player falls below the canvas, reset to start position
  if (player.y > height + 100) {
    player.x = 100;
    player.y = platforms[0].y - player.r;
    player.vx = 0;
    player.vy = 0;
  }

  // Assume in the air until collision check says otherwise
  player.onGround = false;
}

function resolvePlatformCollisions() {
  boostJump = false;
  for (let i = 0; i < platforms.length; i++) {
    let p = platforms[i];

    // Player's bounding box edges
    let playerLeft = player.x - player.r;
    let playerRight = player.x + player.r;
    let playerBottom = player.y + player.r;

    // Platform edges
    let platLeft = p.x;
    let platRight = p.x + p.w;
    let platTop = p.y;

    let overlapsHorizontally = playerRight > platLeft && playerLeft < platRight;

    let landingOnTop =
      player.vy >= 0 && playerBottom >= platTop && playerBottom <= platTop + 20;

    if (overlapsHorizontally && landingOnTop) {
      player.y = platTop - player.r; // snap to platform surface
      player.vy = 0; // stop falling
      player.onGround = true; // allow jumping again

      if (
        p.x == moddedplatform.x &&
        p.y == moddedplatform.y &&
        p.w == moddedplatform.w &&
        p.h == moddedplatform.h
      ) {
        boostJump = true;
      }
    }
  }
}

function drawModplayer() {}

function drawPlatforms() {
  fill(PLATFORM_COLOR[0], PLATFORM_COLOR[1], PLATFORM_COLOR[2]);
  noStroke();

  for (let i = 0; i < platforms.length; i++) {
    let p = platforms[i];
    rect(p.x, p.y, p.w, p.h, 6); // rounded corners
  }
}

function drawModplatform() {
  fill(180, 240, 255);
  noStroke();

  let p = moddedplatform;
  rect(p.x, p.y, p.w, p.h, 6); // rounded corners
}

function drawPlayer() {
  push(); // save current drawing settings

  image(playerimg, player.x, player.y - 19, player.r * 2, player.r * 2);

  pop(); // restore drawing settings
}

function drawHUD() {
  fill(180);
  noStroke();
  textSize(13);
  textAlign(LEFT);
  text("Move: Arrow Keys or WASD   Jump: W or Up Arrow or Space", 16, 24);
}
