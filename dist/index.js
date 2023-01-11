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

        this.look = {
            position: new THREE.Vector3(4.5, 0, 4.5),
            angle: {
                xy: 0,
                z: 1 / 6  * Math.PI
            },
            distance: 20
        };
        this.look.hd = Math.cos(this.look.angle.z) * this.look.distance;
        this.look.vd = Math.sin(this.look.angle.z) * this.look.distance;

        this.lightAngle = 0;
        this.app.light.position.set(this.look.position.x + Math.sin(this.lightAngle) * 10, this.look.position.y + 10, this.look.position.z + Math.cos(this.lightAngle) * 10);        
        this.app.light.lookAt(new THREE.Vector3(this.look.position.x, this.look.position.y, this.look.position.z));
    }

    tick(deltaTime) {
        this.stage.tick(deltaTime);

        //カメラ移動
        this.look.angle.xy += 1 / 5 * Math.PI * deltaTime / 1000;
        this.app.camera.position.set(
            this.look.position.x + Math.sin(this.look.angle.xy) * this.look.hd,
            this.look.position.y + this.look.vd,
            this.look.position.z + Math.cos(this.look.angle.xy) * this.look.hd
        );
        this.app.camera.lookAt(new THREE.Vector3(this.look.position.x, this.look.position.y, this.look.position.z));

        this.app.render();
        return 'continue';
    }
}