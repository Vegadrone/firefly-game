import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    // init ()
    // {
    //     //  We loaded this image in our Boot Scene, so we can display it here
    //     this.add.image(512, 384, 'background');

    //     //  A simple progress bar. This is the outline of the bar.
    //     this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //     //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    //     const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

    //     //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    //     this.load.on('progress', (progress) => {

    //         //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
    //         bar.width = 4 + (460 * progress);

    //     });
    // }

    preload ()
    {
        //  Load the assets for the game 
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');

        this.load.image('player', 'lucien.png');
        //this.load.image('light', 'light.png');
        this.load.image('firefly', 'firefly.png');
        this.load.image('tavolino', 'tavolino.png');
        this.load.image('sedia', 'sedia.png');
        this.load.image('lampione', 'lampione.png');
        this.load.image('jar', 'jar.png');

        //Audio
        this.load.audio('cafe', '/audio/Parisian Dream.mp3');
        this.load.audio('lightup', '/audio/lucien_charge.mp3');
        this.load.audio('shutdown', '/audio/spento.mp3');
        this.load.audio('pickup', '/audio/pickup.mp3');
         this.load.audio('drop', '/audio/drop.mp3');
        this.load.audio('jarlightup', '/audio/jarlightup.mp3');
       
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
