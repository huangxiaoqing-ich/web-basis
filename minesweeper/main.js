/* 
点击开始，生成棋盘；
1. leftClick 点击鼠标左键事件情况如下：
    1.被点格没有雷：显示以当前小格为中心的8个小格的总雷数；
        若该数为0：继续以当前附近全为0的8个格为中心扩散到边界数字不为0；
    2.点到雷:game over;
2. rightClick 点击鼠标右键事件：标记/取消标记；
*/ 
var oGsBtn=document.getElementById("gsBtn");
var oGBox=document.getElementById("gBox");
var oMBox=document.getElementById("mBox");
var oABox=document.getElementById("aBox");
var oAImg=document.getElementById("aImg");
var oCBtn=document.getElementById("close");
var oScore=document.getElementById("score");
var minesNum;
var minesLeft;
var block;
var mineMap=[];
// var startGameBool=true;
bindEvent();
function bindEvent(){//事件绑定；
    oGsBtn.onclick=function(){
        // if(startGameBool){
            oGBox.style.display="block";
            oMBox.style.display="block";
            init();
            // startGameBool=false;
            oGsBtn.style.display='none';
        // }
    }
    oGBox.oncontextmenu=function(){
        return false;//取消浏览器默认右键菜单；
    }
    oGBox.onmousedown=function(e){
        var event=e.target;//兼容性问题
        if(e.which==1){
            leftClick(event);
        }else if(e.which==3){
            rightClick(event);
        }
    }
    oCBtn.onclick=function(){
        oABox.style.display='none';
        oGBox.style.display='none';
        oMBox.style.display='none';
        oGBox.innerHTML='';
        // startGameBool=true;
        oGsBtn.style.display='block';
    }
}

function init(){//生成游戏盘和布雷；
    minesNum=10;
    minesLeft=10;
    oScore.innerHTML=minesLeft;
    for(var i=0;i<10;i++){
        for(var j=0;j<10;j++){
            var cell=document.createElement('div');
            cell.classList.add('block');
            cell.setAttribute('id',i+'-'+j);
            oGBox.appendChild(cell);
            mineMap.push({mine:0});
        }
    }
    aBlock=document.getElementsByClassName('block');
    while(minesNum){//循环随机生成10个雷；
        var mineIndex=Math.floor(Math.random()*100);//随机生成雷的位置；
        if(mineMap[mineIndex].mine===0){
            mineMap[mineIndex].mine=1;
            aBlock[mineIndex].classList.add('isMine');
            minesNum--;

        }
    }
}

function leftClick(dom){//游戏盘上的鼠标左键事件；
    if(dom.classList.contains('flag')){
        return;
    }
    var aIsMine=document.getElementsByClassName('isMine');
    if(dom&&dom.classList.contains('isMine')){//点到雷时发生的情况；
        // console.log('game-over');
        for(var i=0;i<aIsMine.length;i++){
            aIsMine[i].classList.add('show');
        }
        setTimeout(function(){
            oABox.style.display='block';
            oAImg.style.backgroundImage='url("img/gameover.png")';
        },500);
    }else{//未点到雷时：
        var sum=0;
        var posArr=dom&&dom.getAttribute('id').split('-');//当前格的坐标；
        var posX=posArr&&+posArr[0];
        var posY=posArr&&+posArr[1];
        dom&&dom.classList.add('num');
        for(var x=posX-1;x<=posX+1;x++){
            for(var y=posY-1;y<=posY+1;y++){
                var oAroundBox=document.getElementById(x+'-'+y);
                if(oAroundBox&&oAroundBox.classList.contains('isMine')){
                    sum++;
                }
            }
        }
        dom&&(dom.innerHTML=sum);
        if(sum==0){//当前格周围雷数为0时：
            for(var x=posX-1;x<=posX+1;x++){
                for(var y=posY-1;y<=posY+1;y++){
                    var oNearBox=document.getElementById(x+'-'+y);
                    if(oNearBox&&oNearBox.length!=0){
                        if(!oNearBox.classList.contains('checked')){
                            oNearBox.classList.add('checked');
                            leftClick(oNearBox);
                        }
                    }
                }
            }
        }
    }
}

function rightClick(dom){//游戏盘上的鼠标右键事件；
    if(dom.classList.contains('num')){
        return;
    }
    dom.classList.toggle('flag');//插旗/取消插旗；
    if(dom.classList.contains('isMine')&&dom.classList.contains('flag')){
        minesLeft--;
    }
    if(dom.classList.contains('isMine')&&!dom.classList.contains('flag')){
        minesLeft++;
    }
    oScore.innerHTML=minesLeft;
    if(minesLeft==0){
        oABox.style.display='block';
        oAImg.style.backgroundImage='url("img/game-win.png")';
    }
}