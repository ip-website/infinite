/* Section star canvases — 3-layer parallax, density fades with scroll depth */
(function(){
  var densityScales=[0.85,0.60,0.40,0.25];
  var canvases=document.querySelectorAll('.section-stars');
  canvases.forEach(function(c,idx){
    var scale=densityScales[Math.min(idx,densityScales.length-1)];
    var ctx=c.getContext('2d');
    var W,H,stars=[],t=(Math.random()*2000)|0;
    function init(){
      W=c.width=c.offsetWidth||c.parentElement.offsetWidth;
      H=c.height=c.offsetHeight||c.parentElement.offsetHeight;
      if(!W||!H)return;
      stars=[];
      // Layer 1 — distant, slow, small
      var n1=Math.max(20,Math.min(110,((W*H/8000)*scale)|0));
      for(var i=0;i<n1;i++)stars.push({
        x:Math.random()*W,y:Math.random()*H,
        r:Math.random()*.7+.2,
        base:Math.random()*.4+.2,
        twinkle:Math.random()<.18,
        speed:Math.random()*.025+.008,
        phase:Math.random()*Math.PI*2,
        parallax:Math.random()*.02+.02,
        glow:false
      });
      // Layer 2 — mid distance
      var n2=Math.max(8,((W*H/20000)*scale)|0);
      for(var j=0;j<n2;j++)stars.push({
        x:Math.random()*W,y:Math.random()*H,
        r:Math.random()*1.1+.4,
        base:Math.random()*.35+.35,
        twinkle:Math.random()<.3,
        speed:Math.random()*.05+.02,
        phase:Math.random()*Math.PI*2,
        parallax:Math.random()*.08+.08,
        glow:false
      });
      // Layer 3 — bright, close, glowing
      var n3=Math.max(3,((W*H/50000)*scale)|0);
      for(var k=0;k<n3;k++)stars.push({
        x:Math.random()*W,y:Math.random()*H,
        r:Math.random()*1.5+.8,
        base:Math.random()*.25+.65,
        twinkle:Math.random()<.5,
        speed:Math.random()*.08+.04,
        phase:Math.random()*Math.PI*2,
        parallax:Math.random()*.12+.18,
        glow:true
      });
    }
    function draw(){
      t++;
      var scrollY=window.scrollY||window.pageYOffset;
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<stars.length;i++){
        var s=stars[i];
        var sy=((s.y-scrollY*s.parallax)%H+H)%H;
        var op=s.twinkle?Math.max(.05,Math.min(1,s.base+Math.sin(t*s.speed+s.phase)*.32)):s.base;
        if(s.glow){
          var g=ctx.createRadialGradient(s.x,sy,0,s.x,sy,s.r*5);
          g.addColorStop(0,'rgba(255,255,255,'+op+')');
          g.addColorStop(.4,'rgba(200,220,255,'+(op*.25)+')');
          g.addColorStop(1,'rgba(0,0,0,0)');
          ctx.fillStyle=g;ctx.fillRect(s.x-s.r*5,sy-s.r*5,s.r*10,s.r*10);
        }
        ctx.beginPath();ctx.arc(s.x,sy,s.r,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,'+op+')';ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    init();draw();
    window.addEventListener('resize',init);
  });
}());
