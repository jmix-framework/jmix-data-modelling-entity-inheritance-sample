function _(m,y){for(var b=0;b<y.length;b++){const r=y[b];if(typeof r!="string"&&!Array.isArray(r)){for(const I in r)if(I!=="default"&&!(I in m)){const T=Object.getOwnPropertyDescriptor(r,I);T&&Object.defineProperty(m,I,T.get?T:{enumerable:!0,get:()=>r[I]})}}}return Object.freeze(Object.defineProperty(m,Symbol.toStringTag,{value:"Module"}))}var w={},z={get exports(){return w},set exports(m){w=m}};(function(m,y){ace.define("ace/ext/whitespace",["require","exports","module","ace/lib/lang"],function(b,r,I){var T=b("../lib/lang");r.$detectIndentation=function(e,n){for(var t=[],l=[],s=0,c=0,o=Math.min(e.length,1e3),a=0;a<o;a++){var i=e[a];if(/^\s*[^*+\-\s]/.test(i)){if(i[0]=="	")s++,c=-Number.MAX_VALUE;else{var u=i.match(/^ */)[0].length;if(u&&i[u]!="	"){var f=u-c;f>0&&!(c%f)&&!(u%f)&&(l[f]=(l[f]||0)+1),t[u]=(t[u]||0)+1}c=u}for(;a<o&&i[i.length-1]=="\\";)i=e[a++]}}function d(S){for(var $=0,L=S;L<t.length;L+=S)$+=t[L]||0;return $}for(var A=l.reduce(function(S,$){return S+$},0),v={score:0,length:0},h=0,a=1;a<12;a++){var g=d(a);a==1?(h=g,g=t[1]?.9:.8,t.length||(g=0)):g/=h,l[a]&&(g+=l[a]/A),g>v.score&&(v={score:g,length:a})}if(v.score&&v.score>1.4)var p=v.length;if(s>h+1)return(p==1||h<s/4||v.score<1.8)&&(p=void 0),{ch:"	",length:p};if(h>s+1)return{ch:" ",length:p}},r.detectIndentation=function(e){var n=e.getLines(0,1e3),t=r.$detectIndentation(n)||{};return t.ch&&e.setUseSoftTabs(t.ch==" "),t.length&&e.setTabSize(t.length),t},r.trimTrailingSpace=function(e,n){var t=e.getDocument(),l=t.getAllLines(),s=n&&n.trimEmpty?-1:0,c=[],o=-1;n&&n.keepCursorPosition&&(e.selection.rangeCount?e.selection.rangeList.ranges.forEach(function(A,v,h){var g=h[v+1];g&&g.cursor.row==A.cursor.row||c.push(A.cursor)}):c.push(e.selection.getCursor()),o=0);for(var a=c[o]&&c[o].row,i=0,u=l.length;i<u;i++){var f=l[i],d=f.search(/\s+$/);i==a&&(d<c[o].column&&d>s&&(d=c[o].column),o++,a=c[o]?c[o].row:-1),d>s&&t.removeInLine(i,d,f.length)}},r.convertIndentation=function(e,n,t){var l=e.getTabString()[0],s=e.getTabSize();t||(t=s),n||(n=l);for(var c=n=="	"?n:T.stringRepeat(n,t),o=e.doc,a=o.getAllLines(),i={},u={},f=0,d=a.length;f<d;f++){var A=a[f],v=A.match(/^\s*/)[0];if(v){var h=e.$getStringScreenWidth(v)[0],g=Math.floor(h/s),p=h%s,S=i[g]||(i[g]=T.stringRepeat(c,g));S+=u[p]||(u[p]=T.stringRepeat(" ",p)),S!=v&&(o.removeInLine(f,0,v.length),o.insertInLine({row:f,column:0},S))}}e.setTabSize(t),e.setUseSoftTabs(n==" ")},r.$parseStringArg=function(e){var n={};/t/.test(e)?n.ch="	":/s/.test(e)&&(n.ch=" ");var t=e.match(/\d+/);return t&&(n.length=parseInt(t[0],10)),n},r.$parseArg=function(e){return e?typeof e=="string"?r.$parseStringArg(e):typeof e.text=="string"?r.$parseStringArg(e.text):e:{}},r.commands=[{name:"detectIndentation",description:"Detect indentation from content",exec:function(e){r.detectIndentation(e.session)}},{name:"trimTrailingSpace",description:"Trim trailing whitespace",exec:function(e,n){r.trimTrailingSpace(e.session,n)}},{name:"convertIndentation",description:"Convert indentation to ...",exec:function(e,n){var t=r.$parseArg(n);r.convertIndentation(e.session,t.ch,t.length)}},{name:"setIndentation",description:"Set indentation",exec:function(e,n){var t=r.$parseArg(n);t.length&&e.session.setTabSize(t.length),t.ch&&e.session.setUseSoftTabs(t.ch==" ")}}]}),function(){ace.require(["ace/ext/whitespace"],function(b){m&&(m.exports=b)})}()})(z);const O=w,W=_({__proto__:null,default:O},[w]);export{W as e};
