import { Scene } from 'phaser';
import { Player } from '../gameobjects/Player';
import { Light } from '../gameobjects/Light';
import { Firefly } from '../gameobjects/Firefly';

export class Game extends Scene
{
    //Objects delcarations
    player = null;
    light = null;
    lightsGroup = null;
    firefly = null;
    cursors = null;
    lightVFX = null;
    playerLightVFX = null;
    fireflyLightVFX = null;

    //Booleans
    isPlayerLighted = false;

    //Timer event
    playerLightResetTimer = null;
    playerLightDuration = 10000;

    //Audio
    cafeMusic = null;
   
    constructor ()
    {
        super('Game');
    }
    
    create ()
    {
        //Audio play
        this.cafeMusic = this.sound.add('cafe');
        this.cafeMusic.play({
            loop: true,
            volume: 0.1
        })

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
            this.lightVFX = this.lights.addLight(x, y, 200).setIntensity(0);
            this.light.body.setSize(50, 50);
            this.lightsGroup.add(this.light)
        }

        //Create firefly
        this.firefly = new Firefly({scene: this})
        //this.firefly.setScale(2, 2);

        //World collider and set player/firefly collide
        this.player.setCollideWorldBounds(true);
        this.firefly.setCollideWorldBounds(true);
        
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
        this.fireflyLightVFX = this.lights.addLight(this.firefly.x, this.firefly.y, 100).setIntensity(3);
        this.lightVFX.setIntensity(3);
        
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
            console.log('Lucien is not lighted, collision is possible! isPlayerLighted is:' + this.isPlayerLighted);
        }
       
        //Move the light behind Lucien and fireflies
        this.playerLightVFX.x = this.player.x;
        this.playerLightVFX.y = this.player.y;
        this.fireflyLightVFX.x = this.firefly.x;
        this.fireflyLightVFX.y = this.firefly.y;

        //Firefly follow
        const range = 330; 
        const distance = Phaser.Math.Distance.Between(this.firefly.x, this.firefly.y, this.player.x, this.player.y);
        if (this.isPlayerLighted && distance <= range) {
            this.firefly.x += (this.player.x - 100 - this.firefly.x) * 0.1; //follow speed 
            this.firefly.y += (this.player.y - 100 - this.firefly.y) * 0.1; //follow speed 
       }
    }

    //Function that starts when Lucien collide with a light
    playerLightOn(player, light) {    
        if (this.isPlayerLighted) return;
        this.playerLightVFX.setIntensity(3);
        this.isPlayerLighted = true;
        console.log('Lucien is lighted! isPlayerLighted is: '+ this.isPlayerLighted);

         //Timer
         this.playerLightResetTimer = this.time.addEvent({
            delay: this.playerLightDuration,
            callback: this.resetPlayerLight,
            callbackScope: this,
            loop: false,
        })
    }

    resetPlayerLight() {
       this.isPlayerLighted = false; 
       this.playerLightVFX.setIntensity(0);
      
       console.log('Lucien is "not lighted" after: ' + (this.playerLightDuration / 1000) + ' seconds. He can light up again!');

       // Reset the timer for the next light activation
       this.playerLightResetTimer.reset({delay: this.playerLightDuration});
    }
}