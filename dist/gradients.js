class Gradients {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.x = new Grid(this.w - 1, this.h, new THREE.Vector2(0, 0));
        this.y = new Grid(this.w, this.h - 1, new THREE.Vector2(0, 0));
    }

    evalAll(map) {
        for(let mx = 0; mx < this.w - 1; mx++){
            for(let my = 0; my < this.h; my++){
                this.x.set(mx, my, map.get(mx + 1, my) - map.get(mx, my));
            }
        }
        
        for(let mx = 0; mx < this.w; mx++){
            for(let my = 0; my < this.h - 1; my++){
                this.y.set(mx, my, map.get(mx, my + 1) - map.get(mx, my));
            }
        }
    }   
}
