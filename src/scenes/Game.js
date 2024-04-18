import { Scene } from 'phaser';
import { Player } from '../gameobjects/Player';
import { Light } from '../gameobjects/Light';

export class Game extends Scene
{
    //Obbjects delcarations
    player = null;
    light = null;
    cursors = null;
    spotlight = null;

    //Booleans
    isPlayerCharged = false;


    constructor ()
    {
        super('Game');
    }

    
    create ()
    {
        //Set the cursor
        this.cursors = this.input.keyboard.createCursorKeys(); 
        
        //Create the player
        this.player = new Player({scene: this});
        this.player.body.setSize(80, 80);       

        //Create Light
        this.light = new Light({scene: this});
        this.light.body.setSize(50, 50);
 
        //World collider and set player collide
        this.player.setCollideWorldBounds(true);
      
        this.physics.world.setBounds(0, 0, 1920 * 4, 1080 * 4);
        
        //Follow Camera
        this.cameras.main.setBounds(0, 0, 1920 * 4 , 1080 * 4);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cameras.main.setBackgroundColor(0x0000ff);

        //Game Background
        const background = this.add.image(0, 0, 'background').setOrigin(0);

        background.setPipeline('Light2D');

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });

        //LightsVFX
        this.lights.enable();
        this.lights.setAmbientColor(0x808080);

        this.spotlight = this.lights.addLight(this.player.x, this.player.y, 200).setIntensity(3);

    }

    update() {
        //Player Movement
        this.player.move();

        //Check for collision
        this.physics.add.overlap(this.player, this.light, this.handleCollision, null, this);

        //move the light
        this.spotlight.x = this.player.x;
        this.spotlight.y = this.player.y;
    }


    handleCollision(player, light) {
        this.isPlayerCharged = true;
        console.log('collide!' + ' ' + this.isPlayerCharged);
    }
}
