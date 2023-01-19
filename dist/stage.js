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
            position: new THREE.Vector3(4.5, 0, 4.5),
            angle: {
                xz: 1 / 2 * Math.PI,
                y: 1 / 6  * Math.PI
            },
            distance: 10
        };
        this.look.hd = Math.cos(this.look.angle.y) * this.look.distance;
        this.look.vd = Math.sin(this.look.angle.y) * this.look.distance;

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
            for (let z = 0; z < this.h; z++) {
                this.map.set(x, z, Math.random() * 0.5);
            }
        }

        for (let x = 0; x < this.w - 1; x++) {
            for (let z = 0; z < this.h - 1; z++) {
                if (Math.random() > 0.5) {
                    this.tiles.eval(this.map, x, z, Tiles.Slash())
                } else {
                    this.tiles.eval(this.map, x, z, Tiles.BackSlash());
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
            this.look.position.x + Math.cos(this.look.angle.xz) * this.look.hd,
            this.look.position.y + this.look.vd,
            this.look.position.z + Math.sin(this.look.angle.xz) * this.look.hd
        );
        this.app.camera.lookAt(new THREE.Vector3(this.look.position.x, this.look.position.y, this.look.position.z));
    }

    getY(px, pz) {
        let mx = Math.floor(px);
        let mz = Math.floor(pz);
        let dx = px - mx;
        let dz = pz - mz;

        if (mx < 0 || mx >= this.w - 1 || mz < 0 || mz >= this.h - 1){
            return 0;
        }

        if (this.tiles.shape.get(mx, mz) == Tiles.Slash()) {
            if (dx + dz < 1) {// Upper
                return (
                    this.map.get(mx, mz)
                    + this.grads.x.get(mx, mz) * dx
                    + this.grads.y.get(mx, mz) * dz
                );
            } else {// Lower
                return (
                    this.map.get(mx + 1, mz + 1)
                    + this.grads.x.get(mx, mz + 1) * (dx - 1)
                    + this.grads.y.get(mx + 1, mz) * (dz - 1)
                );
            }
        } else {
            if (dx - dz > 0) {// Upper
                return (
                    this.map.get(mx + 1, mz)
                    + this.grads.x.get(mx, mz) * (dx - 1)
                    + this.grads.y.get(mx + 1, mz) * dz
                );
            } else {// Lower
                return (
                    this.map.get(mx, mz + 1)
                    + this.grads.x.get(mx, mz + 1) * dx
                    + this.grads.y.get(mx, mz) * (dz - 1)
                );
            }
        }
    }
}
