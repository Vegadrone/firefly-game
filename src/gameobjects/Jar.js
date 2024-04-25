import { GameObjects, Physics } from "phaser";

export class Jar extends Physics.Arcade.Sprite {
    constructor({scene}) {
        super(scene, scene.x, scene.y, 'jar').setDepth(60);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.firefliesInJar = 0;
    }
}