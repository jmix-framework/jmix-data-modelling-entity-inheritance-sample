function f(e,s){for(var r=0;r<s.length;r++){const t=s[r];if(typeof t!="string"&&!Array.isArray(t)){for(const o in t)if(o!=="default"&&!(o in e)){const c=Object.getOwnPropertyDescriptor(t,o);c&&Object.defineProperty(e,o,c.get?c:{enumerable:!0,get:()=>t[o]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}var n={},i={get exports(){return n},set exports(e){n=e}};(function(e,s){(function(){ace.require(["ace/snippets/visualforce"],function(r){e&&(e.exports=r)})})()})(i);const a=n,u=f({__proto__:null,default:a},[n]);export{u as v};
