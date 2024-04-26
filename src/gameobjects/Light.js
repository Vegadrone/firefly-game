import { GameObjects, Physics } from "phaser";

export class Light extends Physics.Arcade.Sprite {
    constructor({scene}) {
        super(scene, scene.x, scene.y).setDepth(50);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }
}