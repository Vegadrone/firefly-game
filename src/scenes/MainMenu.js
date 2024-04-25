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
        //Audio play
        if (!this.isAudioInPlay) {
            this.cafeMusic = this.sound.add('cafe');
            this.cafeMusic.play({
                loop: true,
                volume: 0.1,
            })
            this.isAudioInPlay = true;
        }
         
        this.add.image(512, 384, 'mainmenu');

        this.add.image(512, 300, 'logo').setOrigin(0, 0);

        this.add.text(512, 460, 'Firefly Game', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5, 0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
