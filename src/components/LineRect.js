export default class LineRect{
    x=0;//x坐标
	y=0;//y坐标
    Linethis = this
	Pagethis = null
	canvas = null
    constructor(param){
        this.Lineinit(param)
    }
    Lineinit(param){
        Object.assign(this,param) 
		//上右下左4面墙 true就表示要绘制
		this.walls=[true,true,true,true];   
        this.LineAxis(this.i,this.j);
	}
    //为每一个格子的四个角添加坐标
    LineAxis(i,j){  
		let w = this.Page.dis;
		//i代表行 j代表列
		//左上角坐标
		this.x1=j*w;
		this.y1=i*w;
		//右上角坐标
		this.x2=(j+1)*w;
		this.y2=i*w;
		//右下角坐标
		this.x3=(j+1)*w;
		this.y3=(i+1)*w;
		//左下角坐标
		this.x4=j*w;
		this.y4=(i+1)*w;   
	}
	//渲染格子
    render(context,canvas){   
		this.canvas = canvas 
        // console.log(context,'context');
		this.ctx=context;
		innerRender(this);		
		function innerRender(obj){
            // console.log(obj);
			let ctx=obj.ctx;		
			// if(obj.lineWidth){
			// 	ctx.lineWidth=obj.lineWidth;
			// }			
			//判断上、右、下、左 的墙，true的话墙就会有，否则墙就没有
			let top    = obj.walls[0];
			let right  = obj.walls[1];
			let bottom = obj.walls[2];
			let left   = obj.walls[3];
			obj.wallsArr = []
			if(top){
				ctx.moveTo(obj.x1,obj.y1);	
				ctx.lineTo(obj.x2,obj.y2);	
				obj.wallsArr.push({x:obj.x1,y:obj.y1,width:obj.x2-obj.x1,height:3})
			}
			if(right){
				ctx.moveTo(obj.x2,obj.y2);	
				ctx.lineTo(obj.x3,obj.y3);	
				obj.wallsArr.push({x:obj.x2-3,y:obj.y2,width:3,height:obj.y3-obj.y2})
			}
			if(bottom){
				ctx.moveTo(obj.x3,obj.y3);	
				ctx.lineTo(obj.x4,obj.y4);
				obj.wallsArr.push({x:obj.x4,y:obj.y4-2,width:obj.x3-obj.x4,height:3})
			}
			if(left){
				ctx.moveTo(obj.x4,obj.y4);	
				ctx.lineTo(obj.x1,obj.y1);	
				obj.wallsArr.push({x:obj.x1-1,y:obj.y1,width:3,height:obj.y4-obj.y1})
			}
			canvas.stage.addChild(ctx);//添加到舞台中		
		}
		// console.log(this.wallsArr);
	  	return this;
	}
	//根据i,j计算数组单元在数组中的下标值
	assemKey(i,j){
		if(i<0 || j<0 || i>=this.Pagethis.rows || j>=this.Pagethis.cols){ //超出边界了
			return undefined;
		}		
		return i*this.Pagethis.cols+j;//计算出i,j位置单元在数组中的下标
	}
	getNeighbor(type,lost_visited){
		let key,neighbor;
		if(type=='0'){
			key = this.assemKey(this.i-1,this.j);
		}else if(type=='1'){
			key = this.assemKey(this.i,this.j+1);
		}else if(type=='2'){
			key = this.assemKey(this.i+1,this.j);
		}else if(type=='3'){
			key = this.assemKey(this.i,this.j-1);
		}
		// console.log(key);
		if(key){
			neighbor = this.arr[key];//首先找到这个邻居
			if(neighbor.visited && !lost_visited){//判断是否被访问，如果被访问了返回undefined  lost_visited表示是否忽略访问的情况
				neighbor = undefined;
			}
		}
		return neighbor;
	}
	findNeighbors(maze){
		//邻居分为上下左右
		// console.log(maze);
		this.Pagethis = maze
		this.arr = maze.renderArr;
		let res=[];//返回的数组
		let top    = this.getNeighbor('0');
		let right  = this.getNeighbor('1');
		let bottom = this.getNeighbor('2');
		let left   = this.getNeighbor('3');
		
		if(top){
			res.push(top);
		}
		if(right){
			res.push(right);
		}
		if(bottom){
			res.push(bottom);
		}
		if(left){
			res.push(left);
		}
		// console.log(res,'邻居数组');
		return res;//返回邻居数组
	}
}