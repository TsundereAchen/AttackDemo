// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

type GameType = {
    id: number;
    camp: number;
    spine: string;
    x: number;
    y: number;
    speed: number;
    atk: number;
    def: number;
    long: boolean;
    status: number;
    boold: number
}

enum HeroStaus {
    HERO_STATE_WAIT = 1,
    HERO_STATE_MOVE = 2,
    HERO_STATE_BACK = 3,
    HERO_STATE_ATK = 4,
    HERO_STATE_DEF = 5,
    HERO_STATE_DIE = 6
}

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    HeroList: GameType[] = [
        { id: 0, camp: 0, boold: 100, "spine": "zhongqibing", "x": -145, "y": -160, "speed": 6, "atk": 50, "def": 30, "long": false, status: HeroStaus.HERO_STATE_WAIT },
        { id: 1, camp: 0, boold: 100, "spine": "huwei", "x": -350, "y": -165, "speed": 8, "atk": 55, "def": 25, "long": false, status: HeroStaus.HERO_STATE_WAIT },
        { id: 2, camp: 0, boold: 100, "spine": "qingqibing", "x": -220, "y": -220, "speed": 10, "atk": 60, "def": 20, "long": false, status: HeroStaus.HERO_STATE_WAIT },
        { id: 3, camp: 0, boold: 100, "spine": "nuqiangbing", "x": -410, "y": -245, "speed": 7, "atk": 50, "def": 30, "long": true, status: HeroStaus.HERO_STATE_WAIT },
        { id: 4, camp: 0, boold: 100, "spine": "skeleton", "x": -265, "y": -285, "speed": 12, "atk": 40, "def": 30, "long": false, status: HeroStaus.HERO_STATE_WAIT },
        { id: 5, camp: 1, boold: 100, "spine": "nongming", "x": 145, "y": -160, "speed": 11, "atk": 50, "def": 30, "long": false, status: HeroStaus.HERO_STATE_WAIT },
        { id: 6, camp: 1, boold: 100, "spine": "bingxuenv", "x": 350, "y": -165, "speed": 9, "atk": 55, "def": 25, "long": true, status: HeroStaus.HERO_STATE_WAIT },
        { id: 7, camp: 1, boold: 100, "spine": "tuyuansu", "x": 220, "y": -220, "speed": 5, "atk": 65, "def": 30, "long": false, status: HeroStaus.HERO_STATE_WAIT },
        { id: 8, camp: 1, boold: 100, "spine": "huoqiangshou", "x": 410, "y": -245, "speed": 6, "atk": 40, "def": 20, "long": true, status: HeroStaus.HERO_STATE_WAIT },
        { id: 9, camp: 1, boold: 100, "spine": "zhongbubing", "x": 265, "y": -285, "speed": 7, "atk": 45, "def": 30, "long": false, status: HeroStaus.HERO_STATE_WAIT }
    ]


    @property({ type: cc.Prefab })
    prefabSold: cc.Prefab = null;


    @property({ type: cc.Node })
    borad: cc.Node = null

    /** 保存士兵预设 */
    _soldierAnim = []

    // 当前士兵状态
    _orderArray: GameType[] = []

    // 当前攻击士兵位置
    _orderIndex = 0

    // 当前加载动画位置
    _loadIndex = 0;

    // 当前被攻击士兵位置
    _targetIndex = 0

    start(): void {
        this.initSoldlier()
        //开始游戏
        this.startGame()
    }

    /** 初始化战斗数据 */
    initSoldlier(): void {
        this._orderArray = [];
        this._soldierAnim = []
        this._orderIndex = 0;
        this._targetIndex = 0

        for (let i = 0; i < 10; ++i) {
            this._orderArray[i] = this.HeroList[i]
            this._soldierAnim[i] = cc.instantiate(this.prefabSold)
            const posX = this._orderArray[i].x
            const posY = this._orderArray[i].y
            if (i >= 5) {
                this._soldierAnim[i].scaleX = -1;
            }
            this._soldierAnim[i].setPosition(cc.v2(posX, posY))
            this.borad.addChild(this._soldierAnim[i])
        }
        this._orderArray.sort((a, b) => {
            return b.speed - a.speed;
        })
        this.loadAnim()

    }

    loadAnim(): void {
        let data;
        if (this._loadIndex >= 10) {
            return;
        }
        data = this.HeroList[this._loadIndex]
        let callback = function (err, res) {
            const skeleton =
                this._soldierAnim[this._loadIndex].getComponent(sp.Skeleton);
            skeleton.skeleton = res;
            skeleton.animation = "Idle";
            this._loadIndex += 1;
            this.loadAnim();
        }.bind(this)
        const url = `spine/${data.spine}/${data.spine}`;
        cc.loader.loadRes(url, sp.SkeletonData, callback);
    }

    startGame(): void {
        if (this._orderIndex > 9) this._orderIndex = 0;
        const obj = this._orderArray[this._orderIndex]
        if (obj.status == HeroStaus.HERO_STATE_WAIT) {
            this.setAnimation(obj, HeroStaus.HERO_STATE_MOVE);
        } else {
            this._orderIndex += 1;
            this.startGame();
        }
    }

    setAnimation(obj: GameType, status: HeroStaus): void {
        obj.status = status;
        const animHandle = this._soldierAnim[obj.id]
        if (status == HeroStaus.HERO_STATE_MOVE) {
            let target = null
            const isLong = this.HeroList[obj.id].long;
            let targetPos = cc.v2(0, 0);
            for (let i = 0; i < this._orderArray.length; ++i) {
                const targetObj = this._orderArray[i]
                if (targetObj.camp != obj.camp && targetObj.status == HeroStaus.HERO_STATE_WAIT) {
                    this._targetIndex = i
                    target = this._orderArray[i]
                    break;
                }
            }
            // 一方全部死亡
            if (target == null) {
                return;
            }
            if (isLong) {
                this.setAnimation(obj, HeroStaus.HERO_STATE_ATK);
                return;
            }
            const x = this.HeroList[target.id].x + 40;
            const y = this.HeroList[target.id].y;
            const callback = cc.callFunc(function () {
                // 进入到攻击状态
                this.setAnimation(obj, HeroStaus.HERO_STATE_ATK)
            }, this);
            targetPos.set(new cc.Vec2(x, y));
            animHandle.runAction(cc.sequence(cc.moveTo(0.5, targetPos.x, targetPos.y), callback))

        }
        else if (status == HeroStaus.HERO_STATE_DIE) {
            animHandle.getComponent(sp.Skeleton).setAnimation(0, "Die", false)
            animHandle.getComponent(sp.Skeleton).setCompleteListener(trackEntry => {
                animHandle.getComponent(sp.Skeleton).setCompleteListener(trackEntry => {
                })
                animHandle.active = false
            })
        } else if (status == HeroStaus.HERO_STATE_WAIT) {
            // 回到原始状态
            animHandle.getComponent(sp.Skeleton).animation = "Idle"
            this._orderIndex = this._orderIndex + 1
            this.startGame()
        } else if (status == HeroStaus.HERO_STATE_ATK) {
            animHandle.getComponent(sp.Skeleton).setAnimation(0, "Attack", false)
            animHandle.getComponent(sp.Skeleton).setCompleteListener(trackEntry => {
                // 计算减小的血量
                const tagetDef = this.HeroList[this._orderArray[this._targetIndex].id].def
                // 计算防护值
                const objAtk = this.HeroList[obj.id].atk;
                this._orderArray[this._targetIndex].boold += tagetDef - objAtk
                const tagetHandle = this._soldierAnim[this._orderArray[this._targetIndex].id]
                if (this._orderArray[this._targetIndex].boold > 0) {
                    cc.log("blood" + this._orderArray[this._targetIndex].id)
                    //掉血
                    tagetHandle.getComponent("SoldierItem").setBlood(this._orderArray[this._targetIndex].boold / 100)
                } else {
                    //角色死亡
                    cc.log("die")
                    this.setAnimation(this._orderArray[this._targetIndex], HeroStaus.HERO_STATE_DIE)
                }
                //退回到原来位置
                animHandle.getComponent(sp.Skeleton).setCompleteListener(trackEntry => {
                })
                animHandle.getComponent(sp.Skeleton).animation = "Run"
                const targetPos = cc.v2(0, 0)
                const callback = cc.callFunc(function () {
                    this.setAnimation(obj, HeroStaus.HERO_STATE_WAIT)
                }, this)
                targetPos.x = this.HeroList[obj.id].x
                targetPos.y = this.HeroList[obj.id].y
                animHandle.runAction(cc.sequence(cc.moveTo(0.5, targetPos.x, targetPos.y), callback))
            })
        }
    }

    // update (dt) {}
}
