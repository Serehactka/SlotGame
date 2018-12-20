// import * as PIXI from 'pixi.js';

import { Application } from 'pixi.js';
import { SlotWindow } from './SlotWindow';

const symbolsMap = require('../data/symbols.json');
const symbolsArray: Array<string> = symbolsMap.data;
const symbolsCount: number =  symbolsArray.length;

const BODY = document.body;
const App = new Application();
const Renderer = App.renderer;
const View = App.view;
const viewport = {
    width: BODY.offsetWidth,
    height: BODY.offsetHeight
};

View.width = viewport.width;
View.height = viewport.height;

Renderer.resize(1368, 630);

document.body.appendChild(App.view);

function loadResources(): void {
    symbolsArray.forEach( symbol => {
        App.loader.add(symbolsMap.path + symbol);
    });
    
    App.loader.load(startGame);
}

function startGame(): void {
    const slotWindow: SlotWindow = new SlotWindow();
    App.stage.addChild(slotWindow);
}

loadResources();

// PIXI.loader.add('example', '../img/btn_spin_pressed.png').load( (loader: any, resources: any) => {
//     example.texture = resources.example.texture;

//     example.width = 60;
//     example.height = 60;

//     example.x = Renderer.width/2 - example.width/2;
//     example.y = Renderer.height/2 - example.height/2;

//     App.stage.addChild(example);

//     // console.log(example);
// });