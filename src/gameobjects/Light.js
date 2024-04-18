import { GameObjects, Physics } from "phaser";

export class Light extends Physics.Arcade.Sprite {
    constructor({scene}) {
        super(scene, 800, 800, 'light').setDepth(50);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }
}