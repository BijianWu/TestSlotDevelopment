import { gsap } from 'gsap';
import { Container, Loader, Sprite, Texture } from 'pixi.js';

export default class Slot{
    private readonly _maxJumpUpHeightWhenLanding: number = 10;

    private readonly _maxRotationWhenLanding: number = 0.1;

    private readonly _landingShakingEffectDuration: number = 0.05;

    private _stage: Container;

    private _width: number;

    private _height: number;
    
    private _index: number;

    private _desPosX: number;
    private _desPosY: number;

    private _startingY: number;
    private _dropOffY: number;

    private _sprite: Sprite;

    private _row: number;

    private _column: number;

    constructor(stage: Container, index: number, width: number, height: number, row: number, column: number, offsetX: number, offsetY: number, startingY: number, dropOffY: number){
        this._stage = stage;
        this._index = index;
        this._width = width;
        this._height = height;
        this._row = row;
        this._column = column;
        this._startingY = startingY + this._height /2;
        this._dropOffY = dropOffY + this._height /2;

        this._desPosX = this._column * this._width + offsetX + this._width /2;
        this._desPosY = this._row * this._height + offsetY + this._height /2;

        this._sprite = new Sprite(Texture.from('symbol_1'));
        this._sprite.anchor.set(0.5, 0.5);
        this._sprite.x = this._desPosX;
        this._sprite.width = this._width;
        this._sprite.height = this._height;
        this._sprite.position.y = this._startingY
        this._stage.addChild(this._sprite);

    }

    public getIndex = () => {
        return this._index;
    }

    public dropIn(symbolString: string, dropInFinished){
        this._sprite.texture = Texture.from(`symbol_${symbolString}`);

        gsap.fromTo(this._sprite.position, {y: this._startingY}, {y: this._desPosY, duration: 0.1, 
            onComplete: ()=>{
                dropInFinished();
                this.playFallingStopSound();
                this.shakingABitWhenLanding();
            }});
    }

    private shakingABitWhenLanding = () => {
        const jumpUpHeight = Math.random() * this._maxJumpUpHeightWhenLanding;

        const isLeftSideRotation = Math.floor(Math.random() * 2) === 0;
        let rotationAmount = 0;
        if(isLeftSideRotation) {
            rotationAmount -= Math.random() * this._maxRotationWhenLanding;
        } else {
            rotationAmount += Math.random() * this._maxRotationWhenLanding;
        }

        gsap.fromTo(this._sprite, {rotation: 0}, {rotation: rotationAmount, duration: this._landingShakingEffectDuration});
        gsap.fromTo(this._sprite.position, {y: this._desPosY}, {y: this._desPosY - jumpUpHeight, duration: this._landingShakingEffectDuration});

        gsap.fromTo(this._sprite, {rotation: rotationAmount}, {rotation: 0, duration: this._landingShakingEffectDuration, delay: this._landingShakingEffectDuration});
        gsap.fromTo(this._sprite.position, {y: this._desPosY - jumpUpHeight}, {y: this._desPosY, duration: this._landingShakingEffectDuration, delay: this._landingShakingEffectDuration});
    }

    private playFallingStopSound(){
        const randomNum = Math.floor(Math.random() * 5);
        switch(randomNum){
            case 0:
                const fallingStopSound1 = Loader.shared.resources.reelStopSound1.data;
                fallingStopSound1.play();
                break;
            case 1:
                const fallingStopSound2 = Loader.shared.resources.reelStopSound2.data;
                fallingStopSound2.play();
                break;
            case 2:
                const fallingStopSound3 = Loader.shared.resources.reelStopSound3.data;
                fallingStopSound3.play();
                break;
            case 3:
                const fallingStopSound4 = Loader.shared.resources.reelStopSound4.data;
                fallingStopSound4.play();
                break;
            case 4:
                const fallingStopSound5 = Loader.shared.resources.reelStopSound5.data;
                fallingStopSound5.play();
                break;
            default:
                const fallingStopSoundDefault = Loader.shared.resources.reelStopSound1.data;
                fallingStopSoundDefault.play();
                break;
        }
    }

    public dropOff(dropOffFinished){
        gsap.fromTo(this._sprite.position, {y: this._sprite.position.y}, {y: this._dropOffY, duration: 0.1, onComplete: ()=> dropOffFinished()});
    }
}