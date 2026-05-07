/* Shooting stars animation */
(function(){
  var container=document.getElementById('shooting-stars');if(!container)return;
  function shoot(){
    var star=document.createElement('div');
    var angle=-(12+Math.random()*38);
    if(Math.random()<0.25) angle=-angle;
    var sx,sy;
    if(angle<0){
      sx=Math.random()*window.innerWidth*.6;
      sy=Math.random()*window.innerHeight*.5;
    } else {
      sx=window.innerWidth*.4+Math.random()*window.innerWidth*.5;
      sy=Math.random()*window.innerHeight*.5;
    }
    var len=100+Math.random()*140;
    var travel=260+Math.random()*200;
    star.style.cssText='position:absolute;top:'+sy+'px;left:'+sx+'px;width:'+len+'px;height:2px;'
      +'background:linear-gradient(90deg,rgba(255,255,255,0),white 50%,rgba(255,255,255,0));'
      +'transform-origin:left center;transform:rotate('+angle+'deg);opacity:0;border-radius:2px;'
      +'box-shadow:0 0 6px 1px rgba(255,255,255,.6);';
    container.appendChild(star);
    var start=null,dur=480+Math.random()*280;
    function frame(ts){
      if(!start)start=ts;
      var p=(ts-start)/dur;
      if(p>=1){if(container.contains(star))container.removeChild(star);return;}
      star.style.opacity=p<.1?p/.1:p>.6?(1-p)/.4:1;
      star.style.transform='rotate('+angle+'deg) translateX('+(p*travel)+'px)';
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    setTimeout(shoot,2000+Math.random()*3000);
  }
  setTimeout(shoot,300);
}());
