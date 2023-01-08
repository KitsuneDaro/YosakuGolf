window.addEventListener('load', () => {
    new Main();
})

class Main {
    constructor() {
        this.w = 300;
        this.h = 300;
        this.imgNames = [];
        this.app = new ExApp($('#app'), this.w, this.h, this.imgNames);

        this.scene = new Game();
        this.nowTime = 0;
        this.tick();
    }

    tick(timeStamp) {
        //時間更新
        if (timeStamp === undefined) {
            this.nowTime = timeStamp;
        }
        deltaTime = timeStamp - this.nowTime;
        this.nowTime = timeStamp;

        //各シーン実行
        result = this.scene.tick(deltaTime);

        //終了かどうか
        if (result != 'end') {
            window.requestAnimationFrame(this.tick);
        }
    }
}

//シーン
class Scene {
    constructor(app) {
        this.app = app;
    }

    tick(deltaTime) {
        return 'continue';
    }
}

//表示などはこれで

//タイトル
class Title extends Scene {
    constructor(app) {
        super(app);
    }

    tick(deltaTime) {
        return 'continue';
    }
}

//ゲーム本体
class Game extends Scene {
    constructor(app, stageNum) {
        super(app);
        this.stage = new Stage(stageNum);
    }

    renderStage(deltaTime) {
        return 'continue';
    }
}

//ステージデータの格納
//表示スプライトも格納
//以下内部処理、表示は行わない
//マップの頂点の間隔は1なので、傾きは差で良し
class Stage {
    constructor(stageNum) {
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
        this.tiles.evalAll(this.map, this.grads)
    }

    //テスト用
    createStage() {
        for (let x = 0; x < this.w; x++) {
            for (let y = 0; y < this.h; y++) {
                this.map.get(x, y) = Math.random() * 0.2;
            }
        }


        for (let x = 0; x < this.w - 1; x++) {
            for (let y = 0; y < this.h - 1; y++) {
                if (Math.random() > 0.5) {
                    this.tiles.eval(x, y, Tiles.Slash())
                } else {
                    this.createTile(x, y, Tiles.BackSlash());
                }
            }
        }
    }

}

class Gradients {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.x = new Grid(this.w - 1, this.h, new THREE.Vector2(0, 0));
        this.y = new Grid(this.w, this.h - 1, new THREE.Vector2(0, 0));
    }

    evalAll(map) {
        for(let mx = 0; mx < this.w - 1; mx++){
            for(let my = 0; my < this.h; my++){
                this.x.set(mx, my, map.get(mx + 1, my) - map.get(mx, my));
            }
        }
        
        for(let mx = 0; mx < this.w; mx++){
            for(let my = 0; my < this.h - 1; my++){
                this.y.set(mx, my, map.get(mx, my + 1) - map.get(mx, my));
            }
        }
    }
    
}

//上三角と下三角の組み合わせのマップパターン
class Tiles {
    constructor(w, h) {
        this.shape = new Grid(w, h, 0);
        this.mesh = [
            new Grid(w, h, 0),
            new Grid(w, h, 0)
        ];
    }

    eval(map, grads, x, y, slashWay) {
        this.shape.set(x, y, slashWay);

    }

    // tile [0 / 1] and [1 \ 0]
    static Upper() {
        return 0;
    }

    static Lower() {
        return 1;
    }

    // line / or \
    static Slash() {
        return 0;
    }

    static BackSlash() {
        return 1;
    }
}