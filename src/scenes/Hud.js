import { Scene } from "phaser";

export class Hud extends Scene{
    remainingTime = 0;
    JarsLit = 0;

    remainingTimeText;
    JarsLitText;

    init(data){
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.remainingTime = data.remainingTime;
    }

    create(){
        this.JarsLitText = this.add.bitmapText("pixelfont")
    }

}