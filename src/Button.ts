import { Container, DisplayObject, InteractionEvent, Loader, Text } from "pixi.js";
import SlotController from "./SlotController";

export enum buttonStates {
    enabled,
    disabled,
    pressed,
    over
}

export default class Button extends Container {
    protected _defaultStateSprite: DisplayObject;

    protected _disabledStateSprite: DisplayObject;

    protected _pressedStateSprite: DisplayObject;

    protected _mouserOverStateSprite: DisplayObject;

    private _buttonEnabledText: Text;
    
    private _buttonDisabledText: Text;

    private _slotController: SlotController;

    private _descriptionText;

    public constructor (defaultStateSprite: DisplayObject, disabledStateSprite: DisplayObject, pressedStateSprite: DisplayObject, mouserOverStateSprite: DisplayObject, slotController: SlotController, descriptionText : Text) {
        super();

        this._defaultStateSprite = defaultStateSprite;
        this._disabledStateSprite = disabledStateSprite;
        this._pressedStateSprite = pressedStateSprite;
        this._mouserOverStateSprite = mouserOverStateSprite;
        this._slotController = slotController;
        this._descriptionText = descriptionText;
        this._buttonEnabledText = new Text('Spin', { fill: 0xffffff });
        this._buttonEnabledText.anchor.set(0.5);
        this._buttonEnabledText.position.set(90, 55);
        this._buttonEnabledText.visible = false;
        this._buttonDisabledText = new Text('Spin', { fill: 0x383838 });
        this._buttonDisabledText.anchor.set(0.5);
        this._buttonDisabledText.position.set(90, 55);
        this._buttonDisabledText.visible = false;

        this.addChild(this._defaultStateSprite);
        this.addChild(this._disabledStateSprite);
        this.addChild(this._pressedStateSprite);
        this.addChild(this._mouserOverStateSprite);
        this.addChild(this._buttonEnabledText);
        this.addChild(this._buttonDisabledText);
        this.addEventListeners();
        this.buttonMode = true;
        this.interactive = true;
        this.showState(buttonStates.enabled);  
    }

    private _onButtonDown= () => {
        this.showState(buttonStates.pressed);
        this.onButtonDown();
    }

    public addEventListeners(): void{
        this.on("pointerdown", ()=> { this._onButtonDown()});
        this.on("pointerover", ()=> { this._onButtonOver()});
        this.on("pointerout", ()=> { this._onButtonOut()});
        this.on("pointerup", ()=> { this._onButtonUp()});
    }

    protected onButtonDown= () => {
    }

    private _onButtonUp= () => {
        this.showState(buttonStates.disabled);
        this.onButtonUp();
    }
    protected onButtonUp= () => {
        this.removeAllListeners();
        this._slotController.spin();
        this.setToBeDisabled();
        const buttonClickSound = Loader.shared.resources.startButtonSound.data;
        buttonClickSound.play();
    }

    public setTobeEnable = () => {
        this.interactive = true;
        this.addEventListeners();
        this.showState(buttonStates.enabled);
        this._descriptionText.visible = true;
    }

    public setToBeDisabled = () => {
        this.interactive = false;
        this.showState(buttonStates.disabled);
        this._descriptionText.visible = false;
    }

    private _onButtonOver = () => {
        this.showState(buttonStates.over);
        this.onButtonOver();
    }

    protected onButtonOver= () => {}

    private _onButtonOut(): void {

        this.showState(buttonStates.enabled);
        this.onButtonOut();
    }

    protected onButtonOut(): void {}

    protected hideButtonStates(): void{
        if(this._defaultStateSprite) this._defaultStateSprite.visible = false;
        if(this._disabledStateSprite) this._disabledStateSprite.visible = false;
        if(this._pressedStateSprite) this._pressedStateSprite.visible = false;
        if(this._mouserOverStateSprite) this._mouserOverStateSprite.visible = false;
    }

    protected showState(state: buttonStates): void {
        this.hideButtonStates();

        switch(state){
            case buttonStates.pressed:
                if(this._pressedStateSprite) this._pressedStateSprite.visible = true;
            break;

            case buttonStates.disabled:
                this._buttonEnabledText.visible = false;
                this._buttonDisabledText.visible = true;
                if(this._disabledStateSprite) this._disabledStateSprite.visible = true;
            break;

            case buttonStates.over:
                if(this._mouserOverStateSprite) this._mouserOverStateSprite.visible = true;
            break;

            case buttonStates.enabled:
            default:
                this._buttonEnabledText.visible = true;
                this._buttonDisabledText.visible = false;
                if(this._defaultStateSprite) this._defaultStateSprite.visible = true;
            break;
        }
    }
}