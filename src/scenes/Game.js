import { Scene } from 'phaser';
import { Player } from '../gameobjects/Player';

export class Game extends Scene
{
    player = null;
    cursors = null;
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        //Set the cursor
        this.cursors = this.input.keyboard.createCursorKeys(); 
        
        this.player = new Player({scene: this});

        this.player.setCollideWorldBounds(true);

        this.cameras.main.setBounds(0, 0, 1920 * 4 , 1080 * 4);
        this.physics.world.setBounds(0, 0, 1920 * 4, 1080 * 4);

        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        this.cameras.main.setBackgroundColor(0x0000ff);

        this.add.image(0, 0, 'background').setOrigin(0);

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }

    update() {
        this.player.move();
    }
}
