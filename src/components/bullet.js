export default class bullet {
    tank = null
    canvas = null
    bullet = null
    direction = 'top'
    speed = 3
    constructor(tank, canvas, speed) {
        this.tank = tank
        this.canvas = canvas
        this.speed = speed
        if (this.tank.direction) {
            this.direction = this.tank.direction
        }
        this.init()
    }
    init() {
        this.bullet = PIXI.Sprite.from(require(`@/assets/images/bullet.png`));
        this.bullet.anchor.set(0.5, 0.5);
        if (this.direction === 'top') {
            this.bullet.position.set(this.tank.x, this.tank.y - 40)
            this.bullet.vy = -this.speed;
            this.bullet.vx = 0;
        } else if (this.direction === 'down') {
            this.bullet.rotation = 1 * Math.PI
            this.bullet.vy = this.speed;
            this.bullet.vx = 0;
            this.bullet.position.set(this.tank.x, this.tank.y + 40)
        } else if (this.direction === 'right') {
            this.bullet.rotation = 0.5 * Math.PI
            this.bullet.vy = 0;
            this.bullet.vx = this.speed;
            this.bullet.position.set(this.tank.x + 40, this.tank.y)
        } else if (this.direction === 'left') {
            this.bullet.vy = 0;
            this.bullet.vx = -this.speed;
            this.bullet.rotation = 1.5 * Math.PI
            this.bullet.position.set(this.tank.x - 40, this.tank.y)
        }
        this.canvas.stage.addChild(this.bullet);
    }
}