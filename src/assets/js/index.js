/* Index hero — scroll-to-unlock + expand-to-fullscreen video */
(function(){
  var canvas=document.getElementById('hero-stars');
  if(!canvas)return;
  var ctx=canvas.getContext('2d');
  var W,H,stars=[],raf,t=0;

  function initStars(){
    W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;stars=[];
    for(var i=0;i<250;i++)stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*.6+.1,base:Math.random()*.5+.3,twinkle:Math.random()<.15,speed:Math.random()*.03+.02,phase:Math.random()*Math.PI*2,parallax:.04,glow:false});
    for(var j=0;j<80;j++)stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*.9+.3,base:Math.random()*.4+.4,twinkle:Math.random()<.25,speed:Math.random()*.06+.03,phase:Math.random()*Math.PI*2,parallax:.14,glow:false});
    for(var k=0;k<20;k++)stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.2+.8,base:Math.random()*.3+.7,twinkle:Math.random()<.45,speed:Math.random()*.1+.05,phase:Math.random()*Math.PI*2,parallax:.28,glow:true});
  }

  function drawBg(){
    ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  }

  var subtitle=document.getElementById('hero-subtitle');
  var heroText=document.getElementById('hero-text');
  var heroVideo=document.getElementById('hero-video');
  var facadeCta=document.getElementById('facade-cta');
  var unlocked=false,effectiveScroll=0,UNLOCK_AT=400;

  // Iframe is preloaded; clicking play reveals it and starts playback
  var playBtn=document.getElementById('play-btn');
  var heroIframe=document.getElementById('hero-iframe');
  var vimeoPlayer=heroIframe?new Vimeo.Player(heroIframe):null;
  if(playBtn){
    playBtn.addEventListener('click',function(){
      var facade=document.getElementById('video-facade');
      var placeholder=document.getElementById('video-placeholder');
      if(facade)facade.style.display='none';
      if(placeholder)placeholder.style.display='none';
      if(heroIframe){
        heroIframe.style.opacity='1';
        heroIframe.style.pointerEvents='auto';
      }
      if(vimeoPlayer)vimeoPlayer.play().catch(function(){});
    });
  }

  // Phase 1: scroll lock
  document.documentElement.style.overflowY='scroll';
  function snapToTop(){if(!unlocked)window.scrollTo(0,0);}
  window.addEventListener('scroll',snapToTop);

  // Video resting position (centered below titles)
  function getInitRect(){
    var vw=window.innerWidth,vh=window.innerHeight;
    var w=Math.min(vw*0.8,1100);
    var h=w*9/16;
    return {x:(vw-w)/2, y:vh*0.95-h/2, w:w, h:h};
  }

  function doUnlock(){
    if(unlocked)return;unlocked=true;
    document.documentElement.style.overflowY='';
    window.removeEventListener('scroll',snapToTop);
    if(subtitle){subtitle.style.opacity='1';subtitle.style.transform='translateY(0)';}

    // Switch video to pixel positioning for Phase 2 interpolation
    if(heroVideo){
      var r=getInitRect();
      heroVideo.style.transform='none';
      heroVideo.style.left=r.x+'px';
      heroVideo.style.top=r.y+'px';
      heroVideo.style.width=r.w+'px';
      heroVideo.style.height=r.h+'px';
      heroVideo.style.maxWidth='none';
      heroVideo.style.aspectRatio='auto';
    }

    window.removeEventListener('wheel',onWheel);
    window.removeEventListener('keydown',onKeyDown);
    window.removeEventListener('touchmove',onTouchMove);
    window.removeEventListener('touchstart',onTouchStart);
  }

  // Phase 1 scroll capture
  function onWheel(e){if(unlocked)return;e.preventDefault();effectiveScroll=Math.min(UNLOCK_AT,effectiveScroll+Math.min(Math.abs(e.deltaY),80));if(effectiveScroll>=UNLOCK_AT)doUnlock();}
  var touchStartY=0;
  function onTouchStart(e){touchStartY=e.touches[0].clientY;}
  function onTouchMove(e){if(unlocked)return;e.preventDefault();var delta=touchStartY-e.touches[0].clientY;touchStartY=e.touches[0].clientY;effectiveScroll=Math.min(UNLOCK_AT,effectiveScroll+Math.max(0,delta));if(effectiveScroll>=UNLOCK_AT)doUnlock();}
  function onKeyDown(e){if(unlocked)return;if(['ArrowDown',' ','PageDown'].indexOf(e.key)>-1){e.preventDefault();effectiveScroll=Math.min(UNLOCK_AT,effectiveScroll+80);if(effectiveScroll>=UNLOCK_AT)doUnlock();}}
  window.addEventListener('wheel',onWheel,{passive:false});
  window.addEventListener('touchstart',onTouchStart,{passive:true});
  window.addEventListener('touchmove',onTouchMove,{passive:false});
  window.addEventListener('keydown',onKeyDown);

  // Phase 1: only animate subtitle (video is already visible)
  function updatePhase1(s){
    if(subtitle){
      var p=Math.min(1,Math.max(0,(s-40)/180));
      subtitle.style.opacity=p;
      subtitle.style.transform='translateY('+(16-p*16)+'px)';
    }
  }

  // Phase 2: titles scroll off top, video expands to fullscreen
  function updatePhase2(){
    var scrollY=window.scrollY||window.pageYOffset;
    var vh=window.innerHeight,vw=window.innerWidth;
    var prog=Math.min(1,Math.max(0,scrollY/vh));
    var ease=prog<0.5?2*prog*prog:1-Math.pow(-2*prog+2,2)/2;

    // Titles scroll off naturally
    if(heroText) heroText.style.transform='translateY('+(-scrollY)+'px)';

    // Fade in facade text
    var facadeOp=Math.max(0,Math.min(1,(prog-0.2)*4));
    if(facadeCta)facadeCta.style.opacity=facadeOp;

    // Show play button only once video is nearly fullscreen
    if(playBtn){
      var btnOp=Math.max(0,Math.min(1,(prog-0.85)*10));
      playBtn.style.opacity=btnOp;
      playBtn.style.pointerEvents=btnOp>0.5?'auto':'none';
    }

    // Interpolate video from resting rect → full width, keeping 16:9
    if(heroVideo){
      var r=getInitRect();
      var w=r.w+(vw-r.w)*ease;
      var h=w*9/16;
      var x=r.x-r.x*ease;
      var yEnd=(vh-vw*9/16)/2; // vertically center at full width
      var y=r.y+(yEnd-r.y)*ease;
      heroVideo.style.left=x+'px';
      heroVideo.style.top=y+'px';
      heroVideo.style.width=w+'px';
      heroVideo.style.height=h+'px';
      heroVideo.style.borderRadius=(2*(1-ease))+'rem';
    }
  }

  function animate(){
    t++;
    var scrollY=unlocked?(window.scrollY||window.pageYOffset):effectiveScroll;
    if(!unlocked)updatePhase1(effectiveScroll);
    else updatePhase2();

    ctx.clearRect(0,0,W,H);drawBg();
    for(var i=0;i<stars.length;i++){
      var s=stars[i];
      var sy=((s.y-scrollY*s.parallax)%H+H)%H;
      var op=s.twinkle?Math.max(.05,Math.min(1,s.base+Math.sin(t*s.speed+s.phase)*.35)):s.base;
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
    raf=requestAnimationFrame(animate);
  }

  function resize(){cancelAnimationFrame(raf);initStars();animate();}
  initStars();animate();window.addEventListener('resize',resize);
}());
