//ステージデータの格納
//表示スプライトも格納
//マップの頂点の間隔は1なので、傾きは差で良し
class Stage {
    constructor(app, stageNum) {
        this.app = app;
        this.w = 20;
        this.h = 10;

        this.num = stageNum;
        this.map = new Grid(this.w, this.h, 0);
        this.grads = new Gradients(this.w, this.h);
        this.tiles = new Tiles(this.w - 1, this.h - 1);

        this.sprites = [];

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
                this.map.set(x, y, Math.random() * 0.5);
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

        this.sprites.push(new Yosaku(this.app, this, 4.5, 4.5));
    }

    tick(deltaTime) {
        this.sprites.forEach((sprite) => {
            sprite.tick(deltaTime);
        });
    }

    getZ(px, py) {
        let mx = Math.floor(px);
        let my = Math.floor(py);
        let dx = px - mx;
        let dy = py - my;

        if (this.tiles.shape.get(mx, my) == Tiles.Slash()) {
            if (dx + dy < 1) {// Upper
                return (
                    this.map.get(mx, my)
                    + this.grads.x.get(mx, my) * dx
                    + this.grads.y.get(mx, my) * dy
                );
            } else {// Lower
                return (
                    this.map.get(mx + 1, my + 1)
                    + this.grads.x.get(mx, my + 1) * (dx - 1)
                    + this.grads.y.get(mx + 1, my) * (dy - 1)
                );
            }
        } else {
            if (dx - dy > 1) {// Upper
                return (
                    this.map.get(mx + 1, my)
                    + this.grads.x.get(mx, my) * (dx - 1)
                    + this.grads.y.get(mx + 1, my) * dy
                );
            } else {// Lower
                return (
                    this.map.get(mx, my + 1)
                    + this.grads.x.get(mx, my + 1) * dx
                    + this.grads.y.get(mx, my) * (dy - 1)
                );
            }
        }
    }
}
