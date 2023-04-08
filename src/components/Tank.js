import bullet from './bullet.js'
export default class Tank{
    x = 20
    y = 20   
    thisTank = null
    canvas = null;
    wallsArr = []                                          
    tank = null
    speed = 1
    tankId = ''
    tankImagePosition = null
    tankBornPosition = null
    keys = {}                                                                               
    bulletArr = []
    trapArr = []
    PathArr = {}
    //最大子弹数
    bulletNum = 1
    bulletPower = 1
    skill = 0
    trap = 0
    trapped = false
    releaseSkills = false
    releaseTrap = false
    canAcross = false
    HP = 5
    isOver = false
    timer  = null
    xdeviation = 24
    ydeviation = 24
    constructor(canvas,borderline,tankId,tankImagePosition,tankBornPosition){
        this.tankId = tankId
        this.thisTank = this
        this.wallsArr = borderline
        this.tankImagePosition = tankImagePosition
        this.tankBornPosition = tankBornPosition
        this.canvas = canvas
        this.init(canvas)
    }
    init(canvas){
        this.setup(canvas)
        this.KeyListener()
    }
    setup(canvas){
        let sprite = null
        if (this.tankId === 'tank1') {
          sprite = PIXI.Sprite.from(require(`@/assets/images/greenTank.gif`));
        }else if(this.tankId === 'tank2'){
          sprite = PIXI.Sprite.from(require(`@/assets/images/pinkTank.gif`));
        }
        canvas.stage.addChild(sprite);      
        // sprite.scale.set(1.5, 1.5);
        sprite.position.set(this.tankBornPosition.x, this.tankBornPosition.y)
        sprite.anchor.set(0.5,0.5);    
      
        //锚点不仅仅是精灵旋转的点，也是精灵定位的点
        // sprite.pivot.set(16, 16);
        sprite.vx = 0;
        sprite.vy = 0;
        this.tank = sprite
        // this.canvas.ticker.start() 
        // canvas.ticker.stop()
    }
    KeyListener(e){
      if (this.tankId === 'tank1') {
        this.keys.left = "ArrowLeft"
        this.keys.up = "ArrowUp"
        this.keys.right = "ArrowRight"
        this.keys.down = "ArrowDown"
        this.keys.fire = "Control"
        this.keys.skill = '/'
        this.keys.trap = '.'
        this.keys.recover = 'Shift'
      }else if(this.tankId === 'tank2'){
        this.keys.left = "a"
        this.keys.up = "w"
        this.keys.right = "d"
        this.keys.down = "s"
        this.keys.fire = 'j'
        this.keys.skill = 'k'
        this.keys.trap = 'l'
        this.keys.recover = 'r'
      }
      let left = this.keyboard(this.keys.left)
      let up = this.keyboard(this.keys.up)
      let right = this.keyboard(this.keys.right)
      let down = this.keyboard(this.keys.down);
      let fire = this.keyboard(this.keys.fire)
      let skill = this.keyboard(this.keys.skill)
      let trap = this.keyboard(this.keys.trap)
      let recover = this.keyboard(this.keys.recover)
      up.press = () => {           
            this.tank.direction = 'top'
            this.tank.vy = -this.speed;
            this.tank.vx = 0;
            this.tank.rotation = 0
           
      };
      up.release = () => {
      
          if (!down.isDown && this.tank.vx === 0) {
          this.tank.vy = 0;
          }
      };
      down.press = () => {      
          this.tank.direction = 'down'
          this.tank.vx = 0;
          this.tank.vy = this.speed;
          this.tank.rotation = 1 * Math.PI 
          
      };
      down.release = () => {
        
          if (!up.isDown &&  this.tank.vx === 0) {
              this.tank.vy = 0;
          }
      };
      right.press = () => {
       
          this.tank.direction = 'right'
          this.tank.vx = this.speed;
          this.tank.vy = 0;
          this.tank.rotation = 0.5 * Math.PI 
        
        };
      right.release = () => {
        
          if (!left.isDown && this.tank.vy === 0) {
            this.tank.vx = 0;
          }
        };
      left.press = () => {
        
          this.tank.direction = 'left'
          this.tank.vx = -this.speed;
          this.tank.vy = 0;
          this.tank.rotation = 1.5 * Math.PI   
                
      };
      left.release = () => {
        
          if (!right.isDown && this.tank.vy === 0) {
            this.tank.vx = 0;
          }
      };
      //节流
      fire.press = () => {
          if(this.bulletArr.length < this.bulletNum){        
            let bt = new bullet(this.tank,this.canvas,this.speed)
            this.bulletArr.push(bt)        
          }    
          this.timer = setTimeout(()=>{
            this.timer = null
          },500)
          
      };
      skill.press = () => {
        if (this.skill !== 0) {
          this.releaseSkills = true
        }   
      }
      trap.press = () => {
        if (this.trap !== 0) {
          this.releaseTrap = true
        }   
      }
      recover.press = () => {
        if ((this.tank.x > 0 && this.tank.x < 800) && (this.tank.y > 0 && this.tank.y < 800)) {
          this.tank.x = Math.floor(this.tank.x/80)*80 + 40
          this.tank.y = Math.floor(this.tank.y/80)*80 + 40
        } else {
          this.tank.x = 40
          this.tank.y = 40
        }
       
        
      }
    }
    keyboard(value) {
        let key = {};
        key.value = value;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;
        //The `downHandler`
        key.downHandler = event => {
          // console.log(event);
          if (this.isOver) {
            return
          }
          if (event.key === key.value) {
            if (key.isUp && key.press) key.press();
            // this.canvas.ticker.start()   
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
          }
        };    
        //The `upHandler`
        key.upHandler = event => {
          if (event.key === key.value) {
            if (key.isDown && key.release) key.release();
            // this.canvas.ticker.stop()
            key.isDown = false;
            key.isUp = true;
            // this.PathArr= {x:this.tank.x,y:this.tank.y}
            event.preventDefault();
          }
        };    
        //Attach event listeners
        const downListener = key.downHandler.bind(key);
        const upListener = key.upHandler.bind(key);
        
        window.addEventListener(
          "keydown", downListener, false
        );
        window.addEventListener(
          "keyup", upListener, false
        );
        
        // Detach event listeners
        key.unsubscribe = () => {
          window.removeEventListener("keydown", downListener);
          window.removeEventListener("keyup", upListener);
        };
        
        return key;
    }
}
