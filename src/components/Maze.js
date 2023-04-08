import LineRect from './LineRect.js'
import Tank from './Tank.js'
export default class Maze {
        renderArr=[];//存放所有格子的数组
        stack = [];
        dis=80;//格子的长宽
        pathArr=[]; 
        canvas = null;
        borderline = null
        wallsArr = [];
        containers = null
        constructor(){
            this.init()
        }
        init(){        
            let canvas = new PIXI.Application({width: 800, height: 800});
            document.getElementById('page').appendChild(canvas.view);
            // canvas.renderer.backgroundColor = 0xFFFFFF;
            document.getElementById('page').style.visibility =false
            // let canvas = document.createElement('canvas');//创建画布
            this.w = canvas.width = 800; //设置canvas宽度
            this.h = canvas.height = 800;//设置canvas高度   
            canvas.stage.interactive = true;
            canvas.stage.sortableChildren = true
            // let page = document.getElementById('page');		
            // page.appendChild(canvas);//添加到指定的dom对象中
            // this.ctx = canvas.getContext('2d');
            this.canvas = canvas;         

             let containers = new PIXI.Container();
            const background = PIXI.Sprite.from(require(`@/assets/images/bg1.jpg`));
            background.width = 800;
            background.height = 800;
            this.background = background;
            containers.addChild(background);
            this.containers = containers;
            this.canvas.stage.addChild(containers);

            //根据行数、列数来创建格子
            this.rows = Math.floor(this.h/this.dis);
            this.cols = Math.floor(this.w/this.dis);		
            for(let i=0;i<this.rows;i++){
                for(let j=0;j<this.cols;j++){
                    let cell = this.buildCell(i,j);
                    this.renderArr.push(cell);
                }
            }  
            this.computed();//根据算法计算		
            // this.render();//执行渲染
            // let textured = PIXI.Texture.fromImage(require(`@/assets/images//tankAll.gif`));
            // let rectangle = new PIXI.Rectangle(64, 64, 32, 32);
            // textured.frame = rectangle;
            // let sprite = new PIXI.Sprite(textured);
            // this.canvas.stage.addChild(sprite);      
            // sprite.scale.set(1.5, 1.5);
            // sprite.position.set(34, 34)
            // sprite.anchor.set(0.5,0.5);    
            // PIXI.loader.reset();
        }
        computed(){
            /*
                1.将起点作为当前迷宫单元并标记为已访问
                2.当还存在未标记的迷宫单元，进行循环
                    1).如果当前迷宫单元有未被访问过的的相邻的迷宫单元
                        (1).随机选择一个未访问的相邻迷宫单元
                        (2).将当前迷宫单元入栈
                        (3).移除当前迷宫单元与相邻迷宫单元的墙
                        (4).标记相邻迷宫单元并用它作为当前迷宫单元
                    2).如果当前迷宫单元不存在未访问的相邻迷宫单元，并且栈不空
                        (1).栈顶的迷宫单元出栈
                        (2).令其成为当前迷宫单元
            */			
            let stack =	this.stack ; //栈
            let arr = this.renderArr;
            let current = arr[0];//取第一个为当前单元
            this.pathArr.push(current);
            // console.log(current);
            current.visited=true;//标记为已访问
            let unVisitedCount=arr.length-1;//因为第一个已经设置为访问了
            let neighbors ;
            while(unVisitedCount>0){
                neighbors = current.findNeighbors(this);//查找(未被访问的)邻居集合
                // console.log(neighbors);
                if(neighbors.length>0){//如果当前迷宫单元有未被访问过的的相邻的迷宫单元
                    //随机选择一个未访问的相邻迷宫单元
                    let index = parseInt(Math.random()*neighbors.length);
                    // console.log(index); 
                    // console.log(neighbors);
                    let next = neighbors[index];
                    //将当前迷宫单元入栈
                    stack.push(current);
                    //移除当前迷宫单元与相邻迷宫单元的墙
                    this.removeWall(current,next);
                    //标记相邻迷宫单元并用它作为当前迷宫单元
                    next.visited=true;
                    //标记一个为访问，则计数器递减1
                    unVisitedCount--;//递减
                    current = next;
                }else if(stack.length>0){
                    //如果当前迷宫单元不存在未访问的相邻迷宫单元，并且栈不空
                    /*
                        1.栈顶的迷宫单元出栈
                        2.令其成为当前迷宫单元
                    */
                    let cell = stack.pop();
                    current = cell;
                }
                //推入路线数组
                this.pathArr.push(current);			
            }
            //算法走过的全部路径
            // let path = []
            // for (let index = 0; index < this.pathArr.length; index++) {
            // 	path.push({i:this.pathArr[index].i,j:this.pathArr[index].j})			
            // }
            // console.log(path);
        }
        //移除两个格子之间的墙
        removeWall(current,next){
            if(current.i==next.i){//横向邻居
                if(current.j>next.j){//匹配到的是左边邻居
                    //左边邻居的话，要移除自己的左墙和邻居的右墙
                    current.walls[3]=false;
                    next.walls[1]=false;
                }else{//匹配到的是右边邻居
                    //右边邻居的话，要移除自己的右墙和邻居的左墙
                    current.walls[1]=false;
                    next.walls[3]=false;
                }
            }else if(current.j==next.j){//纵向邻居
                if(current.i>next.i){//匹配到的是上边邻居
                    //上边邻居的话，要移除自己的上墙和邻居的下墙
                    current.walls[0]=false;
                    next.walls[2]=false;
                }else{//匹配到的是下边邻居
                    //下边邻居的话，要移除自己的下墙和邻居的上墙
                    current.walls[2]=false;
                    next.walls[0]=false;
                }
            }
        }
        //创建格子对象
        buildCell(i,j){
            let param={i:i,j:j,lineWidth:1,Page:this};				
            let cellItem = new LineRect(param) 		
            // console.log(cellItem);
            return cellItem;
        }
        //渲染图形
        render(){		
            const borderline = new PIXI.Graphics();
            borderline.lineStyle(8,0xaaaaaa,1)//边线(宽度，颜色，透明度)
            this.borderline = borderline
            // console.log(this.renderArr);
            // console.log(this.canvas);
            // let context=this.ctx;
            //for循环渲染每一个格子
            for(let i=0;i <this.renderArr.length; i++){
                let a = this.renderArr[i].render(borderline,this.canvas);			
                this.wallsArr.push(...a.wallsArr)
            }
        }
        //渲染战争迷雾
        renderMask(){
            this.renderArr.forEach((item) => {          
                item.rectangle = PIXI.Sprite.from(require(`@/assets/images/black2.jpg`));
                item.rectangle.width = 80
                item.rectangle.height = 80
                item.rectangle.position.set(item.x1, item.y1)
                this.canvas.stage.addChild(item.rectangle);    
            })
        }  
        //销毁战争迷雾
        destoryMask(){
            this.renderArr.forEach((item) => {          
                this.canvas.stage.removeChild(item.rectangle);    
            })
        }  
  }
