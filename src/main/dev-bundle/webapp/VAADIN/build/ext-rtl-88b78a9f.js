function R(r,u){for(var o=0;o<u.length;o++){const s=u[o];if(typeof s!="string"&&!Array.isArray(s)){for(const l in s)if(l!=="default"&&!(l in r)){const a=Object.getOwnPropertyDescriptor(s,l);a&&Object.defineProperty(r,l,a.get?a:{enumerable:!0,get:()=>s[l]})}}}return Object.freeze(Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}))}var h={},v={get exports(){return h},set exports(r){h=r}};(function(r,u){ace.define("ace/ext/rtl",["require","exports","module","ace/editor","ace/config"],function(o,s,l){var a=[{name:"leftToRight",bindKey:{win:"Ctrl-Alt-Shift-L",mac:"Command-Alt-Shift-L"},exec:function(e){e.session.$bidiHandler.setRtlDirection(e,!1)},readOnly:!0},{name:"rightToLeft",bindKey:{win:"Ctrl-Alt-Shift-R",mac:"Command-Alt-Shift-R"},exec:function(e){e.session.$bidiHandler.setRtlDirection(e,!0)},readOnly:!0}],y=o("../editor").Editor;o("../config").defineOptions(y.prototype,"editor",{rtlText:{set:function(e){e?(this.on("change",p),this.on("changeSelection",m),this.renderer.on("afterRender",f),this.commands.on("exec",g),this.commands.addCommands(a)):(this.off("change",p),this.off("changeSelection",m),this.renderer.off("afterRender",f),this.commands.off("exec",g),this.commands.removeCommands(a),x(this.renderer)),this.renderer.updateFull()}},rtl:{set:function(e){this.session.$bidiHandler.$isRtl=e,e?(this.setOption("rtlText",!1),this.renderer.on("afterRender",f),this.session.$bidiHandler.seenBidi=!0):(this.renderer.off("afterRender",f),x(this.renderer)),this.renderer.updateFull()}}});function m(e,i){var t=i.getSelection().lead;i.session.$bidiHandler.isRtlLine(t.row)&&t.column===0&&(i.session.$bidiHandler.isMoveLeftOperation&&t.row>0?i.getSelection().moveCursorTo(t.row-1,i.session.getLine(t.row-1).length):i.getSelection().isEmpty()?t.column+=1:t.setPosition(t.row,t.column+1))}function g(e){e.editor.session.$bidiHandler.isMoveLeftOperation=/gotoleft|selectleft|backspace|removewordleft/.test(e.command.name)}function p(e,i){var t=i.session;if(t.$bidiHandler.currentRow=null,t.$bidiHandler.isRtlLine(e.start.row)&&e.action==="insert"&&e.lines.length>1)for(var n=e.start.row;n<e.end.row;n++)t.getLine(n+1).charAt(0)!==t.$bidiHandler.RLE&&(t.doc.$lines[n+1]=t.$bidiHandler.RLE+t.getLine(n+1))}function f(e,i){var t=i.session,n=t.$bidiHandler,d=i.$textLayer.$lines.cells,$=i.layerConfig.width-i.layerConfig.padding+"px";d.forEach(function(b){var c=b.element.style;n&&n.isRtlLine(b.row)?(c.direction="rtl",c.textAlign="right",c.width=$):(c.direction="",c.textAlign="",c.width="")})}function x(e){var i=e.$textLayer.$lines;i.cells.forEach(t),i.cellCache.forEach(t);function t(n){var d=n.element.style;d.direction=d.textAlign=d.width=""}}}),function(){ace.require(["ace/ext/rtl"],function(o){r&&(r.exports=o)})}()})(v);const L=h,w=R({__proto__:null,default:L},[h]);export{w as e};
