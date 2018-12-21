import { Sprite, Texture } from 'pixi.js';

export class ReelButton extends Sprite {
    private stages: Object = {};
    public disable: boolean = false;

    constructor(texture?: Texture) {
        super(texture);

        this.interactive = true;
    }

    addRenderSpriteStage(stageName: string, texture: Texture): void {
        this.stages[stageName] = texture;
    }

    setSpriteStage(stageName: string): void {
        this.texture = this.stages[stageName];
    }
}