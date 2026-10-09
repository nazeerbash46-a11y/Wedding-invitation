(function(){
'use strict';
var C=window.WEDDING;document.documentElement.dataset.theme=C.theme||'emerald';var E=C.event,$=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var iso=E.date+'T'+E.time+':00'+E.tzOffset,start=new Date(iso);
var fmt=function(o){return new Intl.DateTimeFormat('en-IN',Object.assign({timeZone:E.timezone},o)).format(start)};

['.intro','.story','.schedule','.rsvp'].forEach(function(s){var n=$(s);n&&n.classList.add('light')});
/* content binding */
var venueSet=!!(C.venue.name||C.venue.address);
var data={groom:C.groom,bride:C.bride,eventName:E.name,dateLong:fmt({day:'numeric',month:'long',year:'numeric'}),
 timeLong:fmt({hour:'numeric',minute:'2-digit',hour12:true}).toUpperCase()+' IST',place:E.city+', '+E.country,
 venueNote:venueSet?[C.venue.name,C.venue.address].filter(Boolean).join(', '):C.venue.note};
$$('[data-bind]').forEach(function(n){var v=data[n.dataset.bind];if(v!=null)n.textContent=v});
document.title=C.groom+' & '+C.bride+' · Wedding Invitation · '+data.dateLong;
if(C.site.url){var u=C.site.url.replace(/\/$/,'');[['og:url',u+'/'],['og:image',u+'/'+C.site.ogImage]].forEach(function(p){var m=document.querySelector('meta[property="'+p[0]+'"]')||document.head.appendChild(Object.assign(document.createElement('meta'),{}));m.setAttribute('property',p[0]);m.content=p[1]})}

/* images: use if present, otherwise the CSS/SVG artwork shows through */
var imgMap={hero:C.hero.src,floralL:'assets/images/floral-left.webp',floralR:'assets/images/floral-right.webp',venue:'assets/images/venue.webp',closing:'assets/images/closing-garden.webp'};
$$('img[data-img]').forEach(function(im){im.addEventListener('error',function(){im.style.display='none'});im.src=imgMap[im.dataset.img]});

/* gallery + lightbox */
var gal=$('#gallery'),lb,lbImg,idx=0,loaded={};
C.gallery.forEach(function(g,i){
 var b=document.createElement('button');b.type='button';b.className='gitem';b.setAttribute('aria-label','Open photo '+(i+1)+': '+g.alt);
 b.innerHTML='<svg class="lotus" aria-hidden="true"><use href="#lotus"/></svg>';
 var im=new Image();im.alt='';im.loading='lazy';im.decoding='async';im.onload=function(){loaded[i]=1;b.appendChild(im)};im.src=g.src;
 b.addEventListener('click',function(){openLb(i)});gal.appendChild(b)});
function buildLb(){lb=document.createElement('dialog');lb.className='lb';lb.setAttribute('aria-label','Photo viewer');
 lb.innerHTML='<button class="fbtn x" aria-label="Close">&times;</button><button class="fbtn nav p" aria-label="Previous photo">&lsaquo;</button><img alt=""><button class="fbtn nav n" aria-label="Next photo">&rsaquo;</button><p class="note"></p>';
 document.body.appendChild(lb);lbImg=$('img',lb);
 $('.x',lb).onclick=function(){lb.close()};$('.p',lb).onclick=function(){show(idx-1)};$('.n',lb).onclick=function(){show(idx+1)};
 lb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1)});
 lb.addEventListener('click',function(e){if(e.target===lb)lb.close()})}
function show(i){var n=C.gallery.length;idx=(i+n)%n;var g=C.gallery[idx];
 if(loaded[idx]){lbImg.src=g.src;lbImg.alt=g.alt;lbImg.hidden=false;$('.note',lb).textContent=''}else{lbImg.hidden=true;$('.note',lb).textContent='Photograph coming soon.'}}
function openLb(i){if(!lb)buildLb();show(i);if(lb.showModal)lb.showModal();else lb.setAttribute('open','')}

/* timeline */
var tl=$('#timeline');C.schedule.filter(function(s){return s.enabled}).forEach(function(s){
 var li=document.createElement('li'),t=s.time?s.time+(s.confirmed?'':' · to be confirmed'):'Timing to be confirmed';
 li.innerHTML='<small></small><strong></strong>';li.firstChild.textContent=t;li.lastChild.textContent=s.title;
 if(s.note){var p=document.createElement('div');p.textContent=s.note;p.className='note';li.appendChild(p)}tl.appendChild(li)});

/* countdown */
var ids=['cdD','cdH2','cdM','cdS'],cdT;
function tick(){var d=start-Date.now();
 if(d<=0){$('#countdown').hidden=true;var m=$('#cdMsg');m.hidden=false;m.textContent=Date.now()-start<864e5?'Today is the day. Join us in celebration.':'Thank you for celebrating with us.';clearInterval(cdT);return}
 var s=Math.floor(d/1e3),v=[Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60];
 v.forEach(function(n,i){$('#'+ids[i]).textContent=i?String(n).padStart(2,'0'):n});
 $('#countdown').setAttribute('aria-label',v[0]+' days, '+v[1]+' hours, '+v[2]+' minutes remaining')}
tick();cdT=setInterval(tick,1000);

/* calendar */
function downloadIcs(){
 var z=function(d){return d.toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'')},end=new Date(start.getTime()+E.durationHours*36e5);
 var esc=function(s){return s.replace(/[\\;,]/g,'\\$&').replace(/\n/g,'\\n')};
 var ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wedding Invitation//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+E.date+'-'+C.groom.toLowerCase()+'-'+C.bride.toLowerCase()+'@wedding-invitation',
  'DTSTAMP:'+z(new Date()),'DTSTART:'+z(start),'DTEND:'+z(end),'SUMMARY:'+esc(C.groom+' & '+C.bride+' · '+E.name),
  'LOCATION:'+esc(venueSet?[C.venue.name,C.venue.address,E.city].filter(Boolean).join(', '):E.city+', '+E.country),
  'DESCRIPTION:'+esc('Venue and timings to be confirmed. End time is a placeholder.'),'END:VEVENT','END:VCALENDAR'].join('\r\n');
 var name='vijay-rashima-wedding.ics',fallback=function(){
  try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},1e3)}catch(e){}
  try{window.open('data:text/calendar;charset=utf-8,'+encodeURIComponent(ics),'_blank')}catch(e){}};
 try{var f=new File([ics],name,{type:'text/calendar'});
  if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:C.groom+' & '+C.bride}).catch(function(err){if(err&&err.name!=='AbortError')fallback()});return}}catch(e){}
 fallback()}

(function(){var btn=$('#calBtn'),menu=$('#calMenu'),g=$('#calGoogle'),z=function(d){return d.toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'')},
 end=new Date(start.getTime()+E.durationHours*36e5),loc=venueSet?[C.venue.name,C.venue.address,E.city].filter(Boolean).join(', '):E.city+', '+E.country;
 g.href='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(C.groom+' & '+C.bride+' · '+E.name)+'&dates='+z(start)+'/'+z(end)+'&location='+encodeURIComponent(loc)+'&details='+encodeURIComponent('Venue and timings to be confirmed. End time is a placeholder.')+'&ctz='+encodeURIComponent(E.timezone);
 btn.addEventListener('click',function(){var open=menu.hidden;menu.hidden=!open;btn.setAttribute('aria-expanded',open)});
 $('#calIcs').href=C.calendarFile||'assets/calendar/vijay-rashima-wedding.ics';
})();

/* directions */
if(C.venue.mapsUrl){$('#dirBtn').href=C.venue.mapsUrl;$('#dirBtn').hidden=false;$('#dirOff').hidden=true}

/* RSVP (swap submitRsvp for a secure server endpoint later; never ship service keys to the browser) */
function submitRsvp(p){
 if(C.rsvp.mode==='endpoint'&&C.rsvp.endpoint)return fetch(C.rsvp.endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(p)}).then(function(){return{demo:false}}); /* no-cors suits Google Apps Script; the reply cannot be read, so success means the request was sent */
 return new Promise(function(res){setTimeout(function(){res({demo:true})},500)})}
var form=$('#rsvpForm'),att=function(){var c=$('input[name=attend]:checked',form);return c&&c.value};
$$('input[name=attend]',form).forEach(function(r){r.addEventListener('change',function(){$('#guestsWrap').hidden=att()==='decline'})});
form.addEventListener('submit',function(e){e.preventDefault();var ok=true,n=$('#gName'),c=$('#gCount');
 var set=function(id,t,el){$(id).textContent=t;if(el)el.setAttribute('aria-invalid',t?'true':'false')};
 set('#eName',n.value.trim()?'':'Please enter your name.',n);if(!n.value.trim())ok=false;
 set('#eAtt',att()?'':'Please choose whether you can attend.');if(!att())ok=false;
 var k=parseInt(c.value,10);if(att()!=='decline'&&!(k>=1&&k<=10)){set('#eCount','Enter a number from 1 to 10.',c);ok=false}else set('#eCount','',c);
 if(!ok){var f=$('[aria-invalid=true]',form);(f||$('#eAtt')).scrollIntoView({block:'center'});if(f)f.focus();return}
 var btn=$('button[type=submit]',form);btn.disabled=true;
 submitRsvp({name:n.value.trim(),attending:att()==='accept',guests:att()==='decline'?0:k,message:$('#gMsg').value.trim()}).then(function(r){
  var d=$('#rsvpDone');form.hidden=true;$('.demo').hidden=false;d.hidden=false;
  $('#doneH').textContent=att()==='accept'?'Thank you, '+n.value.trim()+'. We will celebrate with you.':'Thank you, '+n.value.trim()+'. You will be missed.';
  $('#doneP').textContent=r.demo?'This is a demo. Your response has not been sent to the couple.':'Your response has been received.';d.focus()
 }).catch(function(){btn.disabled=false;$('#eName').textContent='Could not send. Please check your connection and try again.'})});

/* music */
var audio=null,mb=$('#musicBtn'),playing=false,musicOK=true;
function setMusic(on){playing=on;mb.setAttribute('aria-pressed',on);mb.setAttribute('aria-label',musicOK?(on?'Mute music':'Play music'):'Music unavailable')}
function startMusic(){if(!audio){audio=new Audio(C.audio.src);audio.loop=true;audio.volume=C.audio.volume;audio.addEventListener('error',function(){musicOK=false;mb.classList.add('off');setMusic(false)})}
 var p=audio.play();if(p&&p.then)p.then(function(){setMusic(true)}).catch(function(){setMusic(false)});else setMusic(true)}
mb.addEventListener('click',function(){if(!musicOK)return;if(playing){audio.pause();setMusic(false)}else startMusic()});

/* top button */
var tb=$('#topBtn');tb.onclick=function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})};
addEventListener('scroll',function(){tb.hidden=scrollY<innerHeight*1.5},{passive:true});


/* luxe moment on opening: golden light bloom, light rays, drifting petals */
function luxe(){var L=document.createElement('div');L.className='luxe';L.setAttribute('aria-hidden','true');
 L.innerHTML='<i class="rays"></i><i class="bloom"></i>';
 if(!reduce){var cols=['#e08a1e','#f2b03a','#fbf6e8','#b04a30','#fbf6e8','#c9ad6e'];
  for(var i=0;i<16;i++){var p=document.createElement('b'),s=8+Math.random()*12;
   p.style.cssText='left:'+(Math.random()*100)+'%;width:'+s+'px;height:'+(s*1.3)+'px;background:'+cols[i%cols.length]+';animation-delay:'+(0.9+Math.random()*3.2).toFixed(2)+'s;animation-duration:'+(5+Math.random()*4).toFixed(2)+'s;--dx:'+((Math.random()-.5)*140).toFixed(0)+'px';L.appendChild(p)}}
 document.body.appendChild(L);setTimeout(function(){L.remove()},10500)}
/* opening */
var cover=$('#cover'),ob=$('#openBtn');ob.focus({preventScroll:true});
function reveal(){document.body.classList.remove('locked');document.documentElement.classList.add('ready');cover.remove();$('#main').setAttribute('tabindex','-1');scrollTo(0,0)}
ob.addEventListener('click',function(){startMusic();cover.classList.add('opening');luxe();setTimeout(reveal,reduce?500:1900)});

/* reveals (CSS-driven, no library needed) */
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15}):null;
$$('.reveal,.gitem').forEach(function(n,i){if(io)io.observe(n);else n.classList.add('in')});

/* optional GSAP parallax; the page is fully usable without it */
addEventListener('load',function(){if(reduce||!window.gsap||!window.ScrollTrigger)return;
 gsap.registerPlugin(ScrollTrigger);
 $$('[data-layer]').forEach(function(n){gsap.to(n,{yPercent:parseFloat(n.dataset.layer)*100,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:true}})})});

/* flowers: drawn in SVG so the site is lush even before artwork exists */
(function(){
var P={
 jasmine:'<g fill="#fbf6e8" stroke="#d9cfae" stroke-width=".6">'+[0,72,144,216,288].map(function(a){return '<ellipse cy="-6" rx="3.2" ry="6.5" transform="rotate('+a+')"/>'}).join('')+'</g><circle r="2" fill="#e0b64a"/>',
 marigold:'<g fill="#e08a1e">'+[0,36,72,108,144,180,216,252,288,324].map(function(a){return '<circle cy="-6.5" r="3.6" transform="rotate('+a+')"/>'}).join('')+'</g><g fill="#f2b03a">'+[18,90,162,234,306].map(function(a){return '<circle cy="-4" r="3" transform="rotate('+a+')"/>'}).join('')+'</g><circle r="2.6" fill="#b8651a"/>',
 rose:'<circle r="8.5" fill="#8f3a26"/><circle r="6.5" fill="#b04a30"/><path d="M-4 0a4 4 0 0 1 8 0a2.5 2.5 0 0 1-5 0a1.5 1.5 0 0 1 3 0" fill="none" stroke="#e7a58f" stroke-width=".9"/><path d="M-7-3a8 8 0 0 1 10-4" fill="none" stroke="#d0735a" stroke-width=".8"/>',
 leaf:'<path d="M0 0C6-8 6-18 0-26C-6-18-6-8 0 0z" fill="#2f6b4a"/><path d="M0 0V-22" stroke="#4a8a63" stroke-width=".7"/>'
};
function put(t,x,y,s,r){return '<g transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+(r||0)+') scale('+s+')">'+P[t]+'</g>'}
var seed=7;function rnd(){seed=(seed*9301+49297)%233280;return seed/233280}
function garland(n,sag){var o='<svg viewBox="0 0 400 110" preserveAspectRatio="none" aria-hidden="true"><path d="M0 4Q200 '+sag+' 400 4" fill="none" stroke="#2f6b4a" stroke-width="2"/>',pts=[];
 for(var i=0;i<=n;i++){var t=i/n,x=t*400,y=2*(1-t)*t*(sag-4)+4;pts.push([x,y,t])}
 pts.forEach(function(p,i){o+=put('leaf',p[0],p[1]+3,.5,(i%2?150:-150)+rnd()*30)});
 pts.forEach(function(p,i){var t=i%5===4?'rose':(i%2?'jasmine':'marigold');o+=put(t,p[0],p[1]+4,t==='rose'?.8:1.05,rnd()*60)});
 return o+'</svg>'}
function bouquet(){var o='<svg viewBox="0 0 200 300" preserveAspectRatio="xMinYMax meet" aria-hidden="true">',i;
 for(i=0;i<11;i++){var a=-8+i*9+rnd()*6;o+=put('leaf',12,298,1.3+rnd()*1.5,a)}
 var f=[['marigold',50,215,1.5],['jasmine',30,170,1.3],['rose',72,170,1.3],['jasmine',96,215,1.2],['marigold',60,120,1.2],['jasmine',104,140,1.1],['rose',38,235,1.1],['jasmine',16,120,1],['marigold',118,180,1],['jasmine',84,90,.9],['jasmine',22,80,.9]];
 f.forEach(function(q){o+=put(q[0],q[1],q[2]+10,q[3],rnd()*60)});return o+'</svg>'}
function add(host,cls,html,first){var d=document.createElement('div');d.className=cls;d.innerHTML=html;d.setAttribute('aria-hidden','true');first?host.insertBefore(d,host.firstChild):host.appendChild(d);return d}


add($('.closing'),'garland',garland(24,95));
$$('.foliage').forEach(function(f){add(f,'bouq',bouquet(),true)});
['.closing'].forEach(function(s){['l','r'].forEach(function(k){var f=add($(s),'foliage '+k,'');add(f,'bouq',bouquet(),true)})});
$$('.card, .rsvp').forEach(function(c){add(c,'garland inline',garland(18,60),true)});
})();


/* rangoli mandala, scroll-drawn gold threads, photo frame ornaments */
(function(){
var NS='http://www.w3.org/2000/svg',cnt=$('.count');
if(cnt){var m='<svg class="rangoli" viewBox="-100 -100 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".7">',i;
 [92,78,52,30,12].forEach(function(r){m+='<circle r="'+r+'"/>'});
 for(i=0;i<16;i++)m+='<g transform="rotate('+i*22.5+')"><path d="M0-52C9-62 9-76 0-90C-9-76-9-62 0-52z"/><path d="M0-30C5-37 5-44 0-50C-5-44-5-37 0-30z"/><circle cy="-84" r="1.4" fill="currentColor"/></g>';
 for(i=0;i<32;i++)m+='<circle cx="'+(Math.cos(i*.19635)*66).toFixed(1)+'" cy="'+(Math.sin(i*.19635)*66).toFixed(1)+'" r="1.1" fill="currentColor"/>';
 cnt.insertAdjacentHTML('afterbegin',m+'</g></svg>')}
var th=[];
$$('.sec').forEach(function(s){s.insertAdjacentHTML('afterbegin','<svg class="thread" viewBox="0 0 40 90" aria-hidden="true"><path pathLength="1" d="M20 0C20 18 4 24 20 40C36 56 20 62 20 80"/><path class="dm" d="M20 80l4 4-4 4-4-4z"/></svg>');th.push(s.firstChild)});
$$('.gitem').forEach(function(g){g.insertAdjacentHTML('beforeend','<span class="badge" aria-hidden="true"><svg><use href="#lotus"/></svg></span>')});
var busy=0;function draw(){busy=0;var h=innerHeight;th.forEach(function(t){var r=t.getBoundingClientRect(),p=Math.max(0,Math.min(1,(h*.85-r.top)/(h*.35)));
 t.firstChild.style.strokeDashoffset=1-p;t.lastChild.style.opacity=p>.97?1:0})}
if(reduce){th.forEach(function(t){t.firstChild.style.strokeDashoffset=0;t.lastChild.style.opacity=1})}
else{addEventListener('scroll',function(){if(!busy){busy=1;requestAnimationFrame(draw)}},{passive:true});addEventListener('resize',draw);draw()}
})();

/* hanging flower strands on the entrance, top to bottom */
(function(){
var P2={j:'<g fill="#fbf6e8" stroke="#d9cfae" stroke-width=".6">'+[0,72,144,216,288].map(function(a){return '<ellipse cy="-6" rx="3.2" ry="6.5" transform="rotate('+a+')"/>'}).join('')+'</g><circle r="2" fill="#e0b64a"/>',
 m:'<g fill="#e08a1e">'+[0,36,72,108,144,180,216,252,288,324].map(function(a){return '<circle cy="-6.5" r="3.6" transform="rotate('+a+')"/>'}).join('')+'</g><circle r="2.6" fill="#b8651a"/>',
 r:'<circle r="8" fill="#8f3a26"/><circle r="6" fill="#b04a30"/><path d="M-3 0a3.5 3.5 0 0 1 7 0" fill="none" stroke="#e7a58f" stroke-width=".9"/>',
 l:'<path d="M0 0C5-6 5-14 0-20C-5-14-5-6 0 0z" fill="#2f6b4a"/>'};
function strand(n,k){var o='<svg viewBox="0 0 44 '+(n*22+10)+'" preserveAspectRatio="xMidYMin meet" aria-hidden="true"><path d="M22 0',i,y,x;
 for(i=1;i<=n;i++){y=i*22;o+=' L'+(22+Math.sin(i*1.3+k)*4).toFixed(1)+' '+y}
 o+='" fill="none" stroke="#2f6b4a" stroke-width="1.6"/>';
 for(i=1;i<=n;i++){y=i*22;x=22+Math.sin(i*1.3+k)*4;
  o+='<g transform="translate('+(x-(i%2?7:-7)).toFixed(1)+' '+(y-4)+') rotate('+(i%2?-70:70)+')">'+P2.l+'</g>';
  var t=i===n?'m':(i%4===0?'r':(i%2?'j':'m'));
  o+='<g transform="translate('+x.toFixed(1)+' '+y+') rotate('+(i*37)+') scale('+(t==='r'?.95:1.1)+')">'+P2[t]+'</g>'}
 return o+'</svg>'}
var cv=document.querySelector('.cover');if(!cv)return;
var wrap=document.createElement('div');wrap.className='hang';wrap.setAttribute('aria-hidden','true');
[[3,8,3],[5,11,15],[2,6,30],[2,6,66],[6,12,80],[3,8,92]].forEach(function(c,j){
 var d=document.createElement('div');d.className='hs';d.style.cssText='left:'+c[2]+'%;height:'+(c[0]*9+14)+'vh;animation-delay:'+(-j*.9)+'s;animation-duration:'+(5+j%3)+'s';
 d.innerHTML=strand(c[1],j);wrap.appendChild(d)});
cv.appendChild(wrap)})();

/* scroll-linked flower travelling down the timeline */
(function(){
var tl=$('#timeline');if(!tl||!tl.children.length)return;
var f=document.createElement('span');f.className='tl-flower';f.setAttribute('aria-hidden','true');
f.innerHTML='<svg viewBox="-12 -12 24 24"><g fill="#e08a1e">'+[0,36,72,108,144,180,216,252,288,324].map(function(a){return '<circle cy="-6.5" r="3.6" transform="rotate('+a+')"/>'}).join('')+'</g><g fill="#f2b03a">'+[18,90,162,234,306].map(function(a){return '<circle cy="-4" r="3" transform="rotate('+a+')"/>'}).join('')+'</g><circle r="2.6" fill="#b8651a"/></svg>';
tl.appendChild(f);
var dots=[],busy=0;
function measure(){var fs=parseFloat(getComputedStyle(document.documentElement).fontSize)||16;dots=[].map.call(tl.children,function(li){return li===f?null:li.offsetTop+.55*fs+7.5}).filter(function(v){return v!==null});upd()}
function upd(){busy=0;if(!dots.length)return;var r=tl.getBoundingClientRect(),h=innerHeight,s=h*.65,e=h*.45;
 var p=Math.max(0,Math.min(1,(s-r.top)/(r.height+s-e))),y=dots[0]+p*(dots[dots.length-1]-dots[0]);
 f.style.transform='translate(-50%,-50%) translateY('+y.toFixed(1)+'px) rotate('+(reduce?0:p*540).toFixed(0)+'deg)';
 [].forEach.call(tl.children,function(li,i){if(li!==f)li.classList.toggle('hit',y>=dots[i]-2)})}
addEventListener('scroll',function(){if(!busy){busy=1;requestAnimationFrame(upd)}},{passive:true});
addEventListener('resize',measure);addEventListener('load',measure);measure();
})();
})();
