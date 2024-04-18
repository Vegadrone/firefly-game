import { Scene } from 'phaser';
import { Player } from '../gameobjects/Player';
import { Light } from '../gameobjects/Light';

export class Game extends Scene
{
    //Obbjects delcarations
    player = null;
    light = null;
    //lightsArray = [];
    lightsGroup = null;
    cursors = null;
    lightVFX = null;
    playerLightVFX = null;
    playerLightVFXIntensity = 3;

    //Booleans
    isPlayerLighted = false;


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
        this.lightsGroup =  this.physics.add.group();
        for (let i = 0; i < 8; i++) {
            let x = Phaser.Math.Between(100, 6000); 
            let y = Phaser.Math.Between(100, 400);
            this.light = new Light({scene: this});
            this.light.setPosition(x, y);
            this.lightVFX = this.lights.addLight(x, y, 200).setIntensity(5);
            this.light.body.setSize(50, 50);
            this.lightsGroup.add(this.light);
        }
 
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
        this.playerLightVFX = this.lights.addLight(this.player.x, this.player.y, 200).setIntensity(this.playerLightVFXIntensity);

    }

    update() {
        //Player Movement
        this.player.move();

        //Check for collision
        this.physics.add.overlap(this.player, this.lightsGroup, this.playerCharging, null, this);
        

        //move the light
        this.playerLightVFX.x = this.player.x;
        this.playerLightVFX.y = this.player.y;
    }


    playerCharging(player, light) {
        this.isPlayerLighted = true;
        console.log('collide!' + ' ' + this.isPlayerLighted);
    }
}
