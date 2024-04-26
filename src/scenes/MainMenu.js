import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    cafeMusic = null;
    isAudioInPlay = false;

    constructor ()
    {
        super('MainMenu');
    }

    init(){
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    create ()
    {
        
        this.add.image(960, 540, 'titlescreen').setOrigin(0.5 ,0.5);

        //Audio play
        if (!this.isAudioInPlay) {
            this.cafeMusic = this.sound.add('cafe');
            this.cafeMusic.play({
                loop: true,
                volume: 0.1,
            })
            this.isAudioInPlay = true;
        }

        const startMsg = this.add.text(940, 980, 'Click to start the game', {
            fontFamily: 'Parisienne', fontSize: 90, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center'
        }).setOrigin(0.5, 0.5);

        // Tween to blink the text
        this.tweens.add({
            targets: startMsg,
            alpha: 0,
            duration: 1000,
            ease: (value) => Math.abs(Math.round(value)),
            yoyo: true,
            repeat: -1
        });

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
