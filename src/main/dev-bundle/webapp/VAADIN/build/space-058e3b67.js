function a(e,n){for(var t=0;t<n.length;t++){const r=n[t];if(typeof r!="string"&&!Array.isArray(r)){for(const o in r)if(o!=="default"&&!(o in e)){const c=Object.getOwnPropertyDescriptor(r,o);c&&Object.defineProperty(e,o,c.get?c:{enumerable:!0,get:()=>r[o]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}var s={},p={get exports(){return s},set exports(e){s=e}};(function(e,n){(function(){ace.require(["ace/snippets/space"],function(t){e&&(e.exports=t)})})()})(p);const f=s,i=a({__proto__:null,default:f},[s]);export{i as s};
