import { Application, Texture } from 'pixi.js';
import { SlotWindow } from './SlotWindow';
import { ReelButton } from './ReelButton';
import { IEvent } from '../Interfaces/main.interface';

const textures = require('../data/textures.json');

const DEFAULT_GAME_HEIGHT = 600;
const DEFAULT_GAME_WIDTH = 1300

class Game {
    private App = new Application({
        width: DEFAULT_GAME_WIDTH,
        height: DEFAULT_GAME_HEIGHT,
        backgroundColor: 0xffffff
    });

    private slotWindow: SlotWindow;
    private body: any = document.body;
    private spinButton: ReelButton;

    constructor() { 
        this.initApp();
    }

    handleNotification(e: IEvent) {
        e.type == 'end-spin' && this.refreshGame();
    }

    initApp(): void {
        this.loadResources((args: Array<any>) => {
            this.createInstances();
            this.setListeners();
            this.startGame();
        });
    }

    loadResources(cb: Function): void {
        textures.forEach( tx => {
            this.App.loader.add(tx);
        });

        this.App.loader.load((...args) => cb && cb(args));
    }

    createInstances(): void {
        this.slotWindow = new SlotWindow();
        this.App.stage.addChild(this.slotWindow);

        this.spinButton = new ReelButton(Texture.fromImage('../img/btn_spin_normal.png'));
        this.spinButton.addRenderSpriteStage('normal', Texture.fromImage('../img/btn_spin_normal.png'));
        this.spinButton.addRenderSpriteStage('hover', Texture.fromImage('../img/btn_spin_hover.png'));
        this.spinButton.addRenderSpriteStage('disable', Texture.fromImage('../img/btn_spin_disable.png'));
        this.spinButton.addRenderSpriteStage('pressed', Texture.fromImage('../img/btn_spin_pressed.png'));
        this.spinButton.x = 900, this.spinButton.y = 500;
        this.App.stage.addChild(this.spinButton);
    }

    setListeners(): void {
        this.spinButton.on('mouseover', this.checkEvent.bind(this));
        this.spinButton.on('mouseout', this.checkEvent.bind(this));
        this.spinButton.on('mousedown', this.checkEvent.bind(this));
        this.spinButton.on('click', this.checkEvent.bind(this));
    }

    checkEvent(e) {
        const currentTarget = e.currentTarget;
        var target = e.target,
            type = e.type;

        switch (type) {
            case 'mousedown':
                if (currentTarget === this.spinButton && !this.spinButton.disable) {
                    this.spinButton.setSpriteStage('pressed');
                }
                break;
            case 'mouseover':
                if (currentTarget === this.spinButton && !this.spinButton.disable) {
                    this.spinButton.setSpriteStage('hover');
                }
                break;
            case 'mouseout':
                if (currentTarget === this.spinButton && !this.spinButton.disable) {
                    this.spinButton.setSpriteStage('normal');
                }
                break;
            case 'click':
                if (currentTarget === this.spinButton && !this.spinButton.disable) {
                    this.spinButton.setSpriteStage('disable');
                    this.startSlotWindowSpinning();
                    this.spinButton.disable = true;
                }
                break;
        }
    }

    startSlotWindowSpinning(): void {
        this.slotWindow.spinReels();
        this.slotWindow.subscribe('end-spin', this.handleNotification.bind(this));
    }

    startGame(): void {
        this.body.append(this.App.view);
    }

    refreshGame(): void {
        this.spinButton.disable = false;
        this.spinButton.setSpriteStage('normal');
    }
}

new Game();