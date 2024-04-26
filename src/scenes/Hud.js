import { Scene } from 'phaser';


export class Hud extends Scene{
    remainingTime = 0;
    jarsLit = 0;
    totalJars = 4;

    remainingTimeText;
    jarsLitText;
    jarsCountText;

     constructor() {
         super("Hud");
     }

    init(data){
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.remainingTime = data.remainingTime;
    }

    create(){

            this.jarsCountText = this.add.text(50, 30, 'Lit Jars: 0/4', {
                fontFamily: 'Parisienne',
                fontSize: 80,
                stroke: '#000000', 
                strokeThickness: 5,
                color: '#ffffff',
            });

             this.remainingTimeText = this.add.text(1250, 30, 'Time remaining: ', {
                 fontFamily: 'Parisienne',
                 fontSize: 80,
                 stroke: '#000000',
                 strokeThickness: 5,
                 color: '#ffffff',
             });
        }

        updateLitJarCounter(jarsLitCount) {
            this.jarsLit = jarsLitCount;
            this.jarsCountText.setText(`Lit Jars: ${this.jarsLit}/${this.totalJars}`);
        }


        updateTimeout(timeout) {
            this.remainingTimeText.setText(`Time remaining:${timeout.toString().padStart(2, "0")}s`);
        }
}