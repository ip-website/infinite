/* Testimonial carousel — infinite horizontal slide, 5s auto-advance */
(function(){
  var track=document.getElementById('testimonial-track');
  if(!track)return;
  var total=track.children.length;
  if(total<3)return;

  // Clone first two slides and append for seamless wrap
  for(var c=0;c<2;c++) track.appendChild(track.children[c].cloneNode(true));

  var current=0;
  var interval;

  // Slide width: 100% on mobile, 50% on md+
  function slidePercent(){ return window.innerWidth>=768?50:100; }

  // Build dot indicators (one per original slide position)
  var dotsContainer=document.getElementById('testimonial-dots');
  if(dotsContainer){
    for(var d=0;d<total;d++){
      var dot=document.createElement('div');
      dot.style.cssText='width:8px;height:8px;border-radius:50%;cursor:pointer;transition:background-color .3s;';
      dot.dataset.index=d;
      dot.addEventListener('click',function(){
        current=parseInt(this.dataset.index);
        track.style.transition='transform .6s ease';
        track.style.transform='translateX('+(-current*slidePercent())+'%)';
        updateDots();
        resetTimer();
      });
      dotsContainer.appendChild(dot);
    }
  }
  var dots=dotsContainer?dotsContainer.children:[];

  function updateDots(){
    var dotIdx=current%total;
    for(var j=0;j<dots.length;j++){
      dots[j].style.backgroundColor=j===dotIdx?'white':'rgba(255,255,255,0.3)';
    }
  }

  function next(){
    current++;
    track.style.transition='transform .6s ease';
    track.style.transform='translateX('+(-current*slidePercent())+'%)';
    updateDots();

    // If we just slid into the cloned region, snap back after transition
    if(current>=total){
      setTimeout(function(){
        track.style.transition='none';
        current=0;
        track.style.transform='translateX(0%)';
      },650);
    }
  }

  function resetTimer(){
    clearInterval(interval);
    interval=setInterval(next,5000);
  }

  track.style.transform='translateX(0%)';
  updateDots();
  resetTimer();
}());
