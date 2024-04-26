import { Scene } from "phaser";

export class Hud extends Scene{
    remainingTime = 0;
    jarsLit = 0;

    remainingTimeText;
    jarsLitText;

    init(data){
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.remainingTime = data.remainingTime;
    }

    create(){
        this.jarsLitText = this.add.bitmapText("parisiennePng", "Lit Jars: 0/4", 24);
        this.remainingTimeText = this.add.bitmapText(this.scale.width - 10, 10, "parisiennePng", 
                                `Time Remaining: ${this.remaining_time}s`, 24).setOrigin(1, 0);;
    }

    updateLitJarsCounter(jarsLitCount) {
        this.jarsLitText.setText(`Lit Jars:${jarsLitCount.toString().padStart(4, "0")}`);
    }

    update_timeout(timeout) {
        this.remainingTimeText.setText(`Time Remaining:${timeout.toString().padStart(2, "0")}s`);
    }
}