class Yosaku extends Chara {
    static W() {
        return Chara.PxPerMeter();
    }

    static H() {
        return Chara.PxPerMeter();
    }

    static Speed() {
        return 3;
    }

    static Geometry = new THREE.PlaneGeometry(Yosaku.W(), Yosaku.H());

    static Material = new THREE.MeshStandardMaterial({
        color: 0x996633,
        side: THREE.DoubleSide
    });

    constructor(app, stage, x, y) {
        super(app);
        this.stage = stage;

        this.p = new THREE.Vector3(x, y, Yosaku.H() / 2 + this.stage.getZ(x, y));

        this.v = new THREE.Vector3(0, 0, 0);
        this.f = new THREE.Vector3(0, 0, 0);

        this.mesh = new THREE.Mesh(Yosaku.Geometry, Yosaku.Material);
        this.app.scene.add(this.mesh);
    }

    tick(deltaTime) {
        this.f = new THREE.Vector3(0, 0, 0);

        this.stage.look.position = this.p;

        let angle = this.stage.look.angle.xy;

        if (Key.ofArrow()) {
            if (Key.codes[Key.Up()]) {
                this.f.x += -Math.cos(angle);
                this.f.y += -Math.sin(angle);
            }

            if (Key.codes[Key.Down()]) {
                this.f.x += -Math.cos(angle + Math.PI);
                this.f.y += -Math.sin(angle + Math.PI);
            }

            if (Key.codes[Key.Left()]) {
                this.f.x += -Math.cos(angle - Math.PI / 2);
                this.f.y += -Math.sin(angle - Math.PI / 2);
            }

            if (Key.codes[Key.Right()]) {
                this.f.x += -Math.cos(angle + Math.PI / 2);
                this.f.y += -Math.sin(angle + Math.PI / 2);
            }

            this.f.multiplyScalar(Yosaku.Speed());
        }

        this.update(deltaTime);

        this.p.z = Yosaku.H() / 2 + this.stage.getZ(this.p.x, this.p.y);
        this.mesh.position.set(this.p.x, this.p.z, this.p.y);
        this.mesh.rotation.y = -angle + Math.PI / 2;
    }
}

class Tree extends Chara{
    static Geometry = Tree.setGeometry();

    static Material = new THREE.MeshStandardMaterial();

    static StemDiameter() {
        return Chara.PxPerMeter() * 2 / 3;
    }

    static Step() {
        return Chara.PxPerMeter() / 3;
    }

    static H() {
        return Chara.PxPerMeter() * 4.5;
    }

    static setGeometry() {
        let leaves = [];

        for (let i = 0; i < 1; i++) {
            leaves[i] = new THREE.CylinderGeometry(Tree.StemDiameter() + (Tree.StemDiameter() - Tree.Step()) * i, Tree.StemDiameter() * 2 + (Tree.StemDiameter() - Tree.Step()) * i, Tree.StemDiameter(), 4);
            leaves[i].translate(0, (Tree.H() - Tree.StemDiameter()) / 2 - Tree.StemDiameter() * i, 0);
            leaves[i].setAttribute('color', ExApp.ColorAttribute(0x339900, leaves[i].attributes.position.count * 3, 3));
            console.log(leaves[i].attributes.position.count);
        }

        let stem = new THREE.BoxGeometry(Tree.StemDiameter(), Tree.H(), Tree.StemDiameter());
        stem.setAttribute('color', ExApp.ColorAttribute(0x996666, 14, 3));

        let geometries = leaves.concat(stem);
        return new THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);
    }

    constructor(app, stage, x, y) {
        super(app);
        this.stage = stage;

        this.mesh = new THREE.Mesh(Tree.Geometry, Tree.Material);
        this.app.scene.add(this.mesh);
        this.p = new THREE.Vector3(x, y, Tree.H() / 2 + this.stage.getZ(x, y));
    }

    tick() {
        this.mesh.position.set(this.p.x, this.p.z, this.p.y);
    }
}