import { Sprite, Texture,  loaders } from 'pixi.js';
import { IDimensionProperties } from '../Interfaces/main.interface';

const symbolsMap = require('../data/symbols.json');
const symbolsArray: Array<string> = symbolsMap.data;
const symbolsCount: number =  symbolsArray.length;

const CELL_WIDTH = 160;
const CELL_HEIGHT_FIX = 20;


export class ReelCell extends Sprite {
    constructor(options: IDimensionProperties) {
        super();

        this.setRandomTexture();
        this.setConstantDimensions();
        this.calculateRelativePosition(options);
    }

    setRandomTexture(): void {
        const randomSymbolIndex: number = Math.round(Math.random() * (symbolsCount-1));
        const texture: Texture = Texture.fromImage(symbolsMap.path + symbolsArray[randomSymbolIndex]);

        this.setTexture(texture);
    }

    setTexture(texture: Texture): void {
        this.texture = texture;
    }

    setConstantDimensions(): void {
        const _width = this.width,
            _height = this.height,
            _proportions = _width/_height;

        this.width = CELL_WIDTH;
        this.height = CELL_WIDTH/_proportions;
    }

    calculateRelativePosition(options: IDimensionProperties): void {
        const X = (options.width - CELL_WIDTH) / 2;
            // Y = (options.height - this.height) / 2 - options.stepIndex * CELL_HEIGHT_FIX;

        options.x = options.x || 0;
        options.y = options.y || 0;

        this.x = Math.round(options.x + X);
        this.y = Math.round(options.y);
    }
}