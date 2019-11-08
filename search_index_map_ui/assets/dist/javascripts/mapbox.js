!function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=5)}({5:function(e,t){mapboxgl.accessToken="pk.eyJ1IjoibWF0dGdpcmRsZXIiLCJhIjoiY2lteW85cm5lMDBmcnY5bTFxY2Zsc3c2OCJ9.VvO2DhAhOVrcjJ0Usw8JIA";var r=new mapboxgl.Map({style:"mapbox://styles/mattgirdler/cjznu3ztu06m31clp2j37yybz",center:[-3.5208657,50.7227184],zoom:17.5,pitch:45,bearing:-17.6,container:"map",antialias:!0}),n="exeter_buildings_with_height-0ygi87",i=[{layer:"airspace-leasehold-a6g827",sourceLayer:"airspace-a6g827"},{layer:"freehold-diumk5",sourceLayer:"osgb1000012317615-freehold-diumk5"},{layer:"leasehold-0-83okhj",sourceLayer:"osgb1000012317615-0-83okhj"},{layer:"leasehold-1-54g9gf",sourceLayer:"osgb1000012317615-1-54g9gf"},{layer:"leasehold-2-ccs62k",sourceLayer:"osgb1000012317615-2-ccs62k"},{layer:"leasehold-3-8aah9q",sourceLayer:"osgb1000012317615-3-8aah9q"}],a=document.getElementById("spatial-units"),o=JSON.parse(a.innerHTML)[0];function s(e){for(var t in i){if(i[t].layer.includes(e))"visible"==r.getLayoutProperty(i[t].layer,"visibility")?(r.setLayoutProperty(i[t].layer,"visibility","none"),this.className=""):(this.className="active",r.setLayoutProperty(i[t].layer,"visibility","visible"))}}r.on("load",function(){var e=[];for(var t in i)if(!i[t].layer.includes("airspace")){var a=r.querySourceFeatures("composite",{sourceLayer:i[t].sourceLayer});for(var s in a)e.includes(a[s].properties.fid)||e.push(a[s].properties.fid)}var p=["in","fid"].concat(e),d=r.querySourceFeatures("composite",{sourceLayer:n,filter:p});for(var l in d)r.setFeatureState({id:d[l].id,source:"composite",sourceLayer:n},{hide:!0}),u(d[l].properties.fid);var c=document.getElementById("title-information-overlay");function u(e){for(var t in i)if(r.setLayoutProperty(i[t].layer,"visibility","visible"),!i[t].layer.includes("airspace")){var a=r.querySourceFeatures("composite",{sourceLayer:i[t].sourceLayer});for(var o in a){var s=0,p=0;if(i[t].layer.includes("freehold"))p=120;else{var d=a[o].properties.fid,l=r.querySourceFeatures("composite",{sourceLayer:n,filter:["==","fid",d]})[0].properties.RelHmax/a[o].properties.num_floors;p=l*(a[o].properties.floor+1),s=l*a[o].properties.floor}r.setPaintProperty(i[t].layer,"fill-extrusion-height",p,{validate:!0}),r.setPaintProperty(i[t].layer,"fill-extrusion-base",s,{validate:!0})}}}function m(e){var t=function(e){var t=[];for(var r in o)o[r].ba_units[0].name==e&&t.push(o[r].id);return t}(y(e).ba_units[0].name);for(var n in i)for(var a in t){var s=r.querySourceFeatures("composite",{sourceLayer:i[n].sourceLayer,filter:["==","id",t[a]]});for(var p in s)r.setFeatureState({id:s[p].id,source:"composite",sourceLayer:i[n].sourceLayer},{highlight:!0})}}function y(e){return o.find(function(t){return t.id==e})}document.getElementById("toggle-layers-overlay").style.display="block",r.on("mousemove",function(e){var t=[];for(var n in i)t.push(i[n].layer);var a=r.queryRenderedFeatures(e.point,{layers:t});if(a.length>0){!function(){for(var e in i)c.style.display="none",r.removeFeatureState({source:"composite",sourceLayer:i[e].sourceLayer})}();var o=a[0];m(o.properties.id);var s=y(o.properties.id),p=[];if(s)for(var d in s.ba_units){var l=s.ba_units[d],u={address:s.address,titleNumber:l.name,pricePaid:[],rights:[],restrictions:[],responsibilities:[]};for(var h in s.price_paid){var v=s.price_paid[h];u.pricePaid.push({amount:v.amount,date:v.date})}for(var f in l.rights){var g=l.rights[f],C={rightId:g.right_id,type:g.type,description:g.description,mortgages:[],startDate:g.start_date,endDate:g.end_date};g.party&&(C.party={name:g.party.name,type:g.party.type,partyId:g.party}),u.rights.push(C)}for(var b in l.restrictions){var E=l.restrictions[b],x={type:E.type,description:E.description,startDate:E.start_date,endDate:E.end_date};E.party&&(x.party={name:E.party.name,type:E.party.type,partyId:E.party}),u.restrictions.push(x)}for(var L in l.responsibilities){var P=l.responsibilities[L],_={type:P.type,description:P.description,startDate:P.start_date,endDate:P.end_date};P.party&&(_.party={name:P.party.name,type:P.party.type,partyId:P.party}),u.responsibilities.push(_)}p.push(u)}c.innerHTML="";var j=document.createElement("h1");j.textContent=p[0].rights[0].type,c.appendChild(j);var D=document.createElement("strong");D.textContent="Title number: ",c.append(D);var S=document.createElement("span");if(S.append(p[0].titleNumber),c.appendChild(S),p[0].address){var F=document.createElement("div"),I=document.createElement("strong");I.textContent="Address: ",F.append(I);var O=document.createElement("span");O.textContent=p[0].address,F.append(O),c.appendChild(F)}c.appendChild(document.createElement("hr"));var k=document.createElement("div");if(p[0].pricePaid.length>0){var T=document.createElement("strong");for(var q in T.textContent="Prices paid:",k.appendChild(T),p[0].pricePaid){var M=document.createElement("div");M.style="margin-left: 10px;";var J=document.createElement("span");J.textContent=p[0].pricePaid[q].date+" - "+p[0].pricePaid[q].amount,M.appendChild(J),M.appendChild(document.createElement("br")),k.appendChild(M)}c.appendChild(k),c.appendChild(document.createElement("hr"))}var N=document.createElement("div");if(p[0].rights.length>0){var R=document.createElement("strong");for(var w in R.textContent="Rights:",N.appendChild(R),p[0].rights){var B=document.createElement("div");B.style="margin-left: 10px;";var z=document.createElement("strong");z.textContent="Type: ",B.appendChild(z);var A=document.createElement("span");if(A.textContent=p[0].rights[w].type,B.appendChild(A),B.appendChild(document.createElement("br")),p[0].rights[w].description){var H=document.createElement("strong");H.textContent="Description: ",B.appendChild(H);var Y=document.createElement("span");Y.textContent=p[0].rights[w].description,B.appendChild(Y),B.appendChild(document.createElement("br"))}if(console.log(p[0].rights[w]),p[0].rights[w].endDate&&p[0].rights[w].type.toLowerCase().includes("leasehold")){var V=document.createElement("strong");V.textContent="End date: ",B.appendChild(V);var W=document.createElement("span");W.textContent=p[0].rights[w].endDate,B.appendChild(W),B.appendChild(document.createElement("br"))}var Z=document.createElement("strong");Z.textContent="Party: ",B.appendChild(Z);var G=document.createElement("span");G.textContent=p[0].rights[w].party.name+" ("+p[0].rights[w].party.type+")",B.appendChild(G),B.appendChild(document.createElement("hr")),N.appendChild(B)}c.appendChild(N)}var U=document.createElement("div");if(p[0].restrictions.length>0){var X=document.createElement("strong");for(restriction in X.textContent="Restrictions:",U.appendChild(X),p[0].restrictions){var K=document.createElement("div");K.style="margin-left: 10px;";var Q=document.createElement("strong");Q.textContent="Type: ",K.appendChild(Q);var $=document.createElement("span");if($.textContent=p[0].restrictions[restriction].type,K.appendChild($),K.appendChild(document.createElement("br")),p[0].restrictions[restriction].description){var ee=document.createElement("strong");ee.textContent="Description: ",K.appendChild(ee);var te=document.createElement("span");te.textContent=p[0].restrictions[restriction].description,K.appendChild(te),K.appendChild(document.createElement("br"))}var re=document.createElement("strong");re.textContent="Party: ",K.appendChild(re);var ne=document.createElement("span");ne.textContent=p[0].restrictions[restriction].party.name+" ("+p[0].restrictions[restriction].party.type+")",K.appendChild(ne),K.appendChild(document.createElement("hr")),U.appendChild(K)}c.appendChild(U)}var ie=document.createElement("div");if(p[0].responsibilities.length>0){var ae=document.createElement("strong");for(responsibility in ae.textContent="Responsibilities:",ie.appendChild(ae),p[0].responsibilities){var oe=document.createElement("div");oe.style="margin-left: 10px;";var se=document.createElement("strong");se.textContent="Type: ",oe.appendChild(se);var pe=document.createElement("span");if(pe.textContent=p[0].responsibilities[responsibility].type,oe.appendChild(pe),oe.appendChild(document.createElement("br")),p[0].responsibilities[responsibility].description){var de=document.createElement("strong");de.textContent="Description: ",oe.appendChild(de);var le=document.createElement("span");le.textContent=p[0].responsibilities[responsibility].description,oe.appendChild(le),oe.appendChild(document.createElement("br"))}var ce=document.createElement("strong");ce.textContent="Party: ",oe.appendChild(ce);var ue=document.createElement("span");ue.textContent=p[0].responsibilities[responsibility].party.name+" ("+p[0].responsibilities[responsibility].party.type+")",oe.appendChild(ue),oe.appendChild(document.createElement("hr")),ie.appendChild(oe)}c.appendChild(ie)}c.style.display="block"}})});for(var p=document.getElementsByName("filter"),d=0;d<p.length;d++)p[d].addEventListener("change",function(e){var t=e.target.value;e.preventDefault(),e.stopPropagation(),s(t)})}});
//# sourceMappingURL=mapbox.js.map