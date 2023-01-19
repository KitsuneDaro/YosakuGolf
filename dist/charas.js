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
        color: 0xffff33,
        side: THREE.DoubleSide
    });

    constructor(app, stage, x, z) {
        super(app);
        this.stage = stage;

        this.p = new THREE.Vector3(x, Yosaku.H() / 2 + this.stage.getY(x, z), z);

        this.v = new THREE.Vector3(0, 0, 0);
        this.f = new THREE.Vector3(0, 0, 0);

        this.mesh = new THREE.Mesh(Yosaku.Geometry, Yosaku.Material);
        this.app.scene.add(this.mesh);
    }

    tick(deltaTime) {
        let gap = this.v.clone();
        gap.multiplyScalar(-deltaTime * 10);
        this.stage.look.position = this.p.clone();
        this.stage.look.position.add(gap);
        
        //カメラ移動
        let angle = this.stage.look.angle.xz;
        
        if (Key.ofArrow()) {
            if (Key.codes[Key.Up()]) {
                this.f.x += -Math.cos(angle);
                this.f.z += -Math.sin(angle);
            }

            if (Key.codes[Key.Down()]) {
                this.f.x += -Math.cos(angle + Math.PI);
                this.f.z += -Math.sin(angle + Math.PI);
            }

            if (Key.codes[Key.Left()]) {
                this.f.x += -Math.cos(angle - Math.PI / 2);
                this.f.z += -Math.sin(angle - Math.PI / 2);
            }

            if (Key.codes[Key.Right()]) {
                this.f.x += -Math.cos(angle + Math.PI / 2);
                this.f.z += -Math.sin(angle + Math.PI / 2);
            }

            this.f.multiplyScalar(Yosaku.Speed());
        }

        this.update(deltaTime);

        this.stage.look.angle.xz = angle + 1 / 720 * Math.PI * this.f.x;

        this.p.y = Yosaku.H() / 2 + this.stage.getY(this.p.x, this.p.z);
        this.mesh.position.set(this.p.x, this.p.y, this.p.z);
        this.mesh.rotation.y = -angle + Math.PI / 2;

        this.f = new THREE.Vector3(0, 0, 0);
    }
}

class Tree extends Chara{
    static LeavesGeometry = Tree.setLeavesGeometry();
    static LeavesMaterial = new THREE.MeshStandardMaterial({color: 0x339933});

    static StemGeometry = Tree.setStemGeometry();
    static StemMaterial = new THREE.MeshStandardMaterial({color: 0x996600});

    static RootGeometry = Tree.setRootGeometry();
    static RootMaterial = new THREE.MeshStandardMaterial({color: 0x996600});

    static StemH() {
        return Chara.PxPerMeter() * 5;
    }

    static StemDiameter() {
        return Chara.PxPerMeter() * 2 / 3;
    }

    static LeavesStep() {
        return Chara.PxPerMeter() / 3;
    }

    static RootH() {
        return Chara.PxPerMeter() * 0.5;
    }

    static setLeavesGeometry() {
        let leaves = [];

        for (let i = 0; i < 3; i++) {
            leaves[i] = new THREE.CylinderGeometry(Tree.StemDiameter() + (Tree.StemDiameter() - Tree.LeavesStep()) * i, Tree.StemDiameter() * 2 + (Tree.StemDiameter() - Tree.LeavesStep()) * i, Tree.StemDiameter(), 4);
            leaves[i].translate(0, (Tree.StemH() - Tree.StemDiameter()) / 2 - Tree.StemDiameter() * i, 0);
        }

        return new THREE.BufferGeometryUtils.mergeBufferGeometries(leaves);
    }

    static setStemGeometry() {
        let stem = new THREE.BoxGeometry(Tree.StemDiameter(), Tree.StemH() - Tree.RootH() * 2, Tree.StemDiameter());

        return stem;
    }

    static setRootGeometry() {
        let root = new THREE.BoxGeometry(Tree.StemDiameter(), Tree.RootH(), Tree.StemDiameter());
        root.translate(0, (Tree.RootH() - Tree.StemH()) / 2, 0);

        return root;
    }

    constructor(app, stage, x, z) {
        super(app);
        this.stage = stage;

        this.leavesMesh = new THREE.Mesh(Tree.LeavesGeometry, Tree.LeavesMaterial);
        this.app.scene.add(this.leavesMesh);

        this.stemMesh = new THREE.Mesh(Tree.StemGeometry, Tree.StemMaterial);
        this.app.scene.add(this.stemMesh);
 
        this.rootMesh = new THREE.Mesh(Tree.RootGeometry, Tree.RootMaterial);
        this.app.scene.add(this.rootMesh);
        
        this.p = new THREE.Vector3(x, Tree.StemH() / 2 + this.stage.getY(x, z), z);
    }

    tick() {
        let d = this.stage.sprites[0].p.clone().sub(this.p);
        d.y = 0;
        
        if (d.length() < (Yosaku.W() + Tree.StemDiameter()) / 2) {
            this.stage.sprites[0].f.add(d.divide(new THREE.Vector3(1, 1, 1))).multiplyScalar(20);
        }
        
        this.leavesMesh.position.set(this.p.x, this.p.y, this.p.z);
        this.stemMesh.position.set(this.p.x, this.p.y, this.p.z);
        this.rootMesh.position.set(this.p.x, this.p.y, this.p.z);
    }
}