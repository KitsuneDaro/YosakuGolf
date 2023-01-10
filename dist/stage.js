//ステージデータの格納
//表示スプライトも格納
//マップの頂点の間隔は1なので、傾きは差で良し
class Stage {
    constructor(app, stageNum) {
        this.app = app;
        this.w = 10;
        this.h = 10;

        this.num = stageNum;
        this.map = new Grid(this.w, this.h, 0);
        this.grads = new Gradients(this.w, this.h);
        this.tiles = new Tiles(this.w - 1, this.h - 1);

        this.test();
    }

    test() {
        this.createStage();
        this.grads.evalAll(this.map);
    }

    //テスト用
    createStage() {
        for (let x = 0; x < this.w; x++) {
            for (let y = 0; y < this.h; y++) {
                this.map.set(x, y, Math.random() * 0.2);
            }
        }

        for (let x = 0; x < this.w - 1; x++) {
            for (let y = 0; y < this.h - 1; y++) {
                if (Math.random() > 0.5) {
                    this.tiles.eval(this.app.scene, this.map, x, y, Tiles.Slash())
                } else {
                    this.tiles.eval(this.app.scene, this.map, x, y, Tiles.BackSlash());
                }
            }
        }
    }
}
