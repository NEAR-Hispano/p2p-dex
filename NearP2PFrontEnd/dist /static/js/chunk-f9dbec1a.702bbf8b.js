(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-f9dbec1a"],{"17d3":function(t,e,i){},"3f9a":function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("exception-page",{style:"min-height: "+t.minHeight,attrs:{"home-route":"/dashboard/workplace",type:"403"}})},c=[],n=i("5530"),o=i("7832"),a=i("5880"),r={name:"Exp403",components:{ExceptionPage:o["a"]},computed:Object(n["a"])(Object(n["a"])({},Object(a["mapState"])("setting",["pageMinHeight"])),{},{minHeight:function(){return this.pageMinHeight?this.pageMinHeight+"px":"100vh"}})},p=r,h=i("2877"),u=Object(h["a"])(p,s,c,!1,null,"1eb6a240",null);e["default"]=u.exports},7832:function(t,e,i){"use strict";var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"exception-page"},[i("div",{staticClass:"img"},[i("img",{attrs:{src:t.config[t.type].img}})]),i("div",{staticClass:"content"},[i("h1",[t._v(t._s(t.config[t.type].title))]),i("div",{staticClass:"desc"},[t._v(t._s(t.config[t.type].desc))]),i("div",{staticClass:"action"},[i("a-button",{attrs:{type:"primary"},on:{click:t.backHome}},[t._v("Return to the home page")])],1)])])},c=[],n={403:{img:"https://biterchecker.com/dv/portal/wZcnGqRDyhPOEYFcZDnb.svg",title:"403",desc:"Sorry, you don't have access to this page"},404:{img:"https://biterchecker.com/dv/portal/KpnpchXsobRgLElEozzI.svg",title:"404",desc:"Sorry, the page you're visiting doesn't exist or is still under development"},500:{img:"https://biterchecker.com/dv/portal/RVRUAYdCGeYNBWoKiIwB.svg",title:"500",desc:"Sorry, there was an error with the server"}},o=n,a={name:"ExceptionPage",props:["type","homeRoute"],data:function(){return{config:o}},methods:{backHome:function(){this.homeRoute&&this.$router.push(this.homeRoute),this.$emit("backHome",this.type)}}},r=a,p=(i("d25d"),i("2877")),h=Object(p["a"])(r,s,c,!1,null,"7eaae2f9",null);e["a"]=h.exports},d25d:function(t,e,i){"use strict";var s=i("17d3"),c=i.n(s);c.a}}]);