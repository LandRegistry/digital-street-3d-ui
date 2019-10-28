!function(e){var t={};function r(n){if(t[n])return t[n].exports;var a=t[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(n,a,function(t){return e[t]}.bind(null,a));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=5)}({5:function(e,t){mapboxgl.accessToken="pk.eyJ1IjoibWF0dGdpcmRsZXIiLCJhIjoiY2lteW85cm5lMDBmcnY5bTFxY2Zsc3c2OCJ9.VvO2DhAhOVrcjJ0Usw8JIA";var r=new mapboxgl.Map({style:"mapbox://styles/mattgirdler/cjznu3ztu06m31clp2j37yybz",center:[-3.5208657,50.7227184],zoom:17.5,pitch:45,bearing:-17.6,container:"map",antialias:!0}),n="exeter_buildings_with_height-0ygi87",a=[{layer:"airspace-leasehold-a6g827",sourceLayer:"airspace-a6g827"},{layer:"freehold-diumk5",sourceLayer:"osgb1000012317615-freehold-diumk5"},{layer:"leasehold-0-83okhj",sourceLayer:"osgb1000012317615-0-83okhj"},{layer:"leasehold-1-54g9gf",sourceLayer:"osgb1000012317615-1-54g9gf"},{layer:"leasehold-2-ccs62k",sourceLayer:"osgb1000012317615-2-ccs62k"},{layer:"leasehold-3-8aah9q",sourceLayer:"osgb1000012317615-3-8aah9q"}],i=document.getElementById("spatial-units"),o=JSON.parse(i.innerHTML)[0];function p(e){for(var t in a){if(a[t].layer.includes(e))"visible"==r.getLayoutProperty(a[t].layer,"visibility")?(r.setLayoutProperty(a[t].layer,"visibility","none"),this.className=""):(this.className="active",r.setLayoutProperty(a[t].layer,"visibility","visible"))}}r.on("load",function(){var e=[];for(var t in a)if(!a[t].layer.includes("airspace")){var i=r.querySourceFeatures("composite",{sourceLayer:a[t].sourceLayer});for(var p in i)e.includes(i[p].properties.fid)||e.push(i[p].properties.fid)}var d=["in","fid"].concat(e),s=r.querySourceFeatures("composite",{sourceLayer:n,filter:d});for(var l in s)r.setFeatureState({id:s[l].id,source:"composite",sourceLayer:n},{hide:!0}),m(s[l].properties.fid);var c=document.getElementById("title-information-overlay");function m(e){for(var t in a)if(r.setLayoutProperty(a[t].layer,"visibility","visible"),!a[t].layer.includes("airspace")){var i=r.querySourceFeatures("composite",{sourceLayer:a[t].sourceLayer});for(var o in i){var p=0,d=0;if(a[t].layer.includes("freehold")){d=120;var s=r.getSource("osgb1000012317615-freehold-diumk5");console.log(s)}else{var l=i[o].properties.fid,c=r.querySourceFeatures("composite",{sourceLayer:n,filter:["==","fid",l]})[0].properties.RelHmax/i[o].properties.num_floors;d=c*(i[o].properties.floor+1),p=c*i[o].properties.floor}r.setPaintProperty(a[t].layer,"fill-extrusion-height",d,{validate:!0}),r.setPaintProperty(a[t].layer,"fill-extrusion-base",p,{validate:!0})}}}function u(e){var t=function(e){var t=[];for(var r in o)o[r].ba_units[0].name==e&&t.push(o[r].id);return t}(y(e).ba_units[0].name);for(var n in a)for(var i in t){var p=r.querySourceFeatures("composite",{sourceLayer:a[n].sourceLayer,filter:["==","id",t[i]]});for(var d in p)r.setFeatureState({id:p[d].id,source:"composite",sourceLayer:a[n].sourceLayer},{highlight:!0})}}function y(e){return o.find(function(t){return t.id==e})}document.getElementById("toggle-layers-overlay").style.display="block",r.on("mousemove",function(e){!function(){for(var e in a)c.style.display="none",r.removeFeatureState({source:"composite",sourceLayer:a[e].sourceLayer})}();var t=[];for(var n in a)t.push(a[n].layer);var i=r.queryRenderedFeatures(e.point,{layers:t});if(i.length>0){var o=i[0];u(o.properties.id);var p=y(o.properties.id),d=[];if(p)for(var s in p.ba_units){var l=p.ba_units[s],m={address:p.address,titleNumber:l.name,pricePaid:[],rights:[],restrictions:[],responsibilities:[]};for(var h in p.price_paid){var v=p.price_paid[h];m.pricePaid.push({amount:v.amount,date:v.date})}for(var C in l.rights){var f=l.rights[C],g={rightId:f.right_id,type:f.type,description:f.description,mortgages:[]};for(var b in f.party&&(g.party={name:f.party.name,type:f.party.type,partyId:f.party}),f.mortgages){var E=f.mortgages[b],x={type:E.type,amount:E.amount,interestRate:E.interest_rate};g.mortgages.push(x)}m.rights.push(g)}for(var L in l.restrictions){var P=l.restrictions[L],_={type:P.type,description:P.description};P.party&&(_.party={name:P.party.name,type:P.party.type,partyId:P.party}),m.restrictions.push(_)}for(var S in l.responsibilities){var j=l.responsibilities[S],T={type:j.type,description:j.description};j.party&&(T.party={name:j.party.name,type:j.party.type,partyId:j.party}),m.responsibilities.push(T)}d.push(m)}c.innerHTML="";var k=document.createElement("strong");if(k.textContent=d[0].titleNumber,c.appendChild(k),d[0].address){var F=document.createElement("div"),I=document.createElement("strong");I.textContent="Address: ",F.append(I);var O=document.createElement("span");O.textContent=d[0].address,F.append(O),c.appendChild(F)}c.appendChild(document.createElement("hr"));var N=document.createElement("div");if(d[0].pricePaid.length>0){var q=document.createElement("strong");for(var M in q.textContent="Prices Paid:",N.appendChild(q),d[0].pricePaid){var D=document.createElement("div");D.style="margin-left: 10px;",M>0&&D.appendChild(document.createElement("hr"));var R=document.createElement("strong");R.textContent="Date: ",D.appendChild(R);var J=document.createElement("span");J.textContent=d[0].pricePaid[M].date,D.appendChild(J),D.appendChild(document.createElement("br"));var B=document.createElement("strong");B.textContent="Amount: ",D.appendChild(B);var w=document.createElement("span");w.textContent=d[0].pricePaid[M].amount,D.appendChild(w),D.appendChild(document.createElement("br")),N.appendChild(D)}c.appendChild(N),c.appendChild(document.createElement("hr"))}var z=document.createElement("div");if(d[0].rights.length>0){var A=document.createElement("strong");for(var H in A.textContent="Rights:",z.appendChild(A),d[0].rights){var Y=document.createElement("div");Y.style="margin-left: 10px;";var V=document.createElement("strong");V.textContent="Type: ",Y.appendChild(V);var W=document.createElement("span");if(W.textContent=d[0].rights[H].type,Y.appendChild(W),Y.appendChild(document.createElement("br")),d[0].rights[H].description){var Z=document.createElement("strong");Z.textContent="Description: ",Y.appendChild(Z);var G=document.createElement("span");G.textContent=d[0].rights[H].description,Y.appendChild(G),Y.appendChild(document.createElement("br"))}var U=document.createElement("strong");U.textContent="Party: ",Y.appendChild(U);var X=document.createElement("div");X.style="margin-left: 10px;";var K=document.createElement("strong");K.textContent="Name: ",X.appendChild(K);var Q=document.createElement("span");Q.textContent=d[0].rights[H].party.name,X.appendChild(Q),X.appendChild(document.createElement("br"));var $=document.createElement("strong");$.textContent="Type: ",X.appendChild($);var ee=document.createElement("span");ee.textContent=d[0].rights[H].party.type,X.appendChild(ee),X.appendChild(document.createElement("br")),Y.appendChild(X),Y.appendChild(document.createElement("hr")),z.appendChild(Y)}c.appendChild(z)}var te=document.createElement("div");if(d[0].restrictions.length>0){var re=document.createElement("strong");for(restriction in re.textContent="Restrictions:",te.appendChild(re),d[0].restrictions){var ne=document.createElement("div");ne.style="margin-left: 10px;";var ae=document.createElement("strong");ae.textContent="Type: ",ne.appendChild(ae);var ie=document.createElement("span");if(ie.textContent=d[0].restrictions[restriction].type,ne.appendChild(ie),ne.appendChild(document.createElement("br")),d[0].restrictions[restriction].description){var oe=document.createElement("strong");oe.textContent="Description: ",ne.appendChild(oe);var pe=document.createElement("span");pe.textContent=d[0].restrictions[restriction].description,ne.appendChild(pe),ne.appendChild(document.createElement("br"))}var de=document.createElement("strong");de.textContent="Party: ",ne.appendChild(de);var se=document.createElement("div");se.style="margin-left: 10px;";var le=document.createElement("strong");le.textContent="Name: ",se.appendChild(le);var ce=document.createElement("span");ce.textContent=d[0].restrictions[restriction].party.name,se.appendChild(ce),se.appendChild(document.createElement("br"));var me=document.createElement("strong");me.textContent="Type: ",se.appendChild(me);var ue=document.createElement("span");ue.textContent=d[0].restrictions[restriction].party.type,se.appendChild(ue),se.appendChild(document.createElement("br")),ne.appendChild(se),ne.appendChild(document.createElement("hr")),te.appendChild(ne)}c.appendChild(te)}var ye=document.createElement("div");if(d[0].responsibilities.length>0){var he=document.createElement("strong");for(responsibility in he.textContent="Responsibilities:",ye.appendChild(he),d[0].responsibilities){var ve=document.createElement("div");ve.style="margin-left: 10px;";var Ce=document.createElement("strong");Ce.textContent="Type: ",ve.appendChild(Ce);var fe=document.createElement("span");if(fe.textContent=d[0].responsibilities[responsibility].type,ve.appendChild(fe),ve.appendChild(document.createElement("br")),d[0].responsibilities[responsibility].description){var ge=document.createElement("strong");ge.textContent="Description: ",ve.appendChild(ge);var be=document.createElement("span");be.textContent=d[0].responsibilities[responsibility].description,ve.appendChild(be),ve.appendChild(document.createElement("br"))}var Ee=document.createElement("strong");Ee.textContent="Party: ",ve.appendChild(Ee);var xe=document.createElement("div");xe.style="margin-left: 10px;";var Le=document.createElement("strong");Le.textContent="Name: ",xe.appendChild(Le);var Pe=document.createElement("span");Pe.textContent=d[0].responsibilities[responsibility].party.name,xe.appendChild(Pe),xe.appendChild(document.createElement("br"));var _e=document.createElement("strong");_e.textContent="Type: ",xe.appendChild(_e);var Se=document.createElement("span");Se.textContent=d[0].responsibilities[responsibility].party.type,xe.appendChild(Se),xe.appendChild(document.createElement("br")),ve.appendChild(xe),ve.appendChild(document.createElement("hr")),ye.appendChild(ve)}c.appendChild(ye)}c.style.display="block"}})});for(var d=document.getElementsByName("filter"),s=0;s<d.length;s++)d[s].addEventListener("change",function(e){var t=e.target.value;e.preventDefault(),e.stopPropagation(),p(t)})}});
//# sourceMappingURL=mapbox.js.map