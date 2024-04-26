import { Scene } from 'phaser';

export class GameOver extends Scene
{
    jarLitAtTheEnd = 0;
    gameOverText;
    constructor ()
    {
        super('GameOver');
    }
    
    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.jarLitAtTheEnd = data.jarLit|| 0;
    }

    create ()
    {
        this.add.image(960, 540, 'gameover').setOrigin(0.5, 0.5);

        this.gameOverText = this.add.text(940, 100, `You Lit ${this.jarLitAtTheEnd}/4 Jars`, {
            fontFamily: 'Parisienne',
            fontSize: 90,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 10,
            align: 'center',
        }).setOrigin(0.5, 0.5);


        const restartMsg = this.add.text(940, 980, 'Click to play again', {
            fontFamily: 'Parisienne',
            fontSize: 90,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 10,
            align: 'center'
        }).setOrigin(0.5, 0.5);

        // Tween to blink the text
        this.tweens.add({
            targets: restartMsg,
            alpha: 0,
            duration: 1000,
            ease: (value) => Math.abs(Math.round(value)),
            yoyo: true,
            repeat: -1
        });

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');
        });
    }
}
