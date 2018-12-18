// import * as PIXI from 'pixi.js';

import { Application, Point, Sprite, Texture, Graphics } from 'pixi.js';
import { ReelButton } from './ReelButton';
import { SlotWindow } from './SlotWindow';
import { ReelCell } from './ReelCell';
import { Reel } from './Reel';

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

const example: ReelButton = new ReelButton(Texture.fromImage('../img/btn_spin_disable.png'));
const testBack: Sprite = new Sprite(Texture.fromImage('../img/test_back.jpg'));
const slotWindow: SlotWindow = new SlotWindow();
// const symbol: ReelCell = new ReelCell();

testBack.width = 800;
testBack.height = 600;

const rect: Graphics = new Graphics();
rect.beginFill(0x0000FF, 255);
rect.drawRoundedRect (100,100,200,200, 10);
rect.endFill();

testBack.mask = rect;

example.addRenderSpriteStage('down', Texture.fromImage('../img/btn_spin_pressed.png'));
example.addRenderSpriteStage('up', Texture.fromImage('../img/btn_spin_normal.png'));
example.addRenderSpriteStage('click', Texture.fromImage('../img/btn_spin_hover.png'));



App.stage.addChild(example);
// App.stage.addChild(rect);
// App.stage.addChild(testBack);
App.stage.addChild(slotWindow);
// App.stage.addChild(symbol);
// App.stage.addChild(reel);

example.interactive = true;
example.cursor = 'pointer';

example.on('mousedown', () => example.setSpriteStage('down'));
example.on('mouseup', () => example.setSpriteStage('up'));
example.on('click', () => example.setSpriteStage('click'));

example.width = 60;
example.height = 60;

// PIXI.loader.add('example', '../img/btn_spin_pressed.png').load( (loader: any, resources: any) => {
//     example.texture = resources.example.texture;

//     example.width = 60;
//     example.height = 60;

//     example.x = Renderer.width/2 - example.width/2;
//     example.y = Renderer.height/2 - example.height/2;

//     App.stage.addChild(example);

//     // console.log(example);
// });