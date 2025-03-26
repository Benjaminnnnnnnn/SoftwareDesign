import * as PIXI from "pixi.js";

export default class CursorIndicator {
    private indicator: PIXI.Graphics;
    private app: PIXI.Application;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.indicator = this.createIndicator();
        this.setupEventListeners();
    }

    private createIndicator(): PIXI.Graphics {
        const indicator = new PIXI.Graphics();
        indicator.beginFill(0xffffff, 0.8); // Semi-transparent red
        indicator.drawCircle(0, 0, 15);
        indicator.endFill();
        indicator.visible = false;
        indicator.zIndex = 9999;
        indicator.eventMode = 'none';  // <-- This makes it ignore all interactions
        indicator.hitArea = null;      // <-- This removes any automatic hit area
        this.app.stage.addChild(indicator);
        return indicator;
    }

    private setupEventListeners() {
        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen;
        
        this.app.stage.on('pointermove', (event) => {
            this.indicator.position.copyFrom(event.global);
        });
    }

    show() {
        this.indicator.visible = true;
        console.log("indicator visible");
    }

    hide() {
        this.indicator.visible = false;
        console.log("indicator invisible");
    }

    destroy() {
        this.app.stage.removeChild(this.indicator);
        this.indicator.destroy();
        this.app.stage.off('pointermove');
    }
}