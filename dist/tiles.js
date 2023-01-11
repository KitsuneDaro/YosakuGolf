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
        let geometries = [
            new THREE.BufferGeometry(),
            new THREE.BufferGeometry()
        ];

        if (slashWay == Tiles.Slash()) {
            var vertices = [
                new Float32Array([
                    x, map.get(x, y), y,
                    x, map.get(x, y + 1), y + 1,
                    x + 1, map.get(x + 1, y), y,
                ]),
                new Float32Array([
                    x + 1, map.get(x + 1, y + 1), y + 1,
                    x + 1, map.get(x + 1, y), y,
                    x, map.get(x, y + 1), y + 1,
                ])
            ];
        } else {
            var vertices = [
                new Float32Array([
                    x + 1, map.get(x + 1, y + 1), y + 1,
                    x + 1, map.get(x + 1, y), y,
                    x, map.get(x, y), y,
                ]), new Float32Array([
                    x + 1, map.get(x + 1, y + 1), y + 1,
                    x, map.get(x, y), y,
                    x, map.get(x, y + 1), y + 1,
                ])
            ];
        }

        let material = new THREE.MeshStandardMaterial({ color: 0x3366CC });

        for (let i = 0; i < 2; i++) {
            geometries[i].setAttribute('position', new THREE.BufferAttribute(vertices[i], 3));
            geometries[i].computeVertexNormals();

            let mesh = new THREE.Mesh(geometries[i], material);

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            scene.add(mesh);

            this.mesh[i].set(x, y, mesh);
        }
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