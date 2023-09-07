function R(d,v){for(var o=0;o<v.length;o++){const g=v[o];if(typeof g!="string"&&!Array.isArray(g)){for(const h in g)if(h!=="default"&&!(h in d)){const c=Object.getOwnPropertyDescriptor(g,h);c&&Object.defineProperty(d,h,c.get?c:{enumerable:!0,get:()=>g[h]})}}}return Object.freeze(Object.defineProperty(d,Symbol.toStringTag,{value:"Module"}))}var x={},b={get exports(){return x},set exports(d){x=d}};(function(d,v){ace.define("ace/mode/elm_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(o,g,h){var c=o("../lib/oop"),u=o("./text_highlight_rules").TextHighlightRules,f=function(){var p=this.createKeywordMapper({keyword:"as|case|class|data|default|deriving|do|else|export|foreign|hiding|jsevent|if|import|in|infix|infixl|infixr|instance|let|module|newtype|of|open|then|type|where|_|port|λ"},"identifier"),e=/\\(\d+|['"\\&trnbvf])/,t=/[a-z_]/.source,n=/[A-Z]/.source,a=/[a-z_A-Z0-9']/.source;this.$rules={start:[{token:"string.start",regex:'"',next:"string"},{token:"string.character",regex:"'(?:"+e.source+"|.)'?"},{regex:/0(?:[xX][0-9A-Fa-f]+|[oO][0-7]+)|\d+(\.\d+)?([eE][-+]?\d*)?/,token:"constant.numeric"},{token:"comment",regex:"--.*"},{token:"keyword",regex:/\.\.|\||:|=|\\|"|->|<-|\u2192/},{token:"keyword.operator",regex:/[-!#$%&*+.\/<=>?@\\^|~:\u03BB\u2192]+/},{token:"operator.punctuation",regex:/[,;`]/},{regex:n+a+"+\\.?",token:function(r){return r[r.length-1]=="."?"entity.name.function":"constant.language"}},{regex:"^"+t+a+"+",token:function(r){return"constant.language"}},{token:p,regex:"[\\w\\xff-\\u218e\\u2455-\\uffff]+\\b"},{regex:"{-#?",token:"comment.start",onMatch:function(r,s,l){return this.next=r.length==2?"blockComment":"docComment",this.token}},{token:"variable.language",regex:/\[markdown\|/,next:"markdown"},{token:"paren.lparen",regex:/[\[({]/},{token:"paren.rparen",regex:/[\])}]/}],markdown:[{regex:/\|\]/,next:"start"},{defaultToken:"string"}],blockComment:[{regex:"{-",token:"comment.start",push:"blockComment"},{regex:"-}",token:"comment.end",next:"pop"},{defaultToken:"comment"}],docComment:[{regex:"{-",token:"comment.start",push:"docComment"},{regex:"-}",token:"comment.end",next:"pop"},{defaultToken:"doc.comment"}],string:[{token:"constant.language.escape",regex:e},{token:"text",regex:/\\(\s|$)/,next:"stringGap"},{token:"string.end",regex:'"',next:"start"},{defaultToken:"string"}],stringGap:[{token:"text",regex:/\\/,next:"string"},{token:"error",regex:"",next:"start"}]},this.normalizeRules()};c.inherits(f,u),g.ElmHighlightRules=f}),ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(o,g,h){var c=o("../../lib/oop"),u=o("../../range").Range,f=o("./fold_mode").FoldMode,p=g.FoldMode=function(e){e&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+e.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+e.end)))};c.inherits(p,f),function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/,this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/,this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/,this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/,this._getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(e,t,n){var a=e.getLine(n);if(this.singleLineBlockCommentRe.test(a)&&!this.startRegionRe.test(a)&&!this.tripleStarBlockCommentRe.test(a))return"";var r=this._getFoldWidgetBase(e,t,n);return!r&&this.startRegionRe.test(a)?"start":r},this.getFoldWidgetRange=function(e,t,n,a){var r=e.getLine(n);if(this.startRegionRe.test(r))return this.getCommentRegionBlock(e,r,n);var i=r.match(this.foldingStartMarker);if(i){var s=i.index;if(i[1])return this.openingBracketBlock(e,i[1],n,s);var l=e.getCommentFoldRange(n,s+i[0].length,1);return l&&!l.isMultiLine()&&(a?l=this.getSectionRange(e,n):t!="all"&&(l=null)),l}if(t!=="markbegin"){var i=r.match(this.foldingStopMarker);if(i){var s=i.index+i[0].length;return i[1]?this.closingBracketBlock(e,i[1],n,s):e.getCommentFoldRange(n,s,-1)}}},this.getSectionRange=function(e,t){var n=e.getLine(t),a=n.search(/\S/),r=t,s=n.length;t=t+1;for(var l=t,i=e.getLength();++t<i;){n=e.getLine(t);var k=n.search(/\S/);if(k!==-1){if(a>k)break;var m=this.getFoldWidgetRange(e,"all",t);if(m){if(m.start.row<=r)break;if(m.isMultiLine())t=m.end.row;else if(a==k)break}l=t}}return new u(r,s,l,e.getLine(l).length)},this.getCommentRegionBlock=function(e,t,n){for(var a=t.search(/\s*$/),r=e.getLength(),s=n,l=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,i=1;++n<r;){t=e.getLine(n);var k=l.exec(t);if(k&&(k[1]?i--:i++,!i))break}var m=n;if(m>s)return new u(s,a,m,t.length)}}.call(p.prototype)}),ace.define("ace/mode/elm",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/elm_highlight_rules","ace/mode/folding/cstyle"],function(o,g,h){var c=o("../lib/oop"),u=o("./text").Mode,f=o("./elm_highlight_rules").ElmHighlightRules,p=o("./folding/cstyle").FoldMode,e=function(){this.HighlightRules=f,this.foldingRules=new p,this.$behaviour=this.$defaultBehaviour};c.inherits(e,u),function(){this.lineCommentStart="--",this.blockComment={start:"{-",end:"-}",nestable:!0},this.$id="ace/mode/elm"}.call(e.prototype),g.Mode=e}),function(){ace.require(["ace/mode/elm"],function(o){d&&(d.exports=o)})}()})(b);const M=x,_=R({__proto__:null,default:M},[x]);export{_ as m};
