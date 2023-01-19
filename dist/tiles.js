//上三角と下三角の組み合わせのマップパターン
class Tiles {
    static Material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        transparent: false
    });

    constructor(w, h) {
        this.w = w;
        this.h = h;

        this.shape = new Grid(w, h, 0);
        this.geometries = [];
        this.geometry = null;
        this.mesh = null;

        this.colors = {
            test: ExApp.ColorAttribute(0x336699, 3, 3),
        };
    }

    eval(map, x, z, slashWay) {
        this.shape.set(x, z, slashWay);
        let geometries = [
            new THREE.BufferGeometry(),
            new THREE.BufferGeometry()
        ];

        if (slashWay == Tiles.Slash()) {
            var vertices = [
                new Float32Array([
                    x, map.get(x, z), z,
                    x, map.get(x, z + 1), z + 1,
                    x + 1, map.get(x + 1, z), z,
                ]),
                new Float32Array([
                    x + 1, map.get(x + 1, z + 1), z + 1,
                    x + 1, map.get(x + 1, z), z,
                    x, map.get(x, z + 1), z + 1,
                ])
            ];
        } else {
            var vertices = [
                new Float32Array([
                    x + 1, map.get(x + 1, z + 1), z + 1,
                    x + 1, map.get(x + 1, z), z,
                    x, map.get(x, z), z,
                ]), new Float32Array([
                    x + 1, map.get(x + 1, z + 1), z + 1,
                    x, map.get(x, z), z,
                    x, map.get(x, z + 1), z + 1,
                ])
            ];
        }

        for (let i = 0; i < 2; i++) {
            geometries[i].setAttribute('position', new THREE.BufferAttribute(vertices[i], 3));
            geometries[i].setAttribute('color', this.colors.test);
            geometries[i].computeVertexNormals();
            this.geometries.push(geometries[i]);
        }
    }

    setMesh(scene) {
        this.geometry = new THREE.BufferGeometryUtils.mergeBufferGeometries(this.geometries);
        this.mesh = new THREE.Mesh(this.geometry, Tiles.Material);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        scene.add(this.mesh);
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