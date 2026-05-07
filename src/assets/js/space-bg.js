/* Ambient star background — fills the fixed viewport canvas */
(function(){
  var c=document.getElementById('space-bg');if(!c)return;
  var ctx=c.getContext('2d');
  var W,H,stars=[],t=0;
  function init(){
    W=c.width=window.innerWidth;H=c.height=window.innerHeight;stars=[];
    for(var i=0;i<300;i++)stars.push({
      x:Math.random()*W,y:Math.random()*H,
      r:Math.random()*.7+.1,
      base:Math.random()*.35+.1,
      twinkle:Math.random()<.2,
      speed:Math.random()*.015+.005,
      phase:Math.random()*Math.PI*2
    });
  }
  function draw(){
    t++;
    ctx.fillStyle='#06061a';ctx.fillRect(0,0,W,H);
    for(var i=0;i<stars.length;i++){
      var s=stars[i];
      var op=s.twinkle?Math.max(.05,Math.min(.65,s.base+Math.sin(t*s.speed+s.phase)*.18)):s.base;
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,'+op+')';ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  init();draw();
  window.addEventListener('resize',function(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;});
}());
