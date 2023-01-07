window.addEventListener('load', () => {
    new Main();
})

class Main{
    constructor(){
        this.app = new ExApp($('#app'), this.imgNames, {
            width: 324,
            height: 256,
            backgroundColor: 0x202020
        });
    }
}

//表示などはこれで
class Game{
    constructor(app, stageNum){
        this.app = app;
        this.stage = new Stage(stageNum);
    }
}

//以下内部処理
class Stage{
    constructor(stageNum){
        this.w = 10;
        this.h = 10;

        this.num = stageNum;
        this.map = new Grid(this.w, this.h, 0);
        this.tile = new Tile(this.w - 1, this.h - 1);
    }
}


//上三角と下三角の組み合わせのマップパターン
class Tile{
    constructor(w, h){
        this.shape = new Grid(w, h, 0);
        this.gradient = [
            new Grid(w, h, 0),
            new Grid(w, h, 0)
        ];
    }

    // tile [0 / 1] or [1 \ 0]
    static Upper(){
        return 0;
    }

    static lower(){
        return 1;
    }
}