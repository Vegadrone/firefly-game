import { GameObjects, Physics } from "phaser";

export class Player extends Physics.Arcade.Sprite {

    constructor({scene}) {
        super(scene, 400, 400, 'player').setDepth(100);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }

   move() {
       // Use 'this' directly instead of 'this.player'
       this.setVelocity(0);

       // Access cursors from the scene
       const cursors = this.scene.cursors;
       const speed = 500;

       if (cursors.left.isDown) {
           this.setVelocityX(-speed);
       } else if (cursors.right.isDown) {
           this.setVelocityX(speed);
       }

       if (cursors.up.isDown) {
           this.setVelocityY(-speed);
       } else if (cursors.down.isDown) {
           this.setVelocityY(speed);
       }
   }
}