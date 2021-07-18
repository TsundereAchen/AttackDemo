// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    nBlood:cc.Node = null

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    setBlood(value:number):void {
        this.nBlood.getComponent(cc.ProgressBar).progress = value;
    }

    // update (dt) {}
}
