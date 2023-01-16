window.addEventListener('load', () => {
    new Main($('#app'));
});

class Main {
    constructor(jelm) {
        let w = jelm.outerWidth(true);
        let h = w;
        this.imgNames = [];

        this.app = new ExApp(jelm, w, h, this.imgNames);

        this.state = new Game(this.app, 0);
        this.nowTime = null;

        window.requestAnimationFrame(this.tick.bind(this));
    }

    tick(timeStamp) {
        //時間更新
        if (this.nowTime === null) {
            this.nowTime = timeStamp;
        }
        let deltaTime = (timeStamp - this.nowTime) / 1000.0;
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
    }

    tick(deltaTime) {
        //カメラ移動
        //this.stage.look.angle.xy += 1 / 5 * Math.PI * deltaTime;

        this.stage.tick(deltaTime);
        this.app.render();
        return 'continue';
    }
}