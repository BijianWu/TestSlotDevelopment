import { Container, Text } from "pixi.js";
import IRenderable from "./IRenderable";

export default class DescriptionText implements IRenderable{
    private _text: Text;
    private _container: Container;
    public constructor(title: string, xPos: number, yPos: number){
        this._container = new Container();
        this._text = new Text('Click Spin To start', { fill: 0xfffb00 });
        this._text.anchor.set(0.5);
        this._text.position.set(550, 480);
        this._container.addChild(this._text);
    }

    setToVisible = () => {
        this._container.visible = true;
    };

    setToInvisible = () => {
        this._container.visible = false;
    };

    public getContainer = ()=>{
        return this._container;
    }
}