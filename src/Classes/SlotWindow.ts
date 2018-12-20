import { Sprite, Texture, Graphics, extras } from 'pixi.js';
import { Reel } from './Reel';

const SLOT_DEFAULT_WIDTH = 1368,
    SLOT_DEFAULT_HEIGHT = 630,
    SLOT_REEL_HEIGHT = 600,
    SLOT_DEFAULT_BUTTON_INDENT = 120,
    SLOT_REELS_COUNT = 5,
    SLOT_BACKGROUND_LEFT_FIX = 60,
    SLOT_BACKGROUND_RIGHT_FIX = 40,
    SLOT_BACKGROUND_TOP_FIX = 60,
    SLOT_BACKGROUND_BOTTOM_FIX = -10;

export class SlotWindow extends Sprite {
    protected frameSprite: Sprite = new Sprite(Texture.fromImage('../img/slotOverlay.png'));
    protected backgroundSprite: extras.TilingSprite = new extras.TilingSprite(Texture.fromImage('../img/winningFrameBackground.jpg'));
    protected areaMask: Graphics = new Graphics();
    protected Reels: Array<Reel> = [];

    constructor(width: number = SLOT_DEFAULT_WIDTH, 
                height: number = SLOT_DEFAULT_HEIGHT, 
                buttonIndent: number = SLOT_DEFAULT_BUTTON_INDENT) {
        
        super();

        window['Slot'] = this;

        this.setupSprites(width - buttonIndent, height);
        this.setupReels();
    }

    setupSprites(width: number, height: number): void {
        this.addChild(this.backgroundSprite);
        this.addChild(this.frameSprite);
        this.addChild(this.areaMask);

        this.backgroundSprite.mask = this.areaMask;

        this.areaMask.beginFill(0xffffff, 255);
        this.areaMask.drawRoundedRect(30, 35, width - 80, height - 50, 20);
        this.areaMask.endFill();

        this.backgroundSprite.width = width;
        this.backgroundSprite.height = height;

        this.frameSprite.anchor.x = this.frameSprite.width / 2;
        this.frameSprite.anchor.y = this.frameSprite.height / 2;

        this.frameSprite.x = width / 2;
        this.frameSprite.y = height / 2;

        this.frameSprite.width = width;
        this.frameSprite.height = height;
    }

    setupReels(): void {
        const reelStep = SLOT_DEFAULT_WIDTH/SLOT_REELS_COUNT - 40,
            reelHeight = SLOT_REEL_HEIGHT;
        
        var index = 0;

        for (index; index < SLOT_REELS_COUNT; index++) {
            const reel: Reel = new Reel({
                reelStep: reelStep,
                height: reelHeight,
                x: index * reelStep
            });

            this.Reels.push(reel);
            this.addChild(reel);
            reel.mask = this.areaMask;
        }

        // window['reel'] = reel;
    }

    setDimensions(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }
}