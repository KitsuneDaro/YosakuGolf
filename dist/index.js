window.addEventListener('load', () => {
    new Main();
})

class Main {
    constructor() {
        this.appW = 300;
        this.appH = 300;
        this.imgNames = [];
        this.app = new ExApp($('#app'), this.appW, this.appH, this.imgNames);

        this.state = new Game(this.app, 0);
        this.nowTime = null;
        window.requestAnimationFrame(this.tick.bind(this));
    }

    tick(timeStamp) {
        //時間更新
        if (this.nowTime === null) {
            this.nowTime = timeStamp;
        }
        let deltaTime = timeStamp - this.nowTime;
        this.nowTime = timeStamp;

        //各シーン実行
        let result = this.state.tick(deltaTime);

        //終了かどうか
        if (result != 'end') {
            window.requestAnimationFrame(this.tick.bind(this));
        }
    }
}

//状態
class State {
    constructor(app) {
        this.app = app;
    }

    tick(deltaTime) {
        return 'continue';
    }
}

//表示などはこれで

//タイトル
class Title extends State {
    constructor(app) {
        super(app);
    }

    tick(deltaTime) {
        return 'continue';
    }
}

//ゲーム本体
class Game extends State {
    constructor(app, stageNum) {
        super(app);
        this.stage = new Stage(this.app, stageNum);

        const geometry = new THREE.BoxGeometry(400, 400, 400);
        const material = new THREE.MeshNormalMaterial();
        const box = new THREE.Mesh(geometry, material);
        this.app.scene.add(box);
    }

    renderStage(deltaTime) {
        this.app.render();
        return 'continue';
    }
}

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

        console.log('ok');
    }
}
