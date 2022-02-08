import { Application, Loader, Sprite, Text, Texture } from "pixi.js";
import SlotController from "./SlotController";
import HowlerMiddleware from 'howler-pixi-loader-middleware';
import Button from "./Button";
import DescriptionText from "./DescriptionText";
const app = new Application({
    width: innerWidth,
    height:innerHeight
});

document.body.appendChild(app.view);

const loader = Loader.shared;
loader.pre(HowlerMiddleware);

loader.add("btn_spin_disabled", "./assets/images/btn_spin_disabled.png")
    .add("btn_spin_hover", "./assets/images/btn_spin_hover.png")
    .add("btn_spin_normal", "./assets/images/btn_spin_normal.png")
    .add("btn_spin_pressed", "./assets/images/btn_spin_pressed.png")
    .add("symbol_1", "./assets/images/symbol_1.png")
    .add("symbol_2", "./assets/images/symbol_2.png")
    .add("symbol_3", "./assets/images/symbol_3.png")
    .add("symbol_4", "./assets/images/symbol_4.png")
    .add("symbol_5", "./assets/images/symbol_5.png")
    .add("symbol_6", "./assets/images/symbol_6.png")
    .add("symbol_7", "./assets/images/symbol_7.png")
    .add("symbol_8", "./assets/images/symbol_8.png")
    .add('startButtonSound', "./assets/sounds/Start_Button.mp3")
    .add('reelStopSound1', "./assets/sounds/Reel_Stop_1.mp3")
    .add('reelStopSound2', "./assets/sounds/Reel_Stop_2.mp3")
    .add('reelStopSound3', "./assets/sounds/Reel_Stop_3.mp3")
    .add('reelStopSound4', "./assets/sounds/Reel_Stop_4.mp3")
    .add('reelStopSound5', "./assets/sounds/Reel_Stop_5.mp3")
    .load((l) => {
        const descriptionText = new DescriptionText('Click Spin To start', 550, 480);

        const slotController = new SlotController(app.stage, 3, 5);
        const spinButtonDisabledSprite: Sprite = new Sprite(Texture.from('btn_spin_disabled'));
        const spinButtonHoverSprite: Sprite = new Sprite(Texture.from('btn_spin_hover'));
        const spinButtonNormalSprite: Sprite = new Sprite(Texture.from('btn_spin_normal'));
        const spinButtonPressedSprite: Sprite = new Sprite(Texture.from('btn_spin_pressed'));
        const spinButton =  new Button(spinButtonNormalSprite, spinButtonDisabledSprite, spinButtonPressedSprite, spinButtonHoverSprite, slotController, descriptionText);
        spinButton.setToBeDisabled();
        spinButton.pivot.x = 0.5;
        spinButton.pivot.y = 0.5;
        spinButton.position.x = 500;
        spinButton.position.y = 500;
        spinButton.width = 100;
        spinButton.height = 100;
        app.stage.addChild(spinButton);
        slotController.setOnDropOffComplete(spinButton);
        app.stage.addChild(descriptionText.getContainer());

        slotController.init();
    });