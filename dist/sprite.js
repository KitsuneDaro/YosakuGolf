class ExApp {
    constructor(elm, w, h, imgNames) {
        this.elm = elm;
        this.w = w;
        this.h = h;
        this.imgNames = imgNames;

        this.rnd = new THREE.WebGLRenderer({
            canvas: $('#app').get(),
            antialias: false
        });
        this.rnd.setPixelRatio(window.devicePixelRatio);
        this.rnd.setSize(this.w, this.h);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, width / height);
        this.camera.position.set(0, 0, 1000);

        this.textures = {};
    }

    loadTextures() {
        this.imgNames.forEach(imgName => {
            this.textures[imgName] = THREE.ImageUtils.loadTexture(imgName);
        });
    }

    render() {
        this.rnd.render(this.scene, this.camera);
    }

    resetScene() {
        this.scene = new THREE.Scene();
    }

    add(mesh) {
        this.scene.add(mesh);
    }
}

class ExSprite {
    constructor(imgName) {
    }
}