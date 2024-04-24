import { Scene } from 'phaser';
import { Player } from '../gameobjects/Player';
import { Light } from '../gameobjects/Light';
import { Firefly } from '../gameobjects/Firefly';
import { Jar } from '../gameobjects/Jar';

export class Game extends Scene
{
    //Objects delcarations
    player = null;
    jar1 = null;
    jar2 = null;
    jar3 = null;
    jar4 = null;
    jar = null;
    jars = [];
    light = null;
    lightsGroup = null;
    firefly = null;
    firefliesGroup = null;
    cursors = null;
    lightVFX = null;
    playerLightVFX = null;
    fireflyLightVFX = null;

    //Counters
    firefliesInJar = 0;
    jarLighted = 0;
    winCondition = 4;

    //Booleans
    isPlayerLighted = false;
    isAudioInPlay = false;
    isJarLighted

    //Timer event
    playerLightResetTimer = null;
    playerLightDuration = 10000;

    //Audio
    cafeMusic = null;
    chargeSFX = null;
    shutdownSFX = null;
   
    constructor ()
    {
        super('Game');
    }
    
    create ()
    {
        //Audio play
        if (!this.isAudioInPlay) {
            this.cafeMusic = this.sound.add('cafe');
            this.cafeMusic.play({
                loop: true,
                volume: 0.1,
            })
            this.isAudioInPlay = true;
        }

        this.chargeSFX = this.sound.add('lightup');
        this.shutdownSFX = this.sound.add('shutdown');

        //Set the cursor
        this.cursors = this.input.keyboard.createCursorKeys(); 
        
        //Create the player
        this.player = new Player({scene: this});

        //Crate the jar
      
        // this.jar1 = new Jar({scene: this});
        // this.jar1.setPosition(1017.91, 2845.78);
        // this.jar2 = new Jar({scene: this});
        // this.jar2.setPosition(4737.53,2906.91);
        // this.jar3 = new Jar({scene: this});
        // this.jar3.setPosition(6658.96,2430.16);
        // this.jar4 = new Jar({scene: this});
        // this.jar4.setPosition(2644.95, 2197.10);

        //Create Light
        this.lightsGroup =  this.physics.add.group();
        for (let i = 0; i < 5; i++) {
            let x = Phaser.Math.Between(100, 6000); 
            let y = Phaser.Math.Between(100, 400);
            this.light = new Light({scene: this});
            this.light.setPosition(x, y);
            this.lightVFX = this.lights.addLight(x, y, 200).setIntensity(0);
            this.light.body.setSize(50, 50);
            this.lightsGroup.add(this.light);
        }

        //Create firefly
        this.firefliesGroup = this.physics.add.group();
        for (let i = 0; i < 20; i++) {
            let x = Phaser.Math.Between(100, 6000);
            let y = Phaser.Math.Between(100, 4000);
            this.firefly = new Firefly({scene: this})
            this.firefly.setPosition(x, y);
            this.firefliesGroup.add(this.firefly);
        }

         this.firefliesGroup.getChildren().forEach(firefly => {
             firefly.light = this.lights.addLight(firefly.x, firefly.y, 100).setIntensity(10);
         });
        
        //World dimension
        this.firefly.setCollideWorldBounds(true);
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
        
        this.lightVFX.setIntensity(3);
        
        //Change to Game Over scene
        // this.input.once('pointerdown', () => {

        //     this.scene.start('GameOver');

        // });
    
        //Per piazzare luci e barattoli
        this.input.addPointer();

        var jarDrag = this.add.image(2000, 2000, 'jar');

        jarDrag.setInteractive();

        this.input.setDraggable(jarDrag);

        jarDrag.on('drag', function (p, x, y) {

            jarDrag.x = x;
            jarDrag.y = y;
            console.log('La posizione di x è:' + x, '\nLa posizione di y è:' + y);

        });
    }
    
    update() {
        //Player Movement
        this.player.move();

        //Check for collision, use this condition to stop collition chek accumulateing
        if (!this.isPlayerLighted && (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0)) {
            this.physics.add.overlap(this.player, this.lightsGroup, this.playerLightOn, null, this);
            console.log('Lucien is not lighted, collision is possible! isPlayerLighted is:' + this.isPlayerLighted);
        }
       
        //Move the light behind Lucien and fireflies
        this.playerLightVFX.x = this.player.x;
        this.playerLightVFX.y = this.player.y;
        
        //Firefly follow
        if ((this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0)) {
            this.firefliesGroup.getChildren().forEach(firefly => {
                const range = 330;
                const distance = Phaser.Math.Distance.Between(firefly.x, firefly.y, this.player.x, this.player.y);
    
                // Check if the player is lighted and within the range of the firefly
                if (this.isPlayerLighted && distance <= range) {
                    // Move the firefly and the light towards the player
                    firefly.x += (this.player.x - 100 - firefly.x) * 0.1; // follow speed
                    firefly.y += (this.player.y - 100 - firefly.y) * 0.1; // follow speed
                    firefly.light.x = firefly.x;
                    firefly.light.y = firefly.y;
                }
            });   
        }
    }

    //Function that starts when Lucien collide with a light
    playerLightOn(player, light) {    
        if (this.isPlayerLighted) return;
        this.playerLightVFX.setIntensity(10);
        this.isPlayerLighted = true;
        console.log('Lucien is lighted! isPlayerLighted is: '+ this.isPlayerLighted);

        //SFX
        this.chargeSFX.play({
            loop:false,
            volume:0.5,
        });

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

       //SFX
       this.shutdownSFX.play({
           loop: false,
           volume: 0.5,

       });
      
       console.log('Lucien is "not lighted" after: ' + (this.playerLightDuration / 1000) + ' seconds. He can light up again!');

       // Reset the timer for the next light activation
       this.playerLightResetTimer.reset({delay: this.playerLightDuration});
    }
}