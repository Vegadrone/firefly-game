import { GameObjects, Physics } from "phaser";

export class Jar extends Physics.Arcade.Sprite {
    constructor({
        scene
    }) {
        super(scene, 3000, 4000, 'jar').setDepth(60);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }
}