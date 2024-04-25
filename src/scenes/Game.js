import { Scene } from 'phaser';
import { Player } from '../gameobjects/Player';
import { Light } from '../gameobjects/Light';
import { Firefly } from '../gameobjects/Firefly';
import { Jar } from '../gameobjects/Jar';

export class Game extends Scene
{
    //Objects delcarations
    player = null;
    jar = null;
    jarGroup = null;
    light = null;
    lightsGroup = null;
    firefly = null;
    firefliesGroup = null;
    followingFireflies = [];
    cursors = null;
    lightVFX = null;
    playerLightVFX = null;
    fireflyLightVFX = null;
    jarLightVFX = null;

    //Counters
    firefliesInJar = 0;
    followFirefliesMaxCount = 5;
    jarLighted = 0;
    winCondition = 4;

    //Booleans
    isPlayerLighted = false;
    //isAudioInPlay = false;
    isJarLit= false;

    //Timer event
    playerLightResetTimer = null;
    playerLightDuration = 10000;

    //Audio
    //cafeMusic = null;
    chargeSFX = null;
    shutdownSFX = null;
    fireFliesPickupSFX = null;
    fireFliesDropSFX = null;
    jarLightUpSFX = null;
   
    constructor ()
    {
        super('Game');
    }
    
    init(){

        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch('Game');
        this.jarLighted = 0;
        this.isPlayerLighted = false;
        this.isJarLit = false;
    }

    create ()
    {
        this.chargeSFX = this.sound.add('lightup');
        this.shutdownSFX = this.sound.add('shutdown');
        this.fireFliesPickupSFX = this.sound.add('pickup');
        this.fireFliesDropSFX = this.sound.add('drop');
        this.jarLightUpSFX = this.sound.add('jarlightup');

        //Set the cursor
        this.cursors = this.input.keyboard.createCursorKeys(); 
        
        //Create the player
        this.player = new Player({scene: this});

        //Crate the jar
         const jarPositions = [{
                 x: 1683.78,
                 y: 3509.97
             },
             {
                 x: 3037.10,
                 y: 3353.22
             },
             {
                 x: 4941.83,
                 y: 3421.19
             },
             {
                 x: 6211.30,
                 y: 3582.27
             },
           
         ];
        this.jarGroup = this.physics.add.group();
        jarPositions.forEach(pos => {
            this.jar = new Jar({scene: this});
            this.jar.setPosition(pos.x, pos.y);
            this.jar.light = this.lights.addLight(pos.x, pos.y, 1000).setIntensity(0);
            this.jarGroup.add(this.jar);
        })
    
        //Create Light
         const lightPositions = [{
                 x: 353.94,
                 y: 582.51
             },
             {
                 x: 1815.64,
                 y: 869.40
             },
            {
                x: 4440.38,
                y: 862.94
            },
            {
                x: 6712.91,
                y: 766.51
            },
            {
                x: 7158.81,
                y: 409.35
            },
            {
                x: 7431.67,
                y: 731.02
            },
         ];

        this.lightsGroup =  this.physics.add.group();
        lightPositions.forEach(pos=> {
            this.light = new Light({scene: this});
            this.light.setPosition(pos.x, pos.y);
            this.lightVFX = this.lights.addLight(pos.x, pos.y, 1000).setIntensity(10);
            this.light.body.setSize(50, 50);
            this.lightsGroup.add(this.light);

        })

        //Create firefly
        this.firefliesGroup = this.physics.add.group();
        for (let i = 0; i < 20; i++) {
            let x = Phaser.Math.Between(100, 6000);
            let y = Phaser.Math.Between(100, 3000);
            this.firefly = new Firefly({scene: this})
            this.firefly.setPosition(x, y);
            this.firefliesGroup.add(this.firefly);
        }

        this.firefliesGroup.getChildren().forEach(firefly => {
            firefly.light = this.lights.addLight(firefly.x, firefly.y, 100).setIntensity(10);
            firefly.setCollideWorldBounds(true);
        });

        //Fireflies and Jar Logic
        this.physics.add.collider(this.firefliesGroup, this.jarGroup, this.fireflyCollideJar, null, this);

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
        
    }
    
    update() {

         //Change to Game Over scene after win condition
         if (this.jarLighted == this.winCondition) {
             this.scene.start('GameOver');
         }

        //Player Movement
        this.player.move();

        //Check for collision, use this condition to stop collition chek accumulateing
        if (!this.isPlayerLighted && (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0)) {
            this.physics.add.overlap(this.player, this.lightsGroup, this.playerLightOn, null, this);
            this.followFirefliesCount = 0;
            console.log('Lucien is not lighted, collision is possible! isPlayerLighted is:' + this.isPlayerLighted + 
                        '\n Fireflies stop follows, the counter is: ' + this.followFirefliesCount);
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
                    //SFX
                    this.fireFliesPickupSFX.play({
                        loop: false,
                        volume: 0.5,
                    });
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

         //Timer for resetting player light
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

       //Reset the timer for the next light activation
       this.playerLightResetTimer.reset({delay: this.playerLightDuration});
    }

   fireflyCollideJar(firefly, jar) {
       firefly.body.setVelocity(0, 0);

       // Check if the jar is already full of fireflies
       if (jar.firefliesInJar >= this.followFirefliesMaxCount) {
           console.log("Jar is already full of fireflies.");
           return; // Exit the function without further processing
       }

       // Position the firefly in the jar
       firefly.setPosition(jar.x, jar.y);

       // Remove light on the firefly
       firefly.light.setIntensity(0);

       // Remove firefly from fireflies group
       this.firefliesGroup.remove(firefly);

       // Increment counter in the jar
       jar.firefliesInJar++;

       // Light up the jar if enough fireflies are in the jar and it's the specific jar
       if (jar.firefliesInJar === this.followFirefliesMaxCount && !jar.isLit && jar.firefliesInJar >= this.followFirefliesMaxCount) {
           this.jarLightVFX = jar.light; // Set specific jar light
           this.jarLightVFX.setIntensity(10);
           //SFX
           this.jarLightUpSFX.play({
               loop: false,
               volume: 0.5,
           });
           jar.isLit = true; // Flag indicating the jar is lit
           this.jarLighted++; // Increment jarLighted only if the jar was not already lit
           console.log("You lit: " + this.jarLighted + " jar/s");
       }
       console.log("Number of fireflies in this jar:", jar.firefliesInJar);
   }

}