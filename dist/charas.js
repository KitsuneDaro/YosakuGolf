class Yosaku extends ExSprite{
    constructor(app, stage, x, y){
        super(app);
        this.stage = stage;
        this.x = x;
        this.y = y;
        this.z = this.stage.getZ(this.x, this.y);
    }

    tick(deltaTime) {
        if(Key.ofArrow(this.app.keyCode)){
            console.log(this.z, this.app.keyCode);
        }
    }
}