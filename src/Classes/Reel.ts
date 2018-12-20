import { Sprite } from 'pixi.js';
import { ReelCell } from './ReelCell';

const BezierEasing = require('bezier-easing');
const animate = require('../vendor/animate');

const REELCELLS_COUNT = 4;
const REEL_TOP_OFFSET = 30;
const REEL_LEFT_OFFSET = 20;
const REELCELL_SPIN_SPEED = 10;
const REELCELL_SPIN_ACCEL = 1;
const FINISH_FRAMES_COUNT = 30;

interface IPosition {
    x: number,
    y: number
}

interface ISize {
    width: number,
    height: number
}

interface IReelProperties {
    x: number,
    height: number,
    reelStep: number
}

interface IDimensionProperties {
    x?: number,
    y?: number,
    width: number,
    height: number,
    stepIndex: number
}

export class Reel extends Sprite {
    protected ReelCells: Array<ReelCell> = [];
    protected reelCellStep: number = 0;
    protected reelCellWidth: number = 0;
    protected spinnedValue: number = 0;
    protected isSpinning: boolean = false;
    protected finishSpinBezier: Function = BezierEasing(0,0.94,0.59,2);
    protected spinBezier: Function = BezierEasing(0,0,1,1);

    constructor(options: IReelProperties) {
        super();

        this.setupReelCells(options);
        this.setPosition(options.x);
        this.fixPosition();

        window['startSpin'] = this.spinTick.bind(this);
        window['Reel'] = this;
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
        this.addChild(reelCell);
    }

    refreshCell(): void {
        /*
         * After cell step spinning we need to recreate first cell and remove last cell
        */

        const freshCell = this.createNewCell({
            width: this.reelCellWidth,
            height: this.reelCellStep,
            y: -1 * this.reelCellStep,
            stepIndex: -1
        });

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

    spin(spinSpeed?: number): void {
        animate({
            tickStep: 1,
            delay: 5000,
            step: (step, val) => {
                // console.log(step, val);
                this.spinTick(step);
            },
            complete: () => {
                // this.refreshCell();
                this.finishSpin();
            },
            bezier: this.spinBezier
        });

        // if (!this.isSpinning && this.spinnedValue == 0) {
        //     this.finishSpin();
        //     return null;
        // }

        // spinSpeed = REELCELL_SPIN_SPEED;

        // spinSpeed = spinSpeed || 0;
        // spinSpeed += REELCELL_SPIN_ACCEL;
        // spinSpeed > REELCELL_SPIN_SPEED && (spinSpeed = REELCELL_SPIN_SPEED);

        // this.spinTick(spinSpeed);
        // requestAnimationFrame(this.spin.bind(this, spinSpeed));
    }

    finishSpin(): void {
        animate({
            from: this.spinnedValue - 10,
            to: this.reelCellStep,
            delay: 600,
            step: (step, val) => {
                this.spinTick(step);
            },
            complete: () => {
                this.spinnedValue = 0;
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
            cell.y += spinSpeed;
        });

        this.spinnedValue += spinSpeed;

        if (this.spinnedValue >= this.reelCellStep) {
            console.log('spinned');
            this.spinnedValue = 0;
            this.refreshCell();
        }
    }
}