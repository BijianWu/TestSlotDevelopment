import { Container, DisplayObject, TextStyle, Loader, Text } from "pixi.js";
import SlotController from "./SlotController";
import IOnComplete from "./IOnComplete";
import IRenderable from "./IRenderable";

export enum buttonStates {
    enabled,
    disabled,
    pressed,
    over
}

export default class Button extends Container implements IOnComplete {
    private readonly enabledTextStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 30,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#c5dbc6'],
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        lineJoin: 'round',
    });

    private readonly disabledTextStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 30,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#8a8a8a'],
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        lineJoin: 'round',
    });

    protected _defaultStateSprite: DisplayObject;

    protected _disabledStateSprite: DisplayObject;

    protected _pressedStateSprite: DisplayObject;

    protected _mouserOverStateSprite: DisplayObject;

    private _buttonEnabledText: Text;
    
    private _buttonDisabledText: Text;

    private _slotController: SlotController;

    private _renderableDesciption: IRenderable;

    public constructor (defaultStateSprite: DisplayObject, disabledStateSprite: DisplayObject, pressedStateSprite: DisplayObject, mouserOverStateSprite: DisplayObject, slotController: SlotController, descriptionText : IRenderable) {
        super();

        this._defaultStateSprite = defaultStateSprite;
        this._disabledStateSprite = disabledStateSprite;
        this._pressedStateSprite = pressedStateSprite;
        this._mouserOverStateSprite = mouserOverStateSprite;
        this._slotController = slotController;
        this._renderableDesciption = descriptionText;
        this._buttonEnabledText = new Text('Spin', this.enabledTextStyle);
        this._buttonEnabledText.anchor.set(0.5);
        this._buttonEnabledText.position.set(94, 55);
        this._buttonEnabledText.visible = false;
        this._buttonDisabledText = new Text('Spin', this.disabledTextStyle);
        this._buttonDisabledText.anchor.set(0.5);
        this._buttonDisabledText.position.set(94, 55);
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
    onComplete = () => {
        this.setTobeEnable();
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

    private setTobeEnable = () => {
        this.interactive = true;
        this.addEventListeners();
        this.showState(buttonStates.enabled);
        this._renderableDesciption.setToVisible();
    }

    public setToBeDisabled = () => {
        this.interactive = false;
        this.showState(buttonStates.disabled);
        this._renderableDesciption.setToInvisible();
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