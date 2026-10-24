import Phaser from "phaser";
import { recordLevelCompletion } from "@/game/levelTimes";

const VIEW_WIDTH = 960;
const VIEW_HEIGHT = 540;
const LEVEL_ID = "echostep-main";
const WORLD_WIDTH = 2_780;
const WORLD_HEIGHT = 760;
const RUN_SPEED = 310;
const RUN_ACCELERATION = 2_100;
const GROUND_DRAG = 2_200;
const JUMP_SPEED = 600;
const COYOTE_TIME_MS = 120;
const JUMP_BUFFER_MS = 140;
const RESPAWN_Y = 690;

type PlatformData = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const PLATFORMS: PlatformData[] = [
  { x: 0, y: 500, width: 405, height: 28 },
  { x: 485, y: 425, width: 150, height: 22 },
  { x: 700, y: 500, width: 220, height: 28 },
  { x: 975, y: 425, width: 175, height: 22 },
  { x: 1_205, y: 500, width: 245, height: 28 },
  { x: 1_525, y: 420, width: 155, height: 22 },
  { x: 1_730, y: 500, width: 230, height: 28 },
  { x: 2_035, y: 415, width: 160, height: 22 },
  { x: 2_245, y: 500, width: 535, height: 28 },
];

export default class EchoStepScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private letterKeys!: Record<"a" | "d", Phaser.Input.Keyboard.Key>;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private exit!: Phaser.Physics.Arcade.Image;
  private hasWon = false;
  private lastGroundedAt = Number.NEGATIVE_INFINITY;
  private jumpBufferedUntil = Number.NEGATIVE_INFINITY;
  private levelStartedAt: number | null = null;
  private pausedAt: number | null = null;
  private pausedDuration = 0;

  constructor() {
    super("EchoStepScene");
  }

  create() {
    this.hasWon = false;
    this.lastGroundedAt = Number.NEGATIVE_INFINITY;
    this.jumpBufferedUntil = Number.NEGATIVE_INFINITY;
    this.levelStartedAt = null;
    this.pausedAt = null;
    this.pausedDuration = 0;
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.physics.world.gravity.y = 1_450;
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, VIEW_HEIGHT);
    this.cameras.main.setBackgroundColor("#17151a");

    this.drawLaboratory();
    this.createTextures();
    this.createPlatforms();
    this.createExit();
    this.createPlayer();
    this.bindControls();

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.exit, this.reachExit, undefined, this);

    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setDeadzone(290, 110);
    this.cameras.main.setFollowOffset(-110, 0);
    this.cameras.main.roundPixels = true;

    this.events.on(Phaser.Scenes.Events.PAUSE, this.pauseLevelTimer, this);
    this.events.on(Phaser.Scenes.Events.RESUME, this.resumeLevelTimer, this);
    this.levelStartedAt = performance.now();
  }

  update() {
    if (this.hasWon || !this.player.body) return;

    const left = this.cursors.left.isDown || this.letterKeys.a.isDown;
    const right = this.cursors.right.isDown || this.letterKeys.d.isDown;
    const grounded = this.player.body.blocked.down || this.player.body.touching.down;
    const now = this.time.now;

    if (grounded) {
      this.lastGroundedAt = now;
    }

    if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
      this.jumpBufferedUntil = now + JUMP_BUFFER_MS;
    }

    if (left === right) {
      this.player.setAccelerationX(0);
      this.player.setDragX(GROUND_DRAG);
    } else {
      this.player.setAccelerationX(left ? -RUN_ACCELERATION : RUN_ACCELERATION);
      this.player.setDragX(0);
      this.player.setFlipX(left);
    }

    const canJump = now - this.lastGroundedAt <= COYOTE_TIME_MS;
    if (this.jumpBufferedUntil >= now && canJump) {
      this.player.setVelocityY(-JUMP_SPEED);
      this.jumpBufferedUntil = Number.NEGATIVE_INFINITY;
      this.lastGroundedAt = Number.NEGATIVE_INFINITY;
    }

    if (this.player.y > RESPAWN_Y) {
      this.player.setPosition(120, 450);
      this.player.setVelocity(0, 0);
      this.player.setAcceleration(0, 0);
      this.jumpBufferedUntil = Number.NEGATIVE_INFINITY;
      this.lastGroundedAt = Number.NEGATIVE_INFINITY;
    }
  }

  private bindControls() {
    if (!this.input.keyboard) return;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.letterKeys = this.input.keyboard.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    }) as typeof this.letterKeys;
    this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  private createPlayer() {
    this.player = this.physics.add.sprite(120, 450, "runner");
    this.player.setDisplaySize(28, 38);
    this.player.setBodySize(21, 33);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(10);
    this.player.setMaxVelocity(RUN_SPEED, 1_050);
    this.player.setDragX(GROUND_DRAG);
  }

  private createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    for (const platform of PLATFORMS) {
      const centerX = platform.x + platform.width / 2;
      const centerY = platform.y + platform.height / 2;
      this.add
        .rectangle(centerX, centerY + 8, platform.width - 4, 8, 0x000000, 0.16)
        .setDepth(1);

      const block = this.platforms.create(centerX, centerY, "platform") as Phaser.Physics.Arcade.Image;
      block.setDisplaySize(platform.width, platform.height);
      block.refreshBody();
      block.setDepth(2);
    }
  }

  private createExit() {
    const x = 2_625;
    const baseY = 486;
    const y = baseY - 40;
    this.add
      .rectangle(x, y, 66, 96, 0x201e24)
      .setStrokeStyle(2, 0x77747b, 1)
      .setDepth(3);
    this.add
      .rectangle(x, y, 48, 78, 0x29262f)
      .setStrokeStyle(1, 0x4b4652, 1)
      .setDepth(4);
    this.add.rectangle(x - 17, y, 2, 60, 0x77cfc7, 0.88).setDepth(5);
    this.add.rectangle(x + 15, y - 26, 5, 7, 0xb68a55, 0.85).setDepth(5);

    const label = this.add
      .text(x, baseY - 101, "EXIT", {
        color: "#c3c0c8",
        fontFamily: "monospace",
        fontSize: "10px",
        letterSpacing: 2,
      })
      .setOrigin(0.5)
      .setDepth(6);
    this.exit = this.physics.add.staticImage(x, y, "exit-zone");
    this.exit.setAlpha(0);
    this.exit.setSize(50, 86);
    this.exit.refreshBody();
    this.exit.setDepth(6);
  }

  private createTextures() {
    const platformGraphic = this.make.graphics({ x: 0, y: 0 });
    platformGraphic.fillStyle(0x37363d, 1);
    platformGraphic.fillRect(0, 0, 160, 30);
    platformGraphic.fillStyle(0x797982, 1);
    platformGraphic.fillRect(0, 0, 160, 3);
    platformGraphic.fillStyle(0x29282e, 1);
    platformGraphic.fillRect(0, 6, 160, 22);
    platformGraphic.fillStyle(0x6aaea8, 0.78);
    platformGraphic.fillRect(5, 3, 150, 1);
    platformGraphic.fillStyle(0x9b999f, 0.82);
    platformGraphic.fillRect(10, 12, 2, 4);
    platformGraphic.fillRect(148, 12, 2, 4);
    platformGraphic.fillStyle(0x47464e, 1);
    platformGraphic.fillRect(16, 21, 128, 2);
    platformGraphic.generateTexture("platform", 160, 30);
    platformGraphic.destroy();

    const runnerGraphic = this.make.graphics({ x: 0, y: 0 });
    runnerGraphic.fillStyle(0x55d9d1, 0.15);
    runnerGraphic.fillRect(2, 2, 34, 44);
    runnerGraphic.fillStyle(0x70d9d2, 1);
    runnerGraphic.fillRect(7, 5, 24, 35);
    runnerGraphic.fillStyle(0x25373a, 1);
    runnerGraphic.fillRect(10, 12, 18, 8);
    runnerGraphic.fillStyle(0xb8f4ed, 0.9);
    runnerGraphic.fillRect(12, 15, 14, 2);
    runnerGraphic.fillStyle(0x4b8e8a, 1);
    runnerGraphic.fillRect(9, 37, 8, 9);
    runnerGraphic.fillRect(21, 37, 8, 9);
    runnerGraphic.generateTexture("runner", 38, 48);
    runnerGraphic.destroy();

    const exitGraphic = this.make.graphics({ x: 0, y: 0 });
    exitGraphic.fillStyle(0xffffff, 1);
    exitGraphic.fillRoundedRect(0, 0, 48, 82, 20);
    exitGraphic.generateTexture("exit-zone", 48, 82);
    exitGraphic.destroy();
  }

  private drawLaboratory() {
    const background = this.add.graphics().setDepth(-10);
    background.fillStyle(0x17151a, 1);
    background.fillRect(0, 0, WORLD_WIDTH, VIEW_HEIGHT);
    background.fillStyle(0x201e24, 1);
    background.fillRect(0, 78, WORLD_WIDTH, 312);
    background.fillStyle(0x29272e, 1);
    background.fillRect(0, 78, WORLD_WIDTH, 7);
    background.fillStyle(0x111014, 1);
    background.fillRect(0, 390, WORLD_WIDTH, 150);
    background.fillStyle(0x302d35, 1);
    background.fillRect(0, 390, WORLD_WIDTH, 3);

    const seams = [84, 450, 905, 1_405, 1_885, 2_340, 2_710];
    for (const x of seams) {
      background.lineStyle(2, 0x343139, 0.72);
      background.lineBetween(x, 88, x, 386);
      background.lineStyle(1, 0x111014, 0.9);
      background.lineBetween(x + 4, 88, x + 4, 386);
    }

    const cabinets = [
      { x: 285, y: 236, width: 58, height: 136 },
      { x: 1_090, y: 280, width: 74, height: 92 },
      { x: 1_925, y: 218, width: 68, height: 154 },
    ];
    for (const cabinet of cabinets) {
      const centerX = cabinet.x + cabinet.width / 2;
      const centerY = cabinet.y + cabinet.height / 2;
      this.add
        .rectangle(centerX, centerY, cabinet.width, cabinet.height, 0x1b191f)
        .setStrokeStyle(2, 0x3c3942, 1)
        .setDepth(-5);
      this.add
        .rectangle(centerX, cabinet.y + 29, cabinet.width - 14, 34, 0x27252d)
        .setStrokeStyle(1, 0x343139, 1)
        .setDepth(-4);
      this.add.rectangle(cabinet.x + 10, cabinet.y + 12, 4, 4, 0x9e784d, 0.75).setDepth(-3);
      background.lineStyle(1, 0x45414a, 0.8);
      background.lineBetween(cabinet.x + 11, cabinet.y + 76, cabinet.x + cabinet.width - 8, cabinet.y + 91);
    }

    background.lineStyle(4, 0x2c2931, 1);
    background.lineBetween(660, 86, 660, 124);
    background.lineBetween(660, 124, 792, 124);
    background.lineBetween(792, 124, 792, 188);
    background.lineStyle(1, 0x48434e, 0.8);
    background.lineBetween(660, 84, 660, 120);
    background.lineBetween(660, 120, 792, 120);
    background.lineBetween(792, 120, 792, 184);
  }

  private reachExit() {
    if (this.hasWon) return;
    this.hasWon = true;
    this.player.setVelocity(0, 0);
    this.physics.pause();
    const completedAt = this.pausedAt ?? performance.now();
    const completionTimeMs = Math.max(
      0,
      completedAt - (this.levelStartedAt ?? completedAt) - this.pausedDuration,
    );
    this.levelStartedAt = null;
    this.pausedAt = null;
    this.game.events.emit("echostep-victory", recordLevelCompletion(LEVEL_ID, completionTimeMs));
  }

  private pauseLevelTimer() {
    if (this.levelStartedAt !== null && this.pausedAt === null && !this.hasWon) {
      this.pausedAt = performance.now();
    }
  }

  private resumeLevelTimer() {
    if (this.pausedAt !== null) {
      this.pausedDuration += performance.now() - this.pausedAt;
      this.pausedAt = null;
    }
  }
}
