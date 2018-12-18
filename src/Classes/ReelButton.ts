import { Sprite, Texture } from 'pixi.js';

export class ReelButton extends Sprite {
    private stages: Object = {};

    constructor(texture?: Texture) {
        super(texture);
    }

    addRenderSpriteStage(stageName: string, texture: Texture): void {
        this.stages[stageName] = texture;
    }

    setSpriteStage(stageName: string): void {
        this.texture = this.stages[stageName];
    }
}