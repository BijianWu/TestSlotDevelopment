import { Container, Graphics } from "pixi.js";
import { gsap } from 'gsap';
import Slot from "./Slot";
import IOnComplete from "./IOnComplete";

export default class SlotController{
    private readonly _allSymbolsStrings: string[] = ["1", "2", "3", "4", "5", "6", "7", "8"];

    private readonly _width: number = 118;

    private readonly _height: number = 113;

    private readonly rowByRowDelayMultiplier = 0.2;

    private readonly columnByColumnDelayMultiplier = 0.1;

    private _stage: Container;
    
    private _row: number;
    
    private _column: number;    

    private _totalNumbersOfSlots: number;
    
    private _slots: Slot[] = [];

    private _isPopulatedAlready: boolean;

    private _scenarioString: string;

    private _onComplete: IOnComplete;
    
    private _container: Container;

    public setOnDropOffComplete = (onComplete: IOnComplete) => {
        this._onComplete = onComplete;
    }

    constructor(stage: Container, row: number, column: number){
        this._stage = stage;
        this._container = new Container();
        this._stage.addChild(this._container);

        this._isPopulatedAlready = false;
        this._row = row;
        this._column = column;

        this._totalNumbersOfSlots = this._row * this._column;
        this.initailiseSlots();

        this._scenarioString = this.getScenarioData();
        this.populateSlots();
    }

    public spin(){
        this._scenarioString = this.getScenarioData();
        this.populateSlots();
    }

    private initailiseSlots(): void{
        const offsetX = 265;
        const offsetY = 100;
        const startingY = this._width - offsetX;
        const dropOffY = this._row * this._height + offsetY;

        const mask = new Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, this._column * this._width, this._row * this._height);
        mask.x = offsetX;
        mask.y = offsetY;
        this._container.mask = mask;
        for(let i = 0; i < this._totalNumbersOfSlots; i++){
            let positioningIndex = i;
            if(positioningIndex < 5){
                positioningIndex += 10;
            } else if(positioningIndex > 9){
                positioningIndex -= 10;
            }
            const row = Math.floor(positioningIndex / this._column);
            const column = positioningIndex % this._column; 
            this._slots.push(new Slot(this._container, i, this._width, this._height, row, column, offsetX, offsetY, startingY, dropOffY));
        }
    }

    private getScenarioData(): string{
        let returnScenarioString = "";
        for(let i = 0; i < this._totalNumbersOfSlots; i++){
            const randomIndex = Math.floor(Math.random() * this._allSymbolsStrings.length);
            returnScenarioString += this._allSymbolsStrings[randomIndex];
        }

        return returnScenarioString;
    }

    private artificalyDelay = async (delayInSeconds: number) =>{
        await new Promise<void>((resolve) => {
            gsap.delayedCall(delayInSeconds, ()=>{
                resolve();
            })
        })
    }

    private async populateSlots(){
        if(this._isPopulatedAlready === true){
            const dropOffSymbols: Promise<void>[] = [];
            for(let i = 0; i < this._totalNumbersOfSlots; i++){
                let dropOffFinished;
                dropOffSymbols.push(new Promise((resolve) => {
                    dropOffFinished = resolve;
                }));
                gsap.delayedCall(this.getDropDelay(i), () => {
                    this._slots[i].dropOff(dropOffFinished);
                })
            }
            
            await Promise.all(dropOffSymbols);
            await this.artificalyDelay(0.1);
        }

        const dropInSymbols: Promise<void>[] = [];
        for(let i = 0; i < this._totalNumbersOfSlots; i++){
            let dropInFinished;
            dropInSymbols.push(new Promise((resolve) => {
                dropInFinished = resolve;
            }));
            gsap.delayedCall(this.getDropDelay(i), () => {
                this._slots[i].dropIn(this._scenarioString[i], dropInFinished);
            })
        }

        await Promise.all(dropInSymbols);
        this._onComplete.onComplete();
        this._isPopulatedAlready = true;
    }

    private getDropDelay = (index) =>{
        const row = Math.floor(this._slots[index].getIndex() / this._column);
        const column = this._slots[index].getIndex() % this._column; 
        const dropOffDelay = column * this.columnByColumnDelayMultiplier + row * this.rowByRowDelayMultiplier;
        
        return dropOffDelay;
    }
}