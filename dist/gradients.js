class Gradients {
    constructor(map) {
        this.map = map;
        this.w = this.map.w;
        this.h = this.map.h;
        this.x = new Grid(this.w - 1, this.h, new THREE.Vector2(0, 0));
        this.y = new Grid(this.w, this.h - 1, new THREE.Vector2(0, 0));
        this.evalAll();
    }

    evalAll() {
        for(let mx = 0; mx < this.w - 1; mx++){
            for(let my = 0; my < this.h; my++){
                this.x.set(mx, my, this.map.get(mx + 1, my) - this.map.get(mx, my));
            }
        }
        
        for(let mx = 0; mx < this.w; mx++){
            for(let my = 0; my < this.h - 1; my++){
                this.y.set(mx, my, this.map.get(mx, my + 1) - this.map.get(mx, my));
            }
        }
    }   
}
