import { Sprite, filters } from 'pixi.js';
import { ReelCell } from './ReelCell';

import { IDimensionProperties, IReelProperties, IEvent } from '../Interfaces/main.interface';

const BezierEasing = require('bezier-easing');
const animate = require('../vendor/animate');

const REELCELLS_COUNT = 4;
const REEL_TOP_OFFSET = 30;
const REEL_LEFT_OFFSET = 20;
const BLUR_FILTER_STRENGTH = 0;

export class Reel extends Sprite {
    private ReelCells: Array<ReelCell> = [];
    private reelCellStep: number = 0;
    private reelCellWidth: number = 0;
    private spinnedValue: number = 0;
    private isSpinning: boolean = false;
    private finishSpinBezier: Function = BezierEasing(0,0.94,0.79,2);
    private spinBezier: Function = BezierEasing(0,0,1,1);
    private blurFilter: filters.BlurFilter = new filters.BlurFilter(BLUR_FILTER_STRENGTH);
    private eventsList: any = {};

    constructor(options: IReelProperties) {
        super();

        this.setupReelCells(options);
        this.setPosition(options.x);
        this.fixPosition();

        this.blurFilter.blurX = 0;

        window['startSpin'] = this.spinTick.bind(this);
        window['Reel'] = this;
    }

    subscribe(type: string, handler: Function) {
        this.eventsList[type] = this.eventsList[type] || [];
        this.eventsList[type].push(handler);
    }

    notify(e: IEvent) {
        if (!this.eventsList[e.type]) {
            // throw 'No such event ' + e.type;
            return null;
        }

        this.eventsList[e.type].forEach(handler => {
            handler(e);
        });
    }

    setupReelCells(options: IReelProperties): void {
        const reelCellTopStep: number = options.height / REELCELLS_COUNT,
            reelCellLeftStep: number = options.reelStep;

        this.reelCellStep = reelCellTopStep; //Save Reel Cells for the future reeling proccess
        this.reelCellWidth = reelCellLeftStep;

        var index = -1; //One extra cell above visible cells

        for (index; index < REELCELLS_COUNT; index++) {
            const newCell = this.createNewCell({
                width: reelCellLeftStep,
                height: reelCellTopStep,
                y: reelCellTopStep * index,
                stepIndex: index
            });

            this.addCell(newCell);
        }
        
        this.ReelCells.reverse(); // Make sure we are synchronized indexes of child elements and array elements
    }

    createNewCell(options: IDimensionProperties): ReelCell {
        return new ReelCell(options);
    }

    addCell(reelCell: ReelCell): void {
        this.ReelCells.splice(0, 0, reelCell); //Such a way needed for spinning algorithm
        // if (this.isSpinning) debugger;

        this.addChild(reelCell);
    }

    refreshCell(): void {
        /*
         * After cell step spinning we need to recreate first cell and remove last cell
        */

        const freshCell = this.createNewCell({
            width: this.reelCellWidth,
            height: this.reelCellStep,
            y: -1 * this.reelCellStep + this.spinnedValue,
            stepIndex: -1
        });

        // console.log(freshCell.y);

        this.isSpinning && this.blurCell(freshCell);

        this.removeChild(this.ReelCells.pop());
        this.addCell(freshCell);
    }

    setPosition(x?: number, y?: number): void {
        x = x || 0;
        y = y || 0;

        this.x = x;
        this.y = y;
    }

    fixPosition(): void {
        this.y += REEL_TOP_OFFSET;
        this.x += REEL_LEFT_OFFSET;
    }

    startSpin(spinTime?: number): void {
        spinTime = spinTime || 5000;
        this.isSpinning = true;

        this.spin();
        setTimeout(this.stopSpin.bind(this), spinTime);
    }

    spin(): void {
        this.blurCells();

        animate({
            tickStep: 2,
            delay: 3000,
            step: (step, val) => {
                // console.log(step, val);
                this.spinTick(step);
            },
            complete: () => {
                this.finishSpin();
            },
            bezier: this.spinBezier
        });
    }

    finishSpin(): void {
        this.unblurCells();

        animate({
            from: this.spinnedValue,
            to: this.reelCellStep,
            delay: 300,
            step: (step, val) => {
                this.spinTick(step);
            },
            complete: () => {
                this.spinnedValue = 0;
                this.notify({
                    type: 'end-spin',
                    data: null
                });
                // this.refreshCell();
            },
            bezier: this.finishSpinBezier
        })
    }

    stopSpin(): void {
        this.isSpinning = false;
    }

    spinTick(spinSpeed?: number): void {
        /*
         * Simpliest algorithm - just search for cell step spin and then do cell refresh
        */

        spinSpeed = spinSpeed || 0;

        this.ReelCells.forEach( cell => {
            cell.y = Math.round(cell.y + spinSpeed);
        });

        this.spinnedValue += spinSpeed;

        if (this.spinnedValue > this.reelCellStep) {
            this.spinnedValue = this.spinnedValue - this.reelCellStep;
            this.refreshCell();
        }
    }

    blurCell(reelCell: ReelCell): void {
        reelCell.filters = [this.blurFilter];
    }

    blurCells(): void {
        this.ReelCells.forEach( cell => {
            cell.filters = [this.blurFilter];
        });
    }

    unblurCells(): void {
        this.ReelCells.forEach( cell => {
            cell.filters = [];
        });
    }
}