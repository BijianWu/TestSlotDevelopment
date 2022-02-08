import { Container, Text } from "pixi.js";
import IRenderable from "./IRenderable";
import gsap from "gsap";

export default class DescriptionText implements IRenderable{
    private readonly _scaleAmount: number = 1.2;

    private _text: Text;
    private _container: Container;

    private _pulsingGSAP: gsap.core.Tween | undefined;
    public constructor(title: string, xPos: number, yPos: number){
        this._container = new Container();
        this._text = new Text('Click Spin To start', { fill: 0xfffb00 });
        this._text.anchor.set(0.5);
        this._text.position.set(550, 480);
        this._container.addChild(this._text);
    }

    setToVisible = () => {
        this._container.visible = true;
        this.startPulsingTheText();
    };

    setToInvisible = () => {
        this._container.visible = false;
        this.stopPulsingTheText();
    };

    private startPulsingTheText = () => {
        this._pulsingGSAP = gsap.fromTo(this._text.scale, {x : 1, y : 1}, {x: this._scaleAmount, y: this._scaleAmount, repeat: -1, yoyo: true})
    }

    private stopPulsingTheText = () => {
        if(this._pulsingGSAP){
            this._pulsingGSAP.kill();
            this._pulsingGSAP = undefined;
        }
    }


    public getContainer = ()=>{
        return this._container;
    }
}