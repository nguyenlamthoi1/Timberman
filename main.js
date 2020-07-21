

var gameResource= [
	"assets/Timberman1.png",
	"assets/Timberman2.png",
	"assets/Timberman3.png",
	"assets/base.png",
	"assets/treeFragment0.png",
	"assets/treeFragment1.png",
	"assets/bg1.png",
	"assets/title.png",
	"assets/button1.png",
	"assets/button2.png",
	"assets/backButton1.png",
	"assets/backButton2.png",
	"assets/rip1.png",
	"assets/rip2.png",
	"assets/rip3.png",
	"assets/rip4.png",
	"assets/gameover.png",
	"assets/fontPixel.ttf",
	"assets/slideTrack.png",
	"assets/progressBar.png",
	"assets/forestSound.mp3",
	"assets/chopDown.mp3",
	"assets/gameOver.mp3"

];

var gameScene =cc.Scene.extend({
  onEnter:function(){
    this._super();
    var gameLayer= new game();
    cc.audioEngine.playMusic("assets/forestSound.mp3",true);
    gameLayer.init();

    this. addChild(gameLayer);
	}
});
//Class Treefragment
TreeFragment=cc.Sprite.extend({
	ctor: function(i){
		this._super();
		if (i==0)
			this.initWithFile("assets/base.png");
		else if (i==1)
			this.initWithFile("assets/treeFragment0.png");
		else
			this.initWithFile("assets/treeFragment1.png");
	}

});
// Class timberman
TimberMan=cc.Sprite.extend({
	ctor: function(i){
		this._super();	
		this.initWithFile("assets/Timberman1.png");
	},
	onEnter: function(){
		this._super();
		this.setAnchorPoint(new cc.Point(0.5,0));
		this.setPosition(size.width/2-36,0);
		
		//khoi tao animation
		
		// var idleAnimation= cc.Animation.create(spriteFrames1,0.06);
		// var chopAnimation= cc.Animation.create(spriteFrames2,0.06);
		;
		var idleAnimation = new cc.Animation();
		idleAnimation.addSpriteFrameWithFile("assets/Timberman1.png");
		idleAnimation.addSpriteFrameWithFile("assets/Timberman2.png");
		idleAnimation.setDelayPerUnit(0.4);
		idleAnimation.setRestoreOriginalFrame(true);


		var chopAnimation = new cc.Animation();
		chopAnimation.addSpriteFrameWithFile("assets/Timberman1.png");
		chopAnimation.addSpriteFrameWithFile("assets/Timberman3.png");
		chopAnimation.setDelayPerUnit(0.1);
		chopAnimation.setRestoreOriginalFrame(true);


		var dieAnimation = new cc.Animation();
		dieAnimation.addSpriteFrameWithFile("assets/rip1.png");
		dieAnimation.addSpriteFrameWithFile("assets/rip2.png");
		dieAnimation.addSpriteFrameWithFile("assets/rip3.png");
		dieAnimation.addSpriteFrameWithFile("assets/rip4.png");

		dieAnimation.setDelayPerUnit(0.1);
		

		dieAction=	cc.animate(dieAnimation);
		idleAction= cc.animate(idleAnimation);
		chopAction= cc.animate(chopAnimation);

		
		this.runAction(idleAction.repeatForever());
	},
	act: function(actionToStop,actionToRun){
		this.stopAction(actionToStop);
		this.runAction(actionToRun);
	}

});
var audioMaster=null;
var plus=0
var reduceMax=0.2;
var reduce=0.08;
var level=0;
var yourHp=50;
var hpBar=null;
var labelScore=null;
var releaseButton=true;
var yourScore=0;
var overLayer;
var welcomlayer=null;
var gamePaused=true;
var timbermanPos=-1;
var chopAction;
var idleAction;
var keyPressed=0;
var bglayer;
var timberman;
var base;
var size;
var posY=0;
var leftOrRight=0;
var preLeftOrRight=0;
var game=cc.Layer.extend({
	treeFragmentArray: [],
	init: function(){
		this._super();
		this.treeFragmentArray=[];
		size = cc.director.getWinSize();
		
		//this.initWelcomeScene();

		//tao background mau trang
		var w=310;
		var h=480;
		bglayer=cc.LayerColor.create(new cc.Color(255,255,255,255),w,h);
	
		bglayer.setPositionY(5);
		bglayer.setPositionX(5);

		bg=cc.Sprite.create("assets/bg1.png");
		bg.setAnchorPoint(new cc.Point(0.5,0));
		bg.setPosition(size.width/2,-50);
		bg.setScaleX(0.3);
		bg.setScaleY(0.5);

		this.addChild(bglayer,0);
		bglayer.addChild(bg,0);


		// ================Khoi tao================
		//Them Timberman vao vi tri mac dinh
		timberman=new TimberMan();
		bglayer.addChild(timberman,2);

		
		//Tao Goc cay
		base = cc.Sprite.create("assets/base.png")
		base.setAnchorPoint(new cc.Point(0.5,0));
		base.setPosition(size.width/2,0);
		bglayer.addChild(base,1);

		//Tao Cac khuc cay
		this.createTreeFragments(1,false);
		this.createTreeFragments(14,true);
		//Title
		this.initWelcomeScene();
		//=============================================
		//Them event de dieu khien input
		cc.eventManager.addListener({
 			event: cc.EventListener.KEYBOARD,
 			onKeyPressed: function(keycode,event){
 				
 				if(keycode==37 && !gamePaused){
 					timberman.setPosition(size.width/2-36,0);
 					keyPressed=-1;
 					timberman.setFlippedX(false);			
					timberman.runAction(chopAction);
					
 				}

 				else if(keycode==39 && !gamePaused){
 					timberman.setPosition(size.width/2+36,0);
 					keyPressed=1;
 					timberman.setFlippedX(true);
					timberman.runAction(chopAction);
 				}
 				releaseButton=false;
 			},
 			onKeyReleased:function(keycode,event){
 				releaseButton=true;
 			}
 			
 		},this);
 		this.scheduleUpdate();

	},
	update: function(dt){
		
		console.log("reduce= "+reduce);
		plus=0;
		if (!gamePaused ){
		if (yourScore > level){
			level+=20;
			if (reduce <= reduceMax) reduce+=0.02;

		}
		if (keyPressed!=0){
			this.createTreeFragments(1,true);

			
			var treeFragmentRemove=this.treeFragmentArray.shift();

			if (keyPressed==treeFragmentRemove[1])// truong hop die 1
				{keyPressed=0;this.doGameOver(); return;}

			if (keyPressed==-1)
				var removeAction=new cc.JumpTo(0.5,cc.p(size.width,0),36,1);
			else if(keyPressed==1)
				var removeAction=new cc.JumpTo(0.5,cc.p(0,0),36,1);

			treeFragmentRemove[0].runAction(removeAction);
			setTimeout(function(){
			bglayer.removeChild(treeFragmentRemove[0]);
			},500);
			this.treeFragmentArray.forEach(iterate);
			posY-=43;

			if (keyPressed==this.treeFragmentArray[0][1]) //truong hop die 2
				{keyPressed=0; this.doGameOver(); return;}
			plus=2;
			yourScore+=1;
			labelScore.setString(yourScore);
			cc.audioEngine.playEffect("assets/chopDown.mp3",false);
		}
		
		keyPressed=0;
		if (hpBar!=null) {
			yourHp=yourHp-reduce+plus;
			hpBar.setPercent(yourHp);
			if (yourHp<=0) this.doGameOver(); 
		}
		function iterate(obj) 
		{	
			var actionMoveTo= cc.MoveTo.create(0.1,cc.p(size.width/2,obj[0].getPositionY()-43));
  			obj[0].runAction(actionMoveTo);
		}
		}
		
	},
	createTreeFragments: function(n,rand){
		if (rand!=true){
					console.log(posY+" - "+ leftOrRight);

					treeFragment= new TreeFragment(1); // khuc cay khong nhanh'
					
					treeFragment.setAnchorPoint(new cc.Point(0.5,0));
					treeFragment.setPosition(size.width/2,posY);
					posY+=43;
					bglayer.addChild(treeFragment,1);
					leftOrRight=0;
					this.treeFragmentArray.push([treeFragment,leftOrRight]);

		}
		else{
			for (var i=1;i<=n;i++){

				var treeFragment;
				if (Math.random()<0.5){
					treeFragment= new TreeFragment(1); // khuc cay khong nhanh'
					bglayer.addChild(treeFragment,1);
					leftOrRight=0;
				}
				else{
					if (Math.random()<0.5) //chon khuc cay co nhanh' trai' hoac nhanh phai
	                    leftOrRight=-1;//trai
	                else leftOrRight=1;//phai
					
					if (Math.abs(leftOrRight-preLeftOrRight)==2){
						console.log(posY+" - "+ 0);
				
						treeFragment=new TreeFragment(1);//tao khuc cay o giua 2 khuc cay co nhanh' moc nguoc nhau
						treeFragment.setAnchorPoint(new cc.Point(0.5,0));
						treeFragment.setPosition(size.width/2,posY);
						posY+=43;
						bglayer.addChild(treeFragment,1);
						this.treeFragmentArray.push([treeFragment,0]);
					}
					treeFragment= new TreeFragment(2); //khuc cay co nhanh 
					bglayer.addChild(treeFragment,1);
				} 
				console.log(posY+" - "+ leftOrRight);

				treeFragment.setAnchorPoint(new cc.Point(0.5,0));
				treeFragment.setPosition(size.width/2,posY);
				posY+=43;
				if (leftOrRight!=0)
					if (leftOrRight==-1) 
						treeFragment.setFlippedX(true);

				preLeftOrRight=leftOrRight;
				this.treeFragmentArray.push([treeFragment,leftOrRight]);
				}
		}

	},
	doGameOver: function(){
		console.log("game over!");
		timberman.stopAllActions();
		timberman.runAction(dieAction);
		gamePaused=true;
		welcomlayer.removeChild(labelScore);
		welcomlayer.removeChild(hpBar);
		cc.audioEngine.stopMusic();
		cc.audioEngine.playEffect("assets/gameOver.mp3");
		this.initOverScene();
		
	},
	initOverScene: function(){
		overLayer= new OverLayer();
		overLayer.init();
		overLayer.setPosition(size.width/2,size.height/2);
		this.addChild(overLayer,0);
	},
	initWelcomeScene: function(){
		welcomlayer= new WelcomeLayer();
		welcomlayer.init();
		welcomlayer.setPosition(size.width/2,size.height/2);
		this.addChild(welcomlayer,0);
	}


});
var OverLayer=cc.Layer.extend({
	restartButton:null,
	titile:null,
	init: function(){
		this._super();
		console.log("OverLayer");

		this.restartButton=new ccui.Button();
		this.restartButton.loadTextures("assets/backButton1.png","assets/backButton2.png","assets/backButton1.png");
		
		this.restartButton.setPosition(0,-80);
		this.restartButton.setScale(2);
    	this.restartButton.addTouchEventListener(this.touchEvent, this);
		this.title=new cc.Sprite.create("assets/gameover.png");
		var x= this.title.getPositionX();
		var y= this.title.getPositionY();
		console.log(x+"---"+y);
		this.title.setPosition(0,380);
		var actionMoveTo= cc.MoveTo.create(0.2,cc.p(0,100));
  		this.title.runAction(actionMoveTo);
		this.title.setScale(2);
		var label = cc.LabelTTF.create('SCORE: '+ yourScore,"assets/fontPixel.ttf", 20, cc.size(100,50), cc.TEXT_ALIGNMENT_CENTER);
        this.title.addChild(label);
        label.setPosition(0,0);
        this.addChild(label, 1);
		this.addChild(this.restartButton,0);
		this.addChild(this.title,0);
	},
	touchEvent: function (sender, type) {
        switch (type) {
        case ccui.Widget.TOUCH_BEGAN:
        	console.log("down");
            break;
        case ccui.Widget.TOUCH_MOVED:
        	console.log("moved");
            break;
        case ccui.Widget.TOUCH_ENDED:
        	console.log("ended");
        	this.removeChild(this.playButton);
        	this.removeChild(this.title);
        	plus=0;
        	yourScore=0;
			gamePaused=true;
			chopAction;
			idleAction;
			keyPressed=0;
			yourHp=50;
			level=0;
			posY=0;
			leftOrRight=0;
			preLeftOrRight=0;
			reduce=0.05;
        	cc.director.runScene(new cc.TransitionFade(0.1, new gameScene()));
            break;
        case ccui.Widget.TOUCH_CANCELLED:
            break;
        }
    }

});
var WelcomeLayer=cc.Layer.extend({
	playButton:null,
	titile:null,
	init: function(){
		this._super();
		console.log("WelcomeLayer");

		this.playButton=new ccui.Button();
		this.playButton.loadTextures("assets/button1.png","assets/button2.png","assets/button1.png");
		this.playButton.loadTextureNormal("assets/button1.png");
		this.playButton.loadTexturePressed("assets/button2.png");

		this.playButton.setPosition(0,-100);
		this.playButton.setScale(2);
    	this.playButton.addTouchEventListener(this.touchEvent, this);
		this.title=new cc.Sprite.create("assets/title.png");
		this.title.setScale(2);
		
		this.addChild(this.playButton,0);
		this.addChild(this.title,0);
	},
	touchEvent: function (sender, type) {
        switch (type) {
        case ccui.Widget.TOUCH_BEGAN:
        	console.log("down");
            break;
        case ccui.Widget.TOUCH_MOVED:
        	console.log("moved");
            break;
        case ccui.Widget.TOUCH_ENDED:
        	console.log("ended");
        	gamePaused=false;
        	labelScore = cc.LabelTTF.create("0","assets/fontPixel.ttf", 20, cc.size(100,50), cc.TEXT_ALIGNMENT_CENTER);
        	labelScore.setPosition(0,0);
        	this.addChild(labelScore);

        	hpBar=new ccui.Slider();
        	//hpBar.setTouchEnabled(false);
        	hpBar.loadBarTexture("assets/slideTrack.png");
        	
        	hpBar.loadProgressBarTexture("assets/progressBar.png")

        	this.addChild(hpBar);

        	hpBar.setPosition(0,120);
        	hpBar.setPercent(yourHp);
        	this.removeChild(this.playButton);
        	this.removeChild(this.title);
        	//cc.audioEngine.stopMusic();
            break;
        case ccui.Widget.TOUCH_CANCELLED:
            break;
        }
    }

});
		

//main
cc.game.onStart = function(){
	cc.view.setDesignResolutionSize(320,480,cc.ResolutionPolicy.SHOW_ALL); //320x480
	cc.LoaderScene.preload(gameResource, function(){
		console.log("my awesome game start");
		cc.director.runScene(new gameScene()); //chay scene
	},this);
};
cc.game.run("gameCanvas");
