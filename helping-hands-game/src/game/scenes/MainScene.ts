import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Arc;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private npc!: Phaser.GameObjects.Arc;
  private waterWell!: Phaser.GameObjects.Rectangle;
  private playerSpeed = 200;
  
  // Game State
  private hasWater = false;
  private questCompleted = false;
  private interactionText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Create a simple particle texture
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('flare', 8, 8);
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Create a simple ground
    this.add.rectangle(0, 0, width, height, 0x3b8132).setOrigin(0, 0); // Grass green

    // Create Water Well
    this.waterWell = this.add.rectangle(600, 400, 60, 60, 0x3366ff);
    this.physics.add.existing(this.waterWell, true); // Static body

    // Create NPC
    this.npc = this.add.circle(200, 300, 20, 0xff0000); // Red NPC
    this.physics.add.existing(this.npc, true); // Static body

    // Create Player
    this.player = this.add.circle(400, 300, 20, 0xffffff); // White Player
    this.physics.add.existing(this.player);
    (this.player.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

    // Controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // UI Text
    this.interactionText = this.add.text(width / 2, height - 50, '', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#00000088'
    }).setOrigin(0.5).setVisible(false);

    // Instructions
    this.add.text(10, 10, 'WASD/Arrows to Move. E to Interact.', { fontSize: '16px', color: '#ffffff' });
    
    // Colliders/Overlaps
    this.physics.add.overlap(this.player, this.npc, this.handleNpcOverlap, undefined, this);
    this.physics.add.overlap(this.player, this.waterWell, this.handleWellOverlap, undefined, this);
  }

  update() {
    if (!this.cursors || !this.player) return;

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      body.setVelocityX(-this.playerSpeed);
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(this.playerSpeed);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      body.setVelocityY(-this.playerSpeed);
    } else if (this.cursors.down.isDown) {
      body.setVelocityY(this.playerSpeed);
    }

    // Clear interaction text if not overlapping (simple check)
    // In a real game, use overlap exit or state
    if (!this.physics.overlap(this.player, this.npc) && !this.physics.overlap(this.player, this.waterWell)) {
        this.interactionText.setVisible(false);
    }
  }

  private handleNpcOverlap() {
    if (this.questCompleted) {
      this.showInteraction("NPC: Thank you for your help! We are safe now.");
    } else if (this.hasWater) {
      this.showInteraction("Press E to give Water");
      if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        this.hasWater = false;
        this.questCompleted = true;
        this.showInteraction("NPC: Oh thank you! Here is a reward.");
        // Add visual feedback (e.g., particles or color change)
        this.npc.setFillStyle(0x00ff00); // Turn Green (Happy)
        
        // Particle effect for happiness
        const particles = this.add.particles(0, 0, 'flare', {
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            gravityY: -100
        });
        particles.setPosition(this.npc.x, this.npc.y);
        particles.explode(50);
      }
    } else {
      this.showInteraction("NPC: I am so thirsty... Could you get water from the well?");
    }
  }

  private handleWellOverlap() {
    if (!this.hasWater && !this.questCompleted) {
      this.showInteraction("Press E to collect Water");
      if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        this.hasWater = true;
        this.player.setFillStyle(0x3366ff); // Turn Blue-ish to show carrying water
        this.showInteraction("Got Water!");
      }
    }
  }

  private showInteraction(text: string) {
    this.interactionText.setText(text);
    this.interactionText.setVisible(true);
    this.interactionText.setDepth(100);
  }
}

