/* Programs page — carousel for human + spreadsheet problems */
(function(){
  var humanSlides=[
    {title:'Team Transitions',body:'CEO / Partner / Team Reorganizations and Transitions'},
    {title:'Team & Workflow Misalignment',body:'Support deep connection + clarity to meet objectives'},
    {title:'Executive Growth & Transformation',body:'One-on-one coaching for CEOs, Executives, Pro Coaches'},
    {title:'Goals and Priorities',body:'Personal and organizational goal / priority alignment'}
  ];
  var sheetSlides=[
    {title:'Revenue + Profit Growth',body:'Driving Culture for Material and Measurable Growth'},
    {title:'Measurable Operational Improvement',body:'Vision + Values Check In, Buy In, Live In to improve KPIs'},
    {title:'Financial Planning & Forecasting',body:'Budgets, Forecasts, Capital Structure, Raising Capital'},
    {title:'Business Exits',body:'Positioning + Guiding Owners on Sale of Business'}
  ];
  function initCarousel(id,dotClass,lineClass,slides){
    var el=document.getElementById(id);if(!el)return;
    var title=el.querySelector('.carousel-title');
    var body=el.querySelector('.carousel-body');
    var dots=document.querySelectorAll('.'+dotClass);
    var lines=document.querySelectorAll('.'+lineClass);
    var idx=0;
    setInterval(function(){
      el.style.opacity='0';
      setTimeout(function(){
        idx=(idx+1)%slides.length;
        title.textContent=slides[idx].title;
        body.textContent=slides[idx].body;
        dots.forEach(function(d,i){d.style.backgroundColor=i===idx?'white':'rgba(255,255,255,.3)';});
        lines.forEach(function(l,i){l.style.backgroundColor=i<idx?'rgba(255,255,255,.55)':'rgba(255,255,255,.15)';});
        el.style.opacity='1';
      },350);
    },4000);
  }
  initCarousel('human-carousel','human-dot','human-line',humanSlides);
  initCarousel('sheet-carousel','sheet-dot','sheet-line',sheetSlides);
}());
