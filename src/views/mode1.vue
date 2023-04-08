<template lang="html">
    <div class="view">
        <div id="page"></div>

        <div class="set" @click="setting()"></div>
        <div class="goback" @click="backTo()"></div>
        <div class="rule" @click="checkRule()"></div>
        <div class="pop-rule" v-show="showRule">
            <div class="bg"></div>
            <div class="title"></div>
            <div class="content">
                <span>
                    玩家1操作方式: <br />
                    wsad上下左右移动，j开火，r复位,k使用技能，r放置陷阱 </span
                ><br />
                <span>
                    玩家2操作方式: <br />
                    上下左右移动，右下ctrl开火，右下shift复位，右下/?复位使用技能，右下.>放置陷阱
                </span>
            </div>
            <div class="closeBtn" @click="closeRule()"></div>
        </div>
        <div class="player1">
            <div class="property">
                <div>玩家1血量:{{ player1Property.HP }}</div>
                <div>玩家1子弹数量:{{ player1Property.BulletNum }}</div>
                <div>玩家1移动速度:{{ player1Property.Speed }}</div>
                <div>玩家1子弹威力:{{ player1Property.bulletPower }}</div>
                <div>玩家1移动速度:{{ player1Property.speed }}</div>
            </div>
            <div class="skill-bg" v-if="player1Property">
                <img :src="skillList[player1Property.skill].imgSrc" alt="" />
                <span>{{ skillList[player1Property.skill].name }}</span>
            </div>
            <div class="trap-bg" v-if="player1Property">
                <img :src="trapList[player1Property.trap].imgSrc" alt="" />
                <span>{{ trapList[player1Property.trap].name }}</span>
            </div>
        </div>
        <div class="player2">
            <div class="property">
                <div>玩家2血量:{{ player2Property.HP }}</div>
                <div>玩家2子弹数量:{{ player2Property.BulletNum }}</div>
                <div>玩家2移动速度:{{ player2Property.Speed }}</div>
                <div>玩家2子弹威力:{{ player2Property.bulletPower }}</div>
                <div>玩家2移动速度:{{ player2Property.speed }}</div>
            </div>
            <div class="skill-bg" v-if="player2Property">
                <img :src="skillList[player2Property.skill].imgSrc" alt="" />
                <span>{{ skillList[player2Property.skill].name }}</span>
            </div>
            <div class="trap-bg" v-if="player2Property">
                <img :src="trapList[player2Property.trap].imgSrc" alt="" />
                <span>{{ trapList[player2Property.trap].name }}</span>
            </div>
        </div>
        <div class="gameOverPop" v-show="isOver">
            <img src="../assets/images/gameOver.png" alt="" />
            <div class="btns">
                <div class="restart" @click="reload()">再来一局</div>
                <div class="restart" @click="backTo()">退出</div>
            </div>
        </div>
        <div class="overPage" v-show="shade"></div>
    </div>
</template>

<script>
import maze from '../components/Maze.js';
import Tank from '../components/Tank.js';
import bullet from '../components/bullet.js';
export default {
    data() {
        return {
            canvas: null,
            containers: null,
            wallsArr: null,
            maskArr: null,
            player1: null,
            player2: null,
            gemArr: [],
            player1Bullet: [],
            player2Bullet: [],
            isOver: false,
            timer: null,
            IntervalTime: 5000,
            MaskMode: false,
            shade: false,
            showRule: false,
            skillList: [
                { name: '暂无技能', imgSrc: require('../assets/images/skills/skill0.png') },
                { name: '缩小10S', imgSrc: require('../assets/images/skills/skill1.png') },
                { name: '穿墙5S', imgSrc: require('../assets/images/skills/skill2.png') },
                { name: '敌方消失', imgSrc: require('../assets/images/skills/skill3.png') },
                { name: '随机传送', imgSrc: require('../assets/images/skills/skill4.png') },
                { name: '互换位置', imgSrc: require('../assets/images/skills/skill5.png') }
            ],
            trapList: [
                { name: '暂无陷阱', imgSrc: require('../assets/images/skills/skill0.png') },
                { name: '肥胖5S', imgSrc: require('../assets/images/skills/trap1.png') },
                { name: 'stop3S', imgSrc: require('../assets/images/skills/trap2.png') },
                { name: '反方向10S', imgSrc: require('../assets/images/skills/trap3.png') }
            ]
        };
    },
    computed: {
        player1Property() {
            if (this.player1) {
                return {
                    HP: this.player1.HP,
                    Speed: this.player1.speed,
                    BulletNum: this.player1.bulletNum - this.player1.bulletArr.length,
                    bulletPower: this.player1.bulletPower,
                    speed: this.player1.speed,
                    skill: this.player1.skill,
                    trap: this.player1.trap
                };
            } else {
                return 0;
            }
        },
        player2Property() {
            if (this.player2) {
                return {
                    HP: this.player2.HP,
                    Speed: this.player2.speed,
                    BulletNum: this.player2.bulletNum - this.player2.bulletArr.length,
                    bulletPower: this.player2.bulletPower,
                    speed: this.player2.speed,
                    skill: this.player2.skill,
                    trap: this.player2.trap
                };
            } else {
                return 0;
            }
        }
    },
    watch: {
        'player1.HP'(Val) {
            if (Val <= 0) {
                this.gameOver(this.player1.tank);
            }
        },
        'player2.HP'(Val) {
            if (Val <= 0) {
                this.gameOver(this.player2.tank);
            }
        },
        'player1.releaseSkills'(Val) {
            if (Val) {
                switch (this.player1.skill) {
                    case 0:
                        return;
                    case 1:
                        this.player1.tank.width = 24;
                        this.player1.tank.height = 24;
                        this.player1.xdeviation = 12;
                        this.player1.ydeviation = 12;
                        setTimeout(() => {
                            this.player1.tank.width = 48;
                            this.player1.tank.height = 48;
                            this.player1.xdeviation = 24;
                            this.player1.ydeviation = 24;
                        }, 10000);
                        break;
                    case 2:
                        this.player1.canAcross = true;
                        this.player1.isHit = false;
                        setTimeout(() => {
                            this.player1.canAcross = false;
                        }, 5000);
                        break;

                    case 3:
                        this.player2.tank.visible = false;
                        setTimeout(() => {
                            this.player2.tank.visible = true;
                        }, 5000);
                        break;

                    case 4:
                        this.player1.tank.x = Math.floor((Math.random() * 800) / 80) * 80 + 40;
                        this.player1.tank.y = Math.floor((Math.random() * 800) / 80) * 80 + 40;
                        break;

                    case 5:
                        let position = { x: 0, y: 0 };
                        position.x = this.player1.tank.x;
                        position.y = this.player1.tank.y;
                        this.player1.tank.x = this.player2.tank.x;
                        this.player1.tank.y = this.player2.tank.y;
                        this.player2.tank.x = position.x;
                        this.player2.tank.y = position.y;
                        break;

                    default:
                        break;
                }
                this.player1.skill = 0;
                this.player1.releaseSkills = false;
            }
        },
        'player2.releaseSkills'(Val) {
            if (Val) {
                switch (this.player2.skill) {
                    case 0:
                        return;
                    case 1:
                        this.player2.tank.width = 24;
                        this.player2.tank.height = 24;
                        this.player2.xdeviation = 12;
                        this.player2.ydeviation = 12;
                        setTimeout(() => {
                            this.player2.tank.width = 48;
                            this.player2.tank.height = 48;
                            this.player2.xdeviation = 24;
                            this.player2.ydeviation = 24;
                        }, 10000);
                        break;
                    case 2:
                        this.player2.canAcross = true;
                        this.player2.isHit = false;
                        setTimeout(() => {
                            this.player2.canAcross = false;
                        }, 5000);
                        break;

                    case 3:
                        this.player1.tank.visible = false;
                        setTimeout(() => {
                            this.player1.tank.visible = true;
                        }, 5000);
                        break;

                    case 4:
                        this.player2.tank.x = Math.floor((Math.random() * 800) / 80) * 80 + 40;
                        this.player2.tank.y = Math.floor((Math.random() * 800) / 80) * 80 + 40;
                        break;
                    case 5:
                        let position = { x: 0, y: 0 };
                        position.x = this.player1.tank.x;
                        position.y = this.player1.tank.y;
                        this.player1.tank.x = this.player2.tank.x;
                        this.player1.tank.y = this.player2.tank.y;
                        this.player2.tank.x = position.x;
                        this.player2.tank.y = position.y;
                        break;
                    default:
                        break;
                }
                this.player2.skill = 0;
                this.player2.releaseSkills = false;
            }
        },
        'player1.releaseTrap'(Val) {
            if (Val) {
                let trap = PIXI.Sprite.from(require(`@/assets/images/trap.png`));
                trap.width = 50;
                trap.height = 50;
                trap.visible = false;
                trap.position.set(this.player1.tank.x - 24, this.player1.tank.y - 24);
                trap.type = this.player1.trap;
                this.player1.trapArr.push(trap);
                this.canvas.stage.addChild(trap);
                console.log(trap.type);
                this.player1.trap = 0;
                this.player1.releaseTrap = false;
            }
        },
        'player2.releaseTrap'(Val) {
            if (Val) {
                let trap = PIXI.Sprite.from(require(`@/assets/images/trap.png`));
                trap.width = 50;
                trap.height = 50;
                trap.visible = false;
                trap.position.set(this.player2.tank.x - 24, this.player2.tank.y - 24);
                trap.type = this.player2.trap;
                this.player2.trapArr.push(trap);
                this.canvas.stage.addChild(trap);
                console.log(trap.type);
                this.player2.trap = 0;
                this.player2.releaseTrap = false;
            }
        }
    },
    methods: {
        //打开设置弹窗
        setting() {
            console.log(123123);
        },
        //打开规则弹窗
        checkRule() {
            this.shade = true;
            this.showRule = true;
        },
        //关闭规则弹窗
        closeRule() {
            this.shade = false;
            this.showRule = false;
        },
        //游戏循环代码
        gameLoop(delta) {
            //坦克移动
            this.move(this.player1.tank);
            this.move(this.player2.tank);
            //遍历子弹数组
            this.BulletForEach(this.player1Bullet, this.player1, this.player2);
            this.BulletForEach(this.player2Bullet, this.player2, this.player1);
            //检测坦克是否与墙壁碰撞
            this.hitWall(this.player1);
            this.hitWall(this.player2);
            //遍历战争迷雾数组
            this.MaskForEach();
            //遍历宝石数组
            this.gemsForEach();
            //遍历陷阱数组
            this.trapForEach(this.player2, this.player1);
            this.trapForEach(this.player1, this.player2);
        },
        move(object) {
            object.x += object.vx;
            object.y += object.vy;
        },
        //遍历子弹数组
        BulletForEach(bulletArr, player, elsePlayer) {
            bulletArr.forEach(item => {
                let deviation = { x: 0, y: 0, width: 0, height: 0 };
                switch (item.direction) {
                    case 'top':
                    case 'down':
                        deviation.y = item.bullet.height / 2;
                        deviation.width = item.bullet.width - 1;
                        break;
                    case 'right':
                    case 'left':
                        (deviation.x = item.bullet.width / 2), (deviation.height = item.bullet.height - 1);
                        break;
                    default:
                        break;
                }
                //遍历迷雾数组
                this.MaskForEach(item.bullet);
                //子弹移动与碰撞
                this.move(item.bullet);
                this.bulletHitWall(item, player, deviation);
                this.getShot(item.bullet, player, elsePlayer, deviation);
            });
        },
        //遍历陷阱数组
        trapForEach(attacker, beAttacker) {
            let speed = 0;
            let timer;
            attacker.trapArr.forEach((item, index, arr) => {
                if (this.hitTestRectangle(beAttacker.tank, item, beAttacker.xdeviation, beAttacker.ydeviation)) {
                    item.visible = true;
                    switch (item.type) {
                        case 1:
                            if (beAttacker.trapped) {
                                break;
                            } else {
                                beAttacker.trapped = true;
                                speed = beAttacker.speed;
                                beAttacker.tank.vx = 1;
                                beAttacker.tank.vy = 1;
                                beAttacker.speed = 1;
                                beAttacker.tank.width = 60;
                                beAttacker.tank.height = 60;
                                beAttacker.xdeviation = 30;
                                beAttacker.ydeviation = 30;
                                setTimeout(() => {
                                    beAttacker.speed = speed;
                                    delete arr[index];
                                    beAttacker.trapped = false;
                                    beAttacker.tank.width = 48;
                                    beAttacker.tank.height = 48;
                                    beAttacker.xdeviation = 24;
                                    beAttacker.ydeviation = 24;
                                    this.canvas.stage.removeChild(item);
                                }, 5000);
                            }
                            break;
                        case 2:
                            if (beAttacker.trapped) {
                                break;
                            } else {
                                beAttacker.trapped = true;
                                speed = beAttacker.speed;
                                beAttacker.tank.vx = 0;
                                beAttacker.tank.vy = 0;
                                beAttacker.speed = 0;
                                setTimeout(() => {
                                    beAttacker.speed = speed;
                                    delete arr[index];
                                    beAttacker.trapped = false;
                                    this.canvas.stage.removeChild(item);
                                }, 3000);
                            }
                            break;
                        case 3:
                            if (beAttacker.trapped) {
                                break;
                            } else {
                                beAttacker.trapped = true;
                                beAttacker.speed = -beAttacker.speed;
                                beAttacker.tank.vx = 0;
                                beAttacker.tank.vy = 0;
                                setTimeout(() => {
                                    beAttacker.speed = -beAttacker.speed;
                                    delete arr[index];
                                    beAttacker.trapped = false;
                                    this.canvas.stage.removeChild(item);
                                }, 10000);
                            }
                            break;
                        default:
                            break;
                    }
                }
            });
        },
        //玩家是否与墙碰撞
        hitWall(player) {
            if (player.canAcross) {
                return;
            }
            //没有碰撞
            this.wallsArr.forEach(item => {
                if (this.hitTestRectangle(player.tank, item, player.xdeviation, player.ydeviation)) {
                    if (player.tank.vx !== 0) {
                        if (player.tank.vx > 0) {
                            player.tank.x -= 5;
                        } else {
                            player.tank.x += 5;
                        }
                    }
                    if (player.tank.vy !== 0) {
                        if (player.tank.vy > 0) {
                            player.tank.y -= 5;
                        } else {
                            player.tank.y += 5;
                        }
                    }
                    return;
                }
            });
        },
        //遍历战争迷雾数组
        MaskForEach() {
            this.maskArr.forEach(item => {
                if (
                    this.hitTestRectangle(
                        this.player1.tank,
                        item.rectangle,
                        this.player1.xdeviation,
                        this.player1.ydeviation
                    ) ||
                    this.hitTestRectangle(
                        this.player2.tank,
                        item.rectangle,
                        this.player2.xdeviation,
                        this.player2.ydeviation
                    )
                ) {
                    item.canVisible = false;
                    item.rectangle.visible = false;
                } else if (this.player1Bullet.length > 0) {
                    if (this.hitTestRectangle(this.player1Bullet[0].bullet, item.rectangle, 24, 24)) {
                        item.rectangle.visible = false;
                    }
                } else if (this.player2Bullet.length > 0) {
                    if (this.hitTestRectangle(this.player2Bullet[0].bullet, item.rectangle, 24, 24)) {
                        item.rectangle.visible = false;
                    }
                } else if (item.canVisible) {
                    item.rectangle.visible = false;
                } else {
                    // if (this.MaskMode) {
                        item.rectangle.visible = true;
                    // }
                }
            });
        },
        //遍历宝石数组
        gemsForEach() {
            this.gemArr.forEach((item, index, arr) => {
                if (this.hitTestRectangle(this.player1.tank, item, 24, 24)) {
                    // item.visible = false;
                    this.canvas.stage.removeChild(item);
                    this.intensify(item.Num, this.player1);
                    delete arr[index];
                    // console.log(111);
                } else if (this.hitTestRectangle(this.player2.tank, item, 24, 24)) {
                    // item.visible = false;
                    this.canvas.stage.removeChild(item);
                    this.intensify(item.Num, this.player2);
                    delete arr[index];
                    // console.log(222);
                }
            });
        },

        intensify(type, player) {
            switch (type) {
                case 1:
                    player.HP += 2;
                    break;
                case 2:
                    player.speed++;
                    break;
                case 3:
                    player.bulletPower++;
                    break;
                default:
                    break;
            }
            if (player.skill === 0) {
                switch (type) {
                    case 4:
                        player.skill = 1;
                        break;
                    case 5:
                        player.skill = 2;
                        break;
                    case 6:
                        player.skill = 3;
                        break;
                    case 7:
                        player.skill = 4;
                        break;
                    case 11:
                        player.skill = 5;
                        break;
                    default:
                        break;
                }
                // console.log(type);
            }
            if (player.trap === 0) {
                switch (type) {
                    case 8:
                        player.trap = 1;
                        break;
                    case 9:
                        player.trap = 2;
                        break;
                    case 10:
                        player.trap = 3;
                        break;
                    default:
                        break;
                }
            }
        },
        //子弹是否与墙碰撞
        bulletHitWall(Bulletitem, player, deviation) {
            this.wallsArr.forEach(item => {
                if (
                    this.hitTestRectangle(
                        Bulletitem.bullet,
                        item,
                        deviation.x,
                        deviation.y,
                        deviation.width,
                        deviation.height
                    )
                ) {
                    this.canvas.stage.removeChild(Bulletitem.bullet);
                    player.bulletArr.shift();
                    return;
                } else {
                    // this.hitDirection = ''
                }
            });
        },
        //坦克是否中弹
        getShot(bullet, attacker, beAttacker, deviation) {
            if (this.hitTestRectangle(beAttacker.tank, bullet)) {
                this.canvas.stage.removeChild(bullet);
                attacker.bulletArr.shift();
                beAttacker.HP -= attacker.bulletPower;
            }
        },
        //碰撞检测代码
        hitTestRectangle(r1, r2, xdeviation = 0, ydeviation = 0, wdeviation = 0, hdeviation = 0) {
            //定义我们需要计算的变量
            let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

            //Hit将决定是否有碰撞
            hit = false;
            r1.centerX = r1.x - xdeviation + (r1.width - wdeviation) / 2;
            r1.centerY = r1.y - ydeviation + (r1.height - hdeviation) / 2;
            r2.centerX = r2.x + r2.width / 2;
            r2.centerY = r2.y + r2.height / 2;

            //计算每个精灵的半宽和半高
            r1.halfWidth = r1.width / 2;
            r1.halfHeight = r1.height / 2;
            r2.halfWidth = r2.width / 2;
            r2.halfHeight = r2.height / 2;

            //计算精灵之间的距离向量
            vx = r1.centerX - r2.centerX;
            vy = r1.centerY - r2.centerY;

            //算出半宽半高的总和
            combinedHalfWidths = r1.halfWidth + r2.halfWidth;
            combinedHalfHeights = r1.halfHeight + r2.halfHeight;

            //检查x轴上是否有碰撞
            if (Math.abs(vx) < combinedHalfWidths) {
                //碰撞可能正在发生。检查y轴上是否有碰撞
                if (Math.abs(vy) < combinedHalfHeights) {
                    hit = true;
                } else {
                    hit = false;
                }
            } else {
                hit = false;
            }
            return hit;
        },
        //重新加载页面
        reload() {
            window.location.reload();
        },
        //回到主页
        backTo() {
            this.$router.push('/home');
        },
        //游戏结束
        gameOver(beDestoryTank) {
            this.isOver = true;
            this.shade = true;
            this.player1.isOver = true;
            this.player2.isOver = true;
            this.maze.destoryMask();
            beDestoryTank.visible = false;
            if (this.timer) {
                clearInterval(this.timer);
            }
            // this.canvas.stage.removeChild();
        }
    },
    mounted() {
        this.maze = new maze();
        this.canvas = this.maze.canvas;
        this.wallsArr = this.maze.wallsArr;
        this.maskArr = this.maze.renderArr;
        this.containers = this.maze.containers;
        this.player1 = new Tank(this.canvas, this.wallsArr, 'tank1', { x: 1, y: 1 }, { x: 760, y: 760 });
        this.player2 = new Tank(this.canvas, this.wallsArr, 'tank2', { x: 1, y: 1 }, { x: 40, y: 40 });
        this.player1Bullet = this.player1.bulletArr;
        this.player2Bullet = this.player2.bulletArr;
        this.maze.render(); //执行渲染
        this.maze.renderMask();

        this.timer = setInterval(() => {
            let item = this.maskArr[Math.floor(Math.random() * 100)];
            item.canVisible = true;
            let gemNum = Math.ceil(Math.random() * 11);
            // let gemNum = 11;
            let gem = PIXI.Sprite.from(require(`@/assets/images/gems/gem${gemNum}.png`));
            gem.width = 50;
            gem.height = 50;
            gem.Num = gemNum;
            gem.position.set(item.x1 + 15, item.y1 + 15);
            this.gemArr.push(gem);
            this.canvas.stage.addChild(gem);
        }, this.IntervalTime);
        this.canvas.ticker.add(delta => this.gameLoop(delta));
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
};
</script>

<style lang="less" scoped>
* {
    padding: 0;
    margin: 0;
}
.view {
    width: 100%;
    height: 100%;
    .bg('bg10.jpg');
    position: relative;

    #page {
        width: 800px;
        height: 800px;
        position: absolute;
        margin: 0 auto;
        left: 0;
        right: 0;
        top: 50px;
        border: solid gray 1px;
    }
    .set {
        .wh(68, 74);
        .bg('setting.png');
        float: right;
        cursor: pointer;
    }
    .goback {
        .wh(75, 74);
        .bg('goback.png');
        float: left;
        cursor: pointer;
    }
    .rule {
        .wh(80, 74);
        .bg('rule.png');
        float: right;
        cursor: pointer;
    }
    .player2 {
        box-sizing: border-box;
        padding: 20px;
        position: absolute;
        left: 0;
        top: 300px;
        .wh(300, 320);
        .bg('bg.png');
        font-size: 20px;
        font-weight: 400;
        color: #aa3600;
        .skill-bg {
            font-size: 15px;
            text-align: center;
            font-weight: 500;
            color: #ffffff;
            .wh(111, 129);
            .bg('skill-bg.png');
            float: left;
            margin-top: 10px;
            // padding-top: 100px;
            img {
                .wh(108, 102);
            }
        }
        .trap-bg {
            font-size: 15px;
            text-align: center;
            font-weight: 500;
            color: #ffffff;
            .wh(111, 129);
            float: right;
            .bg('skill-bg.png');
            margin-top: 10px;
            img {
                .wh(108, 102);
            }
        }
    }
    .player1 {
        box-sizing: border-box;
        padding: 20px;
        position: absolute;
        right: 0;
        top: 300px;
        .wh(300, 320);
        .bg('bg.png');
        font-size: 20px;
        font-weight: 400;
        color: #aa3600;
        .skill-bg {
            font-size: 15px;
            text-align: center;
            font-weight: 500;
            color: #ffffff;
            .wh(111, 129);
            float: left;
            .bg('skill-bg.png');
            margin-top: 10px;
            img {
                .wh(108, 102);
            }
        }
        .trap-bg {
            font-size: 15px;
            text-align: center;
            font-weight: 500;
            color: #ffffff;
            .wh(111, 129);
            float: right;
            .bg('skill-bg.png');
            margin-top: 10px;
            img {
                .wh(108, 102);
            }
        }
    }
    .gameOverPop {
        .wh(263, 100);
        position: relative;
        top: 300px;
        margin: 0 auto;
        z-index: 11;

        .btns {
            display: flex;
            text-align: center;
            line-height: 50px;
            justify-content: space-around;
            cursor: pointer;
            .restart {
                .wh(100, 50);
                border-radius: 20px;
                background-color: rgb(236, 181, 0);
            }
        }
    }

    .pop-rule {
        position: relative;
        z-index: 11;
        .title {
            .wh(200, 100);
            .bg('rule-title.png');
            position: absolute;
            right: 0;
            left: 0;
            top: 100px;
            margin: 0 auto;
        }
        .bg {
            .wh(400, 500);
            .bg('rule-bg.png');
            position: absolute;
            right: 0;
            left: 0;
            top: 130px;
            margin: 0 auto;
        }
        .content {
            .wh(350, 350);
            overflow: auto;
            position: absolute;
            right: 0;
            left: 0;
            top: 150px;
            margin: 0 auto;
            font-size: 20px;
            font-weight: 400;
            color: #aa3600;
        }
        .closeBtn {
            .wh(40, 50);
            .bg('closeBtn.png');
            position: absolute;
            right: 0;
            left: 0;
            top: 600px;
            margin: 0 auto;
            cursor: pointer;
        }
    }
    .overPage {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        position: absolute;
        top: 0;
        z-index: 10;
    }
}
</style>
