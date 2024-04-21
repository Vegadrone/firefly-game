import { Scene } from 'phaser';
import { Player } from '../gameobjects/Player';
import { Light } from '../gameobjects/Light';

export class Game extends Scene
{
    //Objects delcarations
    player = null;
    light = null;
    lightsGroup = null;
    cursors = null;
    lightVFX = null;
    playerLightVFX = null;

    //Numbers
    playerLightVFXIntensity = 0;
    lightVFXIntensity = 3;

    //Booleans
    isPlayerLighted = false;

    //Timer event
    playerLightResetTimer = null;
    playerLightDuration = 5000;
   
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
        for (let i = 0; i < 5; i++) {
            let x = Phaser.Math.Between(100, 6000); 
            let y = Phaser.Math.Between(100, 400);
            this.light = new Light({scene: this});
            this.light.setPosition(x, y);
            this.lightVFX = this.lights.addLight(x, y, 200).setIntensity(3);
            this.light.body.setSize(50, 50);
            this.lightsGroup.add(this.light)
        }

        //World collider and set player collide
        this.player.setCollideWorldBounds(true);
        
        //World dimension
        this.physics.world.setBounds(0, 0, 1920 * 4, 1080 * 4);
        
        //Follow Camera
        this.cameras.main.setBounds(0, 0, 1920 * 4 , 1080 * 4);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        
        //Game Background positioning
        const background = this.add.image(0, 0, 'background').setOrigin(0);

        //Game Background light
        background.setPipeline('Light2D');

        //LightsVFX
        this.lights.enable();
        this.lights.setAmbientColor(0x808080);
        this.playerLightVFX = this.lights.addLight(this.player.x, this.player.y, 200).setIntensity(0);
        
        //Change to Game Over scene
        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }
    
    update() {
        //Player Movement
        this.player.move();

        //Check for collision
        if (!this.isPlayerLighted) {
            this.physics.add.overlap(this.player, this.lightsGroup, this.playerLightOn, null, this);
            console.log('Lucien non è acceso, la collisione è possibile! isPlayerLighted ore è:' + this.isPlayerLighted);
        }

        if (this.isPlayerLighted) {
            //Timer
            this.playerLightResetTimer = this.time.addEvent({
                delay: this.playerLightDuration,
                callback: this.resetPlayerLight,
                callbackScope: this,
                loop: false,
            });
        }
        
        //Move the light behind Lucien
        this.playerLightVFX.x = this.player.x;
        this.playerLightVFX.y = this.player.y;
    }

    //Function that starts when Lucien collide with a light
    playerLightOn(player, light) {    
        if (this.isPlayerLighted) return;
        this.playerLightVFX = this.lights.addLight(this.player.x, this.player.y, 200).setIntensity(3);
        this.isPlayerLighted = true;
        console.log('Lucien ora è acceso! isPlayerLighted ora è: '+ this.isPlayerLighted);
    }

    resetPlayerLight() {
       this.isPlayerLighted = false; 
       this.playerLightVFX.setIntensity(0);
       console.log('Lucien è di nuovo spento dopo: ' + (this.playerLightDuration / 1000) + ' secondi.');

       // Reset the timer for the next light activation
       this.playerLightResetTimer.reset({delay: this.playerLightDuration});
    }
}