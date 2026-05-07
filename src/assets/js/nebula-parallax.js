/* Nebula blob parallax on scroll */
(function(){
  var nb1=document.getElementById('nb1'),nb2=document.getElementById('nb2'),nb3=document.getElementById('nb3');
  if(!nb1)return;
  window.addEventListener('scroll',function(){
    var sy=window.scrollY||window.pageYOffset;
    nb1.style.transform='translateY('+(sy*.06)+'px)';
    nb2.style.transform='translateY('+(-sy*.04)+'px)';
    nb3.style.transform='translateY('+(sy*.03)+'px)';
  },{passive:true});
}());
