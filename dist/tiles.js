//上三角と下三角の組み合わせのマップパターン
class Tiles {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.shape = new Grid(w, h, 0);
        this.mesh = [
            new Grid(w, h, null),
            new Grid(w, h, null)
        ];
    }

    eval(scene, map, x, y, slashWay) {
        this.shape.set(x, y, slashWay);
        const geometry = [
            new THREE.BufferGeometry(),
            new THREE.BufferGeometry()
        ];

        if (slashWay == Tiles.Slash()) {
            var vertices = [
                new Float32Array([
                    x, y, map.get(x, y),
                    x + 1, y, map.get(x + 1, y),
                    x, y + 1, map.get(x + 1, y)
                ]),
                new Float32Array([
                    x + 1, y + 1, map.get(x + 1, y + 1),
                    x + 1, y, map.get(x + 1, y),
                    x, y + 1, map.get(x + 1, y)
                ])
            ];
        } else {
            var vertices = [
                new Float32Array([
                    x + 1, y, map.get(x + 1, y),
                    x, y, map.get(x, y),
                    x + 1, y + 1, map.get(x + 1, y + 1)
                ]), new Float32Array([
                    x, y + 1, map.get(x, y + 1),
                    x, y, map.get(x, y),
                    x + 1, y + 1, map.get(x + 1, y + 1)
                ])
            ];
        }

        const material = new THREE.MeshBasicMaterial({ color: 0x3366cc });

        for (let i = 0; i < 2; i++) {
            geometry[i].setAttribute('position', new THREE.BufferAttribute(vertices[i], 3));
            
            const mesh = new THREE.Mesh(geometry[i], material);
            this.mesh[i].set(x, y, mesh);
            scene.add(mesh);
        }
        console.log('mesh');
    }

    // tile [0 / 1] and [1 \ 0]
    static Upper() {
        return 0;
    }

    static Lower() {
        return 1;
    }

    // line / or \
    static Slash() {
        return 0;
    }

    static BackSlash() {
        return 1;
    }
}