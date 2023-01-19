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
        this.grads = new Gradients(this.map);
        this.tiles = new Tiles(this.w - 1, this.h - 1);

        this.sprites = [];

        this.look = {
            position: new THREE.Vector3(4.5, 4.5, 0),
            angle: {
                xy: 1 / 2 * Math.PI,
                z: 1 / 6  * Math.PI
            },
            distance: 10
        };
        this.look.hd = Math.cos(this.look.angle.z) * this.look.distance;
        this.look.vd = Math.sin(this.look.angle.z) * this.look.distance;

        this.lightAngle = 0;
        this.app.light.position.set(this.look.position.x + Math.sin(this.lightAngle) * 10, this.look.position.y + 10, this.look.position.z + Math.cos(this.lightAngle) * 10);        
        this.app.light.lookAt(new THREE.Vector3(this.look.position.x, this.look.position.y, this.look.position.z));

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
                    this.tiles.eval(this.map, x, y, Tiles.Slash())
                } else {
                    this.tiles.eval(this.map, x, y, Tiles.BackSlash());
                }
            }
        }
        this.tiles.setMesh(this.app.scene);
        this.grads.evalAll();

        this.sprites.push(new Yosaku(this.app, this, 4.5, 4.5));
        this.sprites.push(new Tree(this.app, this, 7, 7));
    }

    tick(deltaTime) {
        this.sprites.forEach((sprite) => {
            sprite.tick(deltaTime);
        });
        
        this.app.camera.position.set(
            this.look.position.x + Math.cos(this.look.angle.xy) * this.look.hd,
            this.look.position.z + this.look.vd,
            this.look.position.y + Math.sin(this.look.angle.xy) * this.look.hd
        );
        this.app.camera.lookAt(new THREE.Vector3(this.look.position.x, this.look.position.z, this.look.position.y));
    }

    getZ(px, py) {
        let mx = Math.floor(px);
        let my = Math.floor(py);
        let dx = px - mx;
        let dy = py - my;

        if (mx < 0 || mx >= this.w - 1 || my < 0 || my >= this.h - 1){
            return 0;
        }

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
            if (dx - dy > 0) {// Upper
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
