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
        this.ox = 4.5;
        this.oy = 4.5;
        this.oz = 0;
        this.angle = 0;
    }

    tick(deltaTime) {
        this.angle += 1 / 10 * 2 * Math.PI * deltaTime / 1000;
        this.app.camera.position.set(this.ox, this.oy, this.oz + 50);
        this.app.camera.lookAt(new THREE.Vector3(this.ox, this.oy, this.oz));

        this.app.light.position.set(this.ox, this.oy + Math.sin(this.angle) * 10, this.oz + Math.cos(this.angle) * 10);
        this.app.light.target.position.set(this.ox, this.oy, this.oz);
        this.app.render();
        return 'continue';
    }
}
