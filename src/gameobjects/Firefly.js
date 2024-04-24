import { GameObjects, Physics } from "phaser";

export class Firefly extends Physics.Arcade.Sprite {
    constructor({ scene }) {
        super(scene, 1000, 1000, 'firefly').setDepth(50);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setScale(2,2);
    }
}