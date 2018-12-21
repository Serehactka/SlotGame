import { Sprite, Texture, Graphics, extras } from 'pixi.js';
import { Reel } from './Reel';
import { IEvent } from '../Interfaces/main.interface';

const SLOT_DEFAULT_WIDTH = 1200,
    SLOT_DEFAULT_HEIGHT = 600,
    SLOT_REEL_HEIGHT = 540,
    SLOT_DEFAULT_BUTTON_INDENT = 120,
    SLOT_REELS_COUNT = 5,
    SPIN_START_DELAY = 100;

export class SlotWindow extends Sprite {
    protected frameSprite: Sprite = new Sprite(Texture.fromImage('../img/slotOverlay.png'));
    protected backgroundSprite: extras.TilingSprite = new extras.TilingSprite(Texture.fromImage('../img/winningFrameBackground.jpg'));
    protected areaMask: Graphics = new Graphics();
    protected Reels: Array<Reel> = [];
    private events: any = {};

    constructor() {
        super();

        this.setupSprites(SLOT_DEFAULT_WIDTH - SLOT_DEFAULT_BUTTON_INDENT, SLOT_DEFAULT_HEIGHT);
        this.setupReels();
        this.Reels[this.Reels.length - 1].subscribe('end-spin', this.handleNotification.bind(this));
    }

    subscribe(type: string, handler: Function) {
        this.events[type] = this.events[type] || [];
        this.events[type].push(handler);
    }

    notify(e: IEvent) {
        if (!this.events[e.type]) {
            throw 'No such event ' + event.type;
        }

        this.events[e.type].forEach(handler => {
            handler(e);
        });
    }

    handleNotification(e: IEvent): void {
        e.type === 'end-spin' && this.notify({
            type: 'end-spin',
            data: []
        });
    }

    setupSprites(width: number, height: number): void {
        this.addChild(this.backgroundSprite);
        this.addChild(this.frameSprite);
        this.addChild(this.areaMask);

        this.backgroundSprite.mask = this.areaMask;

        this.areaMask.beginFill(0xffffff, 255);
        this.areaMask.drawRoundedRect(30, 37, width - 75, height - 50, 20);
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
    }

    setDimensions(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    spinReels(): void {
        this.Reels.forEach( (reel, index) => {
            setTimeout(() => {
                reel.startSpin();
            }, index * SPIN_START_DELAY);
        });
    }
}