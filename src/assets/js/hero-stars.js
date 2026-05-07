/* Simple hero star canvas (about + programs pages) */
(function(){
  var c=document.getElementById('hero-stars');if(!c)return;
  var ctx=c.getContext('2d');var W,H,stars=[],t=0;
  function init(){
    W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;stars=[];
    for(var i=0;i<200;i++)stars.push({
      x:Math.random()*W,y:Math.random()*H,
      r:Math.random()*.8+.1,
      base:Math.random()*.4+.2,
      twinkle:Math.random()<.25,
      speed:Math.random()*.04+.01,
      phase:Math.random()*Math.PI*2
    });
  }
  function draw(){
    t++;ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
    for(var i=0;i<stars.length;i++){
      var s=stars[i];
      var op=s.twinkle?Math.max(.05,Math.min(1,s.base+Math.sin(t*s.speed+s.phase)*.3)):s.base;
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,'+op+')';ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  init();draw();
  window.addEventListener('resize',function(){if(c.offsetWidth>0)init();});
}());
