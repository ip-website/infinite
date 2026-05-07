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
    var bg=ctx.createRadialGradient(W*.4,H*.35,0,W*.5,H*.5,W*.9);
    bg.addColorStop(0,'#0d0d2b');bg.addColorStop(.5,'#06061a');bg.addColorStop(1,'#020208');
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    var n1=ctx.createRadialGradient(W*.65,H*.35,0,W*.65,H*.35,W*.45);
    n1.addColorStop(0,'rgba(112,87,232,.18)');n1.addColorStop(.6,'rgba(71,143,249,.07)');n1.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=n1;ctx.fillRect(0,0,W,H);
    var n2=ctx.createRadialGradient(W*.25,H*.65,0,W*.25,H*.65,W*.35);
    n2.addColorStop(0,'rgba(40,218,252,.1)');n2.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=n2;ctx.fillRect(0,0,W,H);
  }

  var subtitle=document.getElementById('hero-subtitle');
  var heroText=document.getElementById('hero-text');
  var heroVideo=document.getElementById('hero-video');
  var heroCta=document.getElementById('hero-cta');
  var unmuteBtn=document.getElementById('unmute-btn');
  var unlocked=false,effectiveScroll=0,UNLOCK_AT=500;
  var videoStarted=false;

  // Phase 1: scroll lock
  document.documentElement.style.overflowY='scroll';
  function snapToTop(){if(!unlocked)window.scrollTo(0,0);}
  window.addEventListener('scroll',snapToTop);

  // Compute the video's "resting" position (center of viewport, 80% width, 16:9)
  function getInitRect(){
    var vw=window.innerWidth,vh=window.innerHeight;
    var w=Math.min(vw*0.8,1100);
    var h=w*9/16;
    return {x:(vw-w)/2, y:0.5*vh-0.45*h, w:w, h:h};
  }

  function doUnlock(){
    if(unlocked)return;unlocked=true;
    document.documentElement.style.overflowY='';
    window.removeEventListener('scroll',snapToTop);
    if(subtitle){subtitle.style.opacity='1';subtitle.style.transform='translateY(0)';}
    if(heroCta)heroCta.style.opacity='1';

    // Switch video from CSS transform positioning to explicit pixel positioning
    if(heroVideo){
      var r=getInitRect();
      heroVideo.style.opacity='1';
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

  // Phase 1: animate subtitle + video scale-in from effectiveScroll
  function updatePhase1(s){
    if(subtitle){
      var p=Math.min(1,Math.max(0,(s-40)/220));
      subtitle.style.opacity=p;
      subtitle.style.transform='translateY('+(16-p*16)+'px)';
    }
    if(heroVideo){
      var p2=Math.min(1,Math.max(0,(s-220)/240));
      var e=1-Math.pow(1-p2,3);
      heroVideo.style.opacity=e;
      heroVideo.style.transform='translate(-50%,-45%) scale('+(0.5+e*0.5)+')';
    }
  }

  // Phase 2: expand video to fullscreen based on real scroll position
  function updatePhase2(){
    var scrollY=window.scrollY||window.pageYOffset;
    var vh=window.innerHeight,vw=window.innerWidth;
    var prog=Math.min(1,Math.max(0,scrollY/vh));
    // Ease in-out
    var ease=prog<0.5?2*prog*prog:1-Math.pow(-2*prog+2,2)/2;

    // Fade out title and CTA in first 33% of scroll
    var textOp=Math.max(0,1-prog*3);
    if(heroText)heroText.style.opacity=textOp;
    if(heroCta)heroCta.style.opacity=textOp;

    // Interpolate video from resting rect → full viewport
    if(heroVideo){
      var r=getInitRect();
      var w=r.w+(vw-r.w)*ease;
      var h=r.h+(vh-r.h)*ease;
      var x=r.x-r.x*ease;
      var y=r.y-r.y*ease;
      heroVideo.style.left=x+'px';
      heroVideo.style.top=y+'px';
      heroVideo.style.width=w+'px';
      heroVideo.style.height=h+'px';
      heroVideo.style.borderRadius=(2*(1-ease))+'rem';
      heroVideo.style.boxShadow=ease<0.5?'0 0 60px rgba(71,143,249,'+(0.2*(1-ease*2))+'),0 30px 60px rgba(0,0,0,'+(0.6*(1-ease*2))+')':'none';
    }

    // Start video once nearly fullscreen
    if(prog>=0.95&&!videoStarted){
      videoStarted=true;
      var facade=document.getElementById('video-facade');
      var iframe=document.getElementById('hero-iframe');
      if(facade)facade.style.display='none';
      if(iframe){iframe.src=iframe.dataset.src;iframe.style.display='block';}
      var controls=document.getElementById('video-controls');if(controls)controls.style.display='flex';
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
