class Yosaku extends Chara{
    constructor(app, stage, x, y){
        super(app);
        this.stage = stage;
        this.w = 0.3;
        this.h = 0.3;

        this.p = {
            x: x,
            y: y
        };
        this.p.z = this.h / 2 + this.stage.getZ(this.p.x, this.p.y);

        this.v = {x: 0, y: 0, z: 0};
        this.f = {x: 0, y: 0, z: 0};
    
        this.geometry = new THREE.PlaneGeometry(this.w, this.h);
        this.material = new THREE.MeshStandardMaterial({
            color: 0x996633,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.app.scene.add(this.mesh);
    }

    tick(deltaTime) {
        this.f = {x: 0, y: 0, z: 0};

        let angle  = this.stage.look.angle.xy;

        if(Key.ofArrow(this.app.keyCode)){
            if(this.app.keyCode == Key.Up()){
                this.v.x = -Math.cos(angle);
                this.v.y = -Math.sin(angle);
            }

            if(this.app.keyCode == Key.Down()){
                this.v.x = -Math.cos(angle + Math.PI);
                this.v.y = -Math.sin(angle + Math.PI);
            }

            if(this.app.keyCode == Key.Left()){
                this.v.x = -Math.cos(angle - Math.PI / 2);
                this.v.y = -Math.sin(angle - Math.PI / 2);
            }

            if(this.app.keyCode == Key.Right()){
                this.v.x = -Math.cos(angle + Math.PI / 2);
                this.v.y = -Math.sin(angle + Math.PI / 2);
            }
        } else {
            this.v = {x: 0, y: 0, z: 0};
        }

        this.update(deltaTime);

        this.p.z = this.h / 2 + this.stage.getZ(this.p.x, this.p.y);
        this.mesh.position.set(this.p.x, this.p.z, this.p.y);
        this.mesh.rotation.y = -angle + Math.PI / 2;
    }
}