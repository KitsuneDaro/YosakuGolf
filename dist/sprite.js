class ExApp {
    constructor(jelm, w, h, imgNames) {
        this.jelm = jelm;
        this.w = w;
        this.h = h;
        this.imgNames = imgNames;

        //キー入力
        this.keyCode = null;
        $('html').on('keydown', ((e) => {
            this.keyCode = e.keyCode;
        }).bind(this));

        $('html').on('keyup', ((e) => {
            this.keyCode = null;
        }).bind(this));
        //絵など
        this.textures = {};

        //three.js
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.jelm.get()[0],
            antialias: false
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.w, this.h);
        this.renderer.shadowMap.enabled = true;

        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(45, this.w / this.h);
        this.camera.position.set(0, 0, 0);

        this.light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        this.light.position.set(0, 0, 0);
        this.scene.add(this.light);
    }

    loadTextures() {
        this.imgNames.forEach(imgName => {
            this.textures[imgName] = THREE.ImageUtils.loadTexture(imgName);
        });
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    resetScene() {
        this.scene = new THREE.Scene();
    }

    add(mesh) {
        this.scene.add(mesh);
    }
}

class Sprite {
    constructor(app) {
        this.app = app;
    }

    tick(deltaTime) {

    }
}

class Chara extends Sprite{
    constructor(app) {
        super(app);
        
        this.m = 1;
        this.p = {x: 0, y: 0, z: 0};
        this.v = {x: 0, y: 0, z: 0};
        this.f = {x: 0, y: 0, z: 0};
    }

    update(deltaTime) {
        ['x', 'y', 'z'].forEach((key) => {
            this.f[key] -= (Chara.AirK() * this.v[key]);// + Chara.FrictionMu() * Chara.GravityG() * this.m);
            this.v[key] += this.f[key] * deltaTime / this.m;
            this.p[key] += this.v[key] * deltaTime;
        });
    }

    static AirK(){
        return 0.1;
    }

    static FrictionMu(){
        return 0.2;
    }

    static GravityG(){
        return 9.8 * Chara.PxPerMeter();
    }

    static PxPerMeter(){
        return 0.3;
    }
}