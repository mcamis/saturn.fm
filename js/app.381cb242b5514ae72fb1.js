!function(e){function t(t){for(var r,o,s=t[0],u=t[1],c=t[2],p=0,f=[];p<s.length;p++)o=s[p],i[o]&&f.push(i[o][0]),i[o]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(e[r]=u[r]);for(l&&l(t);f.length;)f.shift()();return a.push.apply(a,c||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],r=!0,s=1;s<n.length;s++){var u=n[s];0!==i[u]&&(r=!1)}r&&(a.splice(t--,1),e=o(o.s=n[0]))}return e}var r={},i={0:0},a=[];function o(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=r,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="./";var s=window.webpackJsonp=window.webpackJsonp||[],u=s.push.bind(s);s.push=t,s=s.slice();for(var c=0;c<s.length;c++)t(s[c]);var l=u;a.push([69,1]),n()}([,,,,,function(e,t,n){e.exports=n.p+"songs/Rhyme.mp3"},function(e,t,n){e.exports=n.p+"songs/No-Refuge.mp3"},,,function(e,t,n){e.exports=n.p+"images/ymo.jpg"},function(e,t,n){e.exports=n.p+"songs/Higher.mp3"},,function(e,t,n){e.exports=n.p+"images/play-pause.png"},,,,,,,,,,,,,,,function(e,t,n){e.exports=n.p+"images/disc.png"},function(e,t,n){e.exports=n.p+"images/more.png"},function(e,t,n){e.exports=n.p+"images/hide.png"},function(e,t,n){e.exports=n.p+"images/rwd.png"},function(e,t,n){e.exports=n.p+"images/ffwd.png"},function(e,t,n){e.exports=n.p+"images/stop.png"},function(e,t,n){e.exports=n.p+"images/repeat.png"},function(e,t,n){e.exports=n.p+"images/texture.gif"},function(e,t,n){e.exports=n.p+"images/pink.gif"},function(e,t,n){e.exports=n.p+"images/orb-alpha.png"},function(e,t,n){e.exports=n.p+"images/test.png"},function(e,t,n){e.exports=n.p+"songs/button-press.mp3"},function(e,t,n){e.exports=n.p+"songs/button-highlight.mp3"},,,function(e,t,n){e.exports=n.p+"images/time.png"},function(e,t,n){e.exports=n.p+"images/track.png"},,,,,,,,,function(e,t,n){e.exports=n.p+"images/globe.gif"},,,,,,,,,,,,,,,,function(e,t,n){},function(e,t,n){"use strict";n.r(t);var r=n(0),i=n.n(r),a=n(24),o=n.n(a),s=n(2),u=n.n(s),c=n(13);function l(e){Object.getOwnPropertyNames(e.constructor.prototype).forEach(function(t){"function"==typeof e[t]&&(e[t]=e[t].bind(e))})}var p=function(e){return At.dispatch({type:"SET_CURRENT_TRACK",data:{trackIndex:e}})},f=function(e){return At.dispatch({type:"ADD_TRACKS",data:{tracks:e}})},h=n(5),d=n.n(h),m=n(6),y=n.n(m),v=n(9),b=n.n(v),g=function(e){return e.reduce(function(e,t){return e+t},0)/e.length},w=function(){return window.innerWidth>1200?1200:window.innerWidth},k=function(e){var t=Math.trunc(e/60).toString().padStart(2,"0"),n=Math.trunc(e%60).toString().padStart(2,"0");return"".concat(t,":").concat(n)},E=function(){return 2*Math.random()+4},S=function(){return 1e3*Math.random()-500};d.a,y.a,b.a,y.a,d.a,b.a,y.a,d.a,b.a,y.a,d.a,b.a;function O(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var T,x=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.audio=t,this.leftChannel=[],this.rightChannel=[],this.setupAudioNodes(),l(this)}var t,n,r;return t=e,(n=[{key:"setupAudioNodes",value:function(){var e=window.AudioContext||window.webkitAudioContext;this.audioContext=new e;var t=this.createAnalyserNode(),n=this.createAnalyserNode(),r=this.audioContext.createChannelSplitter(2);this.audioContext.createMediaElementSource(this.audio).connect(r),r.connect(t,0),r.connect(n,1),this.dataArrayLeft=new Uint8Array(t.frequencyBinCount),this.dataArrayRight=new Uint8Array(n.frequencyBinCount),this.analyserLeft=t,this.analyserRight=n}},{key:"createAnalyserNode",value:function(){var e=this.audioContext.createAnalyser();return e.smoothingTimeConstant=0,e.fftSize=128,e.connect(this.audioContext.destination),e}},{key:"startAnalysis",value:function(){var e=this.analyserLeft,t=this.analyserRight,n=this.dataArrayLeft,r=this.dataArrayRight;e.getByteFrequencyData(n),t.getByteFrequencyData(r),this.leftChannel=n,this.rightChannel=r,this.frameId=requestAnimationFrame(this.startAnalysis)}},{key:"startAnalyser",value:function(){this.frameId=this.frameId||requestAnimationFrame(this.startAnalysis)}},{key:"pauseAnalyser",value:function(){cancelAnimationFrame(this.frameId),this.frameId=void 0}},{key:"start",value:function(){"suspended"===this.audioContext.state&&this.audioContext.resume(),this.startAnalyser()}},{key:"pause",value:function(){this.pauseAnalyser(),this.audioContext.suspend()}},{key:"stop",value:function(){this.pauseAnalyser(),this.audioContext.close()}},{key:"averageFFT",get:function(){return[g(this.leftChannel),g(this.rightChannel)]}},{key:"rawFFT",get:function(){return[this.leftChannel,this.rightChannel]}}])&&O(t.prototype,n),r&&O(t,r),e}(),C=n(10),A=n.n(C);function P(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function D(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){M(e,t,n[t])})}return e}function M(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var j={currentTrack:null,loading:!1,repeat:"off",currentTime:k(0),playing:!1,paused:!1,playlist:[A.a,d.a,y.a],tracks:(T={},M(T,A.a,{name:A.a,file:A.a,trackNumber:3,album:"Velocity",artist:"GRRL",title:"Higher"}),M(T,d.a,{file:d.a,trackNumber:1,album:"N/A",artist:"Professor Kliq",title:"Rhyme"}),M(T,y.a,{file:y.a,trackNumber:2,album:"OP-1 Outtakes",artist:"Professor Kliq",title:"NoRefuge"}),T)};function R(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var _=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.audioElement=new Audio,this.audioElement.crossOrigin="anonymous",this.audioElement.volume=.75,this.repeat="off",this.reduxState=j,this.changeSrc=!0,this.analyser=new x(this.audioElement),this.setupEventListeners(),this.syncManagerWithStore(),l(this)}var t,n,r;return t=e,(n=[{key:"syncManagerWithStore",value:function(){var e=this;At.subscribe(function(){e.reduxState=At.getState().audio,e.reduxState.currentTrack!==e.currentTrack?(e.currentTrack=e.reduxState.currentTrack,e.changeTrack=!0):e.changeTrack=!1})}},{key:"togglePlay",value:function(){var e=this,t=this.audioElement;t.src||p(0),t.paused||t.ended?setTimeout(function(){return e.playAndReport()},500):t.pause()}},{key:"playAndReport",value:function(){var e=this,t=this.reduxState,n=t.tracks,r=t.playlist,i=t.currentTrack,a=n[r[void 0===i?0:i]].file;if(a instanceof File){var o=new FileReader;o.onload=function(t){e.audioElement.src=t.target.result,e.audioElement.play()},o.readAsDataURL(a)}else this.audioElement.src&&this.audioElement.src.includes(a)||(this.audioElement.src=a),this.audioElement.play()}},{key:"loadNext",value:function(e){var t=this.reduxState.currentTrack+1;t>=this.reduxState.playlist.length?(p(0),e&&"context"!==this.reduxState.repeat||this.playAndReport()):(p(t),this.playAndReport())}},{key:"loadPrevious",value:function(){var e=this.reduxState.currentTrack;p(e?e-1:0),this.playAndReport()}},{key:"setupEventListeners",value:function(){var e=this;this.audioElement.addEventListener("loadstart",function(){return At.dispatch({type:"LOADING_STARTED",data:{loading:!0}})}),this.audioElement.addEventListener("canplaythrough",function(){return At.dispatch({type:"LOADING_FINISHED",data:{loading:!1}})}),this.audioElement.addEventListener("play",function(){At.dispatch({type:"PLAYING"}),e.analyser.start()}),this.audioElement.addEventListener("pause",function(){At.dispatch({type:"PAUSED"}),e.analyser.pause()}),this.audioElement.addEventListener("ended",function(){"track"===e.reduxState.repeat?e.togglePlay():e.loadNext(!0)})}},{key:"nextTrack",value:function(){this.loadNext()}},{key:"previousTrack",value:function(){this.audioElement.currentTime>=3?this.audioElement.currentTime=0:this.loadPrevious()}},{key:"pause",value:function(){this.audioElement.pause()}},{key:"stop",value:function(){console.log("stop"),this.audioElement.pause(),this.audioElement.currentTime=0}},{key:"toggleRepeat",value:function(){var e,t;switch(this.reduxState.repeat){case"off":e="track";break;case"track":e="context";break;default:e="off"}t=e,At.dispatch({type:"TOGGLE_REPEAT",data:{repeat:t}})}},{key:"analyserFFT",get:function(){return this.analyser.averageFFT}},{key:"rawFFT",get:function(){return this.analyser.rawFFT}},{key:"currentTime",get:function(){return this.audioElement.currentTime}}])&&R(t.prototype,n),r&&R(t,r),e}(),N=n(1),F=n(11),L=n.n(F),I=n(4),z=n.n(I),B=function(e,t){var n,r,i,a=142.5-(n=.75*t,r=Math.log(1),i=(Math.log(142)-r)/100,Math.exp(r+i*(n-0))),o=new N.Color("hsl(".concat(a>0?a:0,", 100%, 48%)"));e.material.color.set(o)},q=function(e,t,n){B(e,t);var r=.006*t+.5,i=r<1.5?r:1.5;return e.morphTargetInfluences[0]=.007*t>1?1:.007*t,new I.Tween(e.scale).to({x:i,y:i,z:i},50).easing(I.Easing.Quadratic.Out).start()},H=function(e,t){return Math.random()*(e-t)+t},G=function(e,t){var n=t?-Math.abs(.03):.03,r=t?-Math.abs(.01):.01;e.rotateX(H(n,r)),e.rotateY(H(n,r))},V=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;e.rotateX(.0025*t),e.rotateY(.0025*t)};function W(e){return(W="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function U(e){return(U="function"==typeof Symbol&&"symbol"===W(Symbol.iterator)?function(e){return W(e)}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":W(e)})(e)}function X(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],r=!0,i=!1,a=void 0;try{for(var o,s=e[Symbol.iterator]();!(r=(o=s.next()).done)&&(n.push(o.value),!t||n.length!==t);r=!0);}catch(e){i=!0,a=e}finally{try{r||null==s.return||s.return()}finally{if(i)throw a}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function Y(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function K(e){return(K=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Z(e,t){return(Z=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Q(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var J=function(e){function t(e){var n,r,i;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),r=this,i=K(t).call(this,e),(n=!i||"object"!==U(i)&&"function"!=typeof i?Q(r):i).debouncedResize=null,n.loader=new L.a,l(Q(Q(n))),window.addEventListener("resize",function(){clearTimeout(n.debouncedResize),n.debouncedResize=setTimeout(n.onResize,250)}),n}var n,a,o;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Z(e,t)}(t,r["PureComponent"]),n=t,(a=[{key:"componentDidMount",value:function(){this.setupScene()}},{key:"onResize",value:function(){var e=w(),t=.75*e;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)}},{key:"setupScene",value:function(){var e=w(),t=.75*e,n=new N.Scene,r=new N.PerspectiveCamera(20,e/t,1,1200);r.position.z=45,r.position.y=-27;var i=new N.AmbientLight(16777215,.35),a=new N.DirectionalLight(16777215,.7);a.position.set(0,500,900),n.add(i,a);var o=new N.WebGLRenderer({alpha:!0,antialias:!1}),s=window.devicePixelRatio;o.setPixelRatio(1===s?.65*s:.18*s),o.setSize(e,t),this.scene=n,this.camera=r,this.renderer=o,this.setupCube("leftCube",[-7,-30,0]),this.setupCube("rightCube",[7,-30,0]),this.mount.appendChild(this.renderer.domElement)}},{key:"setupCube",value:function(e,t){var n=this,r=X(t,3),i=r[0],a=r[1],o=r[2];this.loader.load("/public/models/cube.gltf",function(t){var r=X(t.scene.children,3)[2];r.material.color=new N.Color("hsl(143, 100%, 48%)"),r.position.set(i,a,o),n[e]=r,n.scene.add(r),"rightCube"===e&&requestAnimationFrame(n.animate)})}},{key:"addCubes",value:function(){var e=new N.BoxGeometry(1,1,1,1,1,1),t=new N.MeshLambertMaterial({color:new N.Color("hsl(143, 100%, 48%)")}),n=new N.MeshLambertMaterial({color:new N.Color("hsl(143, 100%, 48%)")}),r=new N.Mesh(e,t),i=new N.Mesh(e,n);r.position.set(-Math.abs(7),-30,0),i.position.set(7,-30,0),i.rotateY(.75),i.rotateX(.015),r.rotateX(.015),this.leftCube=r,this.rightCube=i,this.scene.add(r,i)}},{key:"animate",value:function(){if(this.props.playing){var e=X(this.props.audioManager.analyserFFT,2),t=e[0],n=e[1],r=X(this.props.audioManager.rawFFT,2);r[0],r[1];q(this.leftCube,t),q(this.rightCube,n),G(this.leftCube),G(this.rightCube,-1)}else V(this.leftCube),V(this.rightCube,-1);this.renderer.render(this.scene,this.camera),requestAnimationFrame(this.animate)}},{key:"render",value:function(){var e=this;return i.a.createElement("div",{className:"cubes",ref:function(t){e.mount=t}})}}])&&Y(n.prototype,a),o&&Y(n,o),t}();J.propTypes={playing:u.a.bool.isRequired};var $=J,ee=n(27),te=n.n(ee),ne=n(28),re=n.n(ne),ie=n(29),ae=n.n(ie),oe=n(30),se=n.n(oe),ue=n(12),ce=n.n(ue),le=n(31),pe=n.n(le),fe=n(32),he=n.n(fe),de=n(33),me=n.n(de),ye=(n(52),n(34)),ve=n.n(ye),be=n(35),ge=n.n(be),we=n(36),ke=n.n(we),Ee=new N.CylinderGeometry(1.45,1.45,.35,12,1,!0),Se=(new N.TextureLoader).load(ve.a),Oe=(new N.TextureLoader).load(ge.a);Se.magFilter=N.NearestFilter,Oe.magFilter=N.NearestFilter;var Te=new N.MeshBasicMaterial({lights:!1,side:N.DoubleSide,transparent:!0,map:Se}),xe=(new N.TextureLoader).load(ke.a);xe.magFilter=N.NearestFilter;var Ce=new N.MeshBasicMaterial({lights:!1,side:N.DoubleSide,transparent:!0,map:Oe}),Ae=new N.PlaneGeometry(2,2,1,1);function Pe(e,t){var n,r,i,a,o,s,u,c,l,p,f;n=e.position,r=t,i={duration:e.material.userData.animationDuration,delay:e.material.userData.animationDelay,easing:z.a.Easing.Quadratic.InOut},a=r.x,o=r.y,s=r.z,u=i.easing,c=void 0===u?z.a.Easing.Quadratic.In:u,l=i.delay,p=i.duration,f=void 0===p?2e3:p,new z.a.Tween(n).to({x:a,y:o,z:s},f).easing(c).delay(l).start()}var De=n(37),Me=n.n(De),je=n(38),Re=n.n(je),_e=n(39),Ne=n.n(_e);function Fe(e){return(Fe="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Le(e){return(Le="function"==typeof Symbol&&"symbol"===Fe(Symbol.iterator)?function(e){return Fe(e)}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":Fe(e)})(e)}function Ie(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function ze(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],r=!0,i=!1,a=void 0;try{for(var o,s=e[Symbol.iterator]();!(r=(o=s.next()).done)&&(n.push(o.value),!t||n.length!==t);r=!0);}catch(e){i=!0,a=e}finally{try{r||null==s.return||s.return()}finally{if(i)throw a}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function Be(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function qe(e){return(qe=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function He(e,t){return(He=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Ge(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var Ve=function(e){function t(e){var n,r,i;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),r=this,(n=!(i=qe(t).call(this,e))||"object"!==Le(i)&&"function"!=typeof i?Ge(r):i).timeOut=null,n.planes=[],n.buttonEffect=new Audio,n.buttonEffect.src=Re.a,n.highlightEffect=new Audio,n.highlightEffect.src=Ne.a,n.state={activeButton:"play",allowToggle:!1},n.clock=new N.Clock,n.buttons=["disc","settings","hide","rewind","play","fastforward","repeat","stop","advanced"],l(Ge(Ge(n))),n}var n,a,o;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&He(e,t)}(t,r["PureComponent"]),n=t,(a=[{key:"componentDidMount",value:function(){this.setupScene(),this.setupKeyboardListeners()}},{key:"componentDidUpdate",value:function(e,t){if(this.state.activeButton!==t.activeButton){var n=ze(this.menuElements[this.state.activeButton].position,2),r=n[0],i=n[1];this.orbits.pink.position.set(r,i,2),this.orbits.purple.position.set(r,i,2.03)}}},{key:"onResize",value:function(){var e=window.innerWidth>1200?1200:window.innerWidth,t=.75*e;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)}},{key:"onMouseDown",value:function(e){if(e.stopPropagation(),!this.props.hidden){this.raycaster.setFromCamera(this.mouse,this.camera);var t=this.raycaster.intersectObjects(this.planes);if(t.length>0){var n=t[0].object.material.userData.onClick;this.buttonEffect.currentTime=0,this.buttonEffect.play(),n()}}}},{key:"onMouseMove",value:function(e){var t=this.renderer.domElement.getBoundingClientRect();this.mouse.x=(e.clientX-1.5*t.left)/(t.width-t.left)*2-1,this.mouse.y=-(e.clientY-t.top)/(t.bottom-t.top)*2+1,this.manageActiveButton()}},{key:"setupKeyboardListeners",value:function(){var e=this;window.addEventListener("keydown",function(t){var n=e.buttons.indexOf(e.state.activeButton);switch(t.code){case"ArrowRight":2!==n&&5!==n&&(n+=1);break;case"ArrowLeft":3!==n&&6!==n&&(n-=1);break;case"ArrowUp":n-=3;break;case"ArrowDown":n+=3;break;case"Enter":e.menuElements[e.buttons[n]].onClick();break;default:n=-1}n>=0&&n<e.buttons.length&&e.setState({activeButton:e.buttons[n]})})}},{key:"setupScene",value:function(){var e=window.innerWidth>1200?1200:window.innerWidth,t=.75*e,n=new N.Scene,r=new N.PerspectiveCamera(2.5,e/t,1,500);r.position.z=360,r.position.y=.5;var i=new N.WebGLRenderer({alpha:!0,antialias:!1});i.setSize(e,t),this.mouse=new N.Vector2,this.raycaster=new N.Raycaster,this.scene=n,this.camera=r,this.renderer=i,this.mount.appendChild(this.renderer.domElement),this.createMenuElements(),this.setupOrbAnimation(),this.setupEventListeners(),requestAnimationFrame(this.animate)}},{key:"setupEventListeners",value:function(){var e=this,t=this.renderer.domElement;window.addEventListener("resize",function(){clearTimeout(e.timeOut),e.timeOut=setTimeout(e.onResize,250)}),t.addEventListener("mousedown",function(t){return e.onMouseDown(t)},!1),t.addEventListener("mousemove",function(t){return e.onMouseMove(t)},!1)}},{key:"setupOrbAnimation",value:function(){var e=(new N.TextureLoader).load(Me.a);e.magFilter=N.NearestFilter,e.minFilter=N.NearestFilter,this.textureAnimator=new this.TextureAnimator(e,461,1,461,40);var t=new N.MeshBasicMaterial({map:e,transparent:!0,name:"advanced",userData:{animationDelay:900,animationDuration:300}}),n=new N.Mesh(Ae,t);n.position.set(2.25,-4.3,1),this.planes.push(n),this.scene.add(n)}},{key:"TextureAnimator",value:function(e,t,n,r,i){this.tilesHorizontal=t,this.tilesVertical=n,this.numberOfTiles=r,e.wrapS=e.wrapT=N.RepeatWrapping,e.repeat.set(1/this.tilesHorizontal,1/this.tilesVertical),this.tileDisplayDuration=i,this.currentDisplayTime=0,this.currentTile=0,this.update=function(t){for(this.currentDisplayTime+=t;this.currentDisplayTime>this.tileDisplayDuration;){this.currentDisplayTime-=this.tileDisplayDuration,this.currentTile++,this.currentTile===this.numberOfTiles&&(this.currentTile=0);var n=this.currentTile%this.tilesHorizontal;e.offset.x=n/this.tilesHorizontal;var r=Math.floor(this.currentTile/this.tilesHorizontal);e.offset.y=r/this.tilesVertical}}}},{key:"placeOrbitsInScene",value:function(){var e=new N.Mesh(Ee,Ce),t=new N.Mesh(Ee,Te);e.position.set(0,-2.15,2),e.rotateX(.35),e.rotateZ(-.8),t.position.set(0,-2.15,2.03),t.rotateZ(.8),t.rotateX(.25),t.rotateY(1),this.orbits={pink:e,purple:t},this.scene.add(e,t)}},{key:"placeInScene",value:function(e){var t=e.name,n=void 0===t?"":t,r=e.position,i=e.onClick,a=e.mapSrc,o=e.animationDelay,s=e.animationDuration,u=ze(r,3),c=u[0],l=u[1],p=u[2],f=(new N.TextureLoader).load(a);f.magFilter=N.NearestFilter,f.minFilter=N.NearestFilter;var h=new N.MeshBasicMaterial({map:f,transparent:!0,name:n,userData:{onClick:i,animationDelay:o,originalPosition:r,animationDuration:s},alphaMap:xe}),d=new N.Mesh(Ae,h);d.position.set(c,l,p),this.planes.push(d),this.scene.add(d)}},{key:"orbitButton",value:function(){var e=this.orbits,t=e.pink,n=e.purple;this.props.hidden?(t.material.visible=!1,n.material.visible=!1):(t.material.visible=!0,n.material.visible=!0,t.rotateY(-.065),n.rotateY(.07))}},{key:"manageActiveButton",value:function(){this.raycaster.setFromCamera(this.mouse,this.camera);var e=this.raycaster.intersectObjects(this.planes);if(e.length>0){var t=e[0].object.material.name;t&&t!==this.state.activeButton&&this.setState({activeButton:t}),document.body.classList.add("pointer")}else document.body.classList.remove("pointer")}},{key:"hideMenu",value:function(){var e=this;if(this.props.hidden)return this.showIfHidden();this.planes.forEach(function(e){var t=e.position,n=t.x,r=t.y,i=t.z;Pe(e,new N.Vector3(n,r-10,i))}),this.props.hideDash(),setTimeout(function(){return e.setState({allowToggle:!0})},1400)}},{key:"animate",value:function(){z.a.update(),this.orbitButton(),this.renderer.render(this.scene,this.camera);var e=this.clock.getDelta();this.textureAnimator.update(1e3*e),requestAnimationFrame(this.animate)}},{key:"showIfHidden",value:function(){this.state.allowToggle&&this.props.hidden&&(this.props.showIfHidden(),this.setState({allowToggle:!1}),this.planes.forEach(function(e){var t=e.position,n=t.x,r=t.y,i=t.z;Pe(e,new N.Vector3(n,r+10,i))}))}},{key:"getToolTip",value:function(){var e=this.props,t=e.playing,n=e.paused,r=e.repeat;return{disc:function(){return i.a.createElement("p",null,"Choose Songs")},settings:function(){return i.a.createElement("p",null,"System Settings")},hide:function(){return i.a.createElement("p",null,"Hide")},rewind:function(){return i.a.createElement("p",null,"Rewind")},fastforward:function(){return i.a.createElement("p",null,"Fast Forward")},play:function(){var e=i.a.createElement("p",null,"Play / Pause");return t?e=i.a.createElement("p",null,i.a.createElement("strong",null,"Play"),"/ Pause"):n&&(e=i.a.createElement("p",null,"Play / ",i.a.createElement("strong",null,"Pause"))),e},repeat:function(){var e=i.a.createElement("p",null,"Repeat: 1 / All / ",i.a.createElement("strong",null,"Off"));return"track"===r?e=i.a.createElement("p",null,"Repeat: ",i.a.createElement("strong",null,"1")," / All / Off"):"context"===r&&(e=i.a.createElement("p",null,"Repeat: 1 / ",i.a.createElement("strong",null,"All")," / Off")),e},stop:function(){return i.a.createElement("p",null,"Stop")},advanced:function(){return i.a.createElement("p",null,"Advanced")}}[this.state.activeButton]()}},{key:"createMenuElements",value:function(){var e,t,n=this,r=(e=this.props.audioManager,t=this.hideMenu,[{name:"disc",position:[-2.25,0,1],onClick:this.props.toggleMenu,animationDuration:400,animationDelay:220,mapSrc:te.a},{name:"settings",position:[0,0,1],onClick:e.previousTrack,animationDelay:100,animationDuration:400,mapSrc:re.a},{name:"hide",position:[2.25,0,1],onClick:t,animationDelay:180,animationDuration:400,mapSrc:ae.a},{name:"rewind",position:[-2.25,-2.15,1],onClick:e.previousTrack,animationDelay:500,animationDuration:350,mapSrc:se.a},{name:"play",position:[0,-2.15,1],onClick:e.togglePlay,animationDelay:300,animationDuration:350,mapSrc:ce.a},{name:"fastforward",position:[2.25,-2.15,1],onClick:e.nextTrack,animationDelay:280,animationDuration:350,mapSrc:pe.a},{name:"repeat",position:[-2.25,-4.3,1],onClick:e.toggleRepeat,animationDelay:600,animationDuration:300,mapSrc:me.a},{name:"stop",position:[0,-4.3,1],onClick:e.stop,animationDelay:700,animationDuration:300,mapSrc:he.a}]);r.forEach(function(e){return n.placeInScene(e)}),this.menuElements=r.reduce(function(e,t){var n=t.name,r=t.position;return function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){Ie(e,t,n[t])})}return e}(Ie({},n,{onClick:t.onClick,position:r}),e)},{}),this.menuElements.advanced={onClick:function(){},position:[2.25,-4.3,1]},this.placeOrbitsInScene()}},{key:"render",value:function(){var e=this;return i.a.createElement("div",null,i.a.createElement("div",{onClick:this.showIfHidden,className:"menu",ref:function(t){e.mount=t}}),i.a.createElement("div",{className:"tooltips"},this.getToolTip()))}}])&&Be(n.prototype,a),o&&Be(n,o),t}();Ve.propTypes={toggleMenu:u.a.func.isRequired,audioManager:u.a.instanceOf(_).isRequired,repeat:u.a.oneOf(["off","context","track"]).isRequired,hideDash:u.a.func.isRequired,hidden:u.a.bool.isRequired,showIfHidden:u.a.func.isRequired};var We=Ve,Ue=n(40),Xe=n.n(Ue),Ye=n(41),Ke=n.n(Ye);async function Ze(e){var t=(await function(e){return new Promise(function(t,n){Xe.a.read(e,{onSuccess:function(e){return t(e)},onError:function(e){return n(e)}})})}(e)).tags,n=t.artist,r=void 0===n?"":n,i=t.album,a=void 0===i?"":i,o=t.title;return{file:e,trackNumber:3,artist:r,album:a,title:void 0===o?e.name:o}}async function Qe(e){var t=await async function(e){var t=e.extensions,n=void 0===t?null:t,r=e.allowDirectory,i=void 0!==r&&r;return new Promise(function(e){var t=document.createElement("input");n&&t.setAttribute("accept",n),t.type="file",t.multiple=!0,t.webkitdirectory=i,t.directory=i,t.mozdirectory=i,t.addEventListener("change",function(t){return e(t.target.files)}),t.click()})}(e),n=await async function(e){var t=[],n=!0,r=!1,i=void 0;try{for(var a,o=e[Symbol.iterator]();!(n=(a=o.next()).done);n=!0){var s=a.value;t.push(Ze(s))}}catch(e){r=!0,i=e}finally{try{n||null==o.return||o.return()}finally{if(r)throw i}}return(await Promise.all(t)).reduce(function(e,t){return e[Ke()()]=t,e},{})}(t);return console.log(n),n}function Je(e){return(Je="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function $e(e){return($e="function"==typeof Symbol&&"symbol"===Je(Symbol.iterator)?function(e){return Je(e)}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":Je(e)})(e)}function et(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function tt(e,t){return!t||"object"!==$e(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function nt(e){return(nt=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function rt(e,t){return(rt=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var it=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),tt(this,nt(t).apply(this,arguments))}var n,a,o;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&rt(e,t)}(t,r["Component"]),n=t,(a=[{key:"getTracks",value:async function(){var e=await Qe({extensions:".mp3, .wav, .aac"});this.props.addTracks(e)}},{key:"render",value:function(){var e=this;return i.a.createElement("div",{className:"FileReader"},i.a.createElement("div",{className:"content"},i.a.createElement("h2",null,"Edit Playlist"),i.a.createElement("div",{className:"playlists"},this.props.audio.playlist.map(function(t){var n=e.props.audio.tracks[t],r=n.artist,a=n.album,o=n.title;return i.a.createElement("div",null,i.a.createElement("p",{className:"artist"},"".concat(r," - ").concat(o," -").concat(a)))}),i.a.createElement("div",{className:"add-files",onClick:function(){return e.getTracks()}},"Add a file"),i.a.createElement("button",{onClick:this.props.toggleMenu},"Close"))))}}])&&et(n.prototype,a),o&&et(n,o),t}(),at=n(42),ot=n.n(at),st=n(43),ut=n.n(st);function ct(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],r=!0,i=!1,a=void 0;try{for(var o,s=e[Symbol.iterator]();!(r=(o=s.next()).done)&&(n.push(o.value),!t||n.length!==t);r=!0);}catch(e){i=!0,a=e}finally{try{r||null==s.return||s.return()}finally{if(i)throw a}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var lt=function(e){var t,n,a,o=e.audioManager,s=e.currentTrack,u=ct(Object(r.useState)(0),2),c=u[0],l=u[1];return t=function(){l(o.currentTime)},n=1e3,a=Object(r.useRef)(),Object(r.useEffect)(function(){a.current=t}),Object(r.useEffect)(function(){if(null!==n){var e=setInterval(function(){a.current()},n);return function(){return clearInterval(e)}}},[n]),i.a.createElement("header",null,i.a.createElement("div",{className:"info"},i.a.createElement("div",{className:"track"},i.a.createElement("img",{src:ut.a,alt:"TODO"}),i.a.createElement("div",{className:"track-number"},"".concat(s+1))),i.a.createElement("div",{className:"time"},i.a.createElement("img",{src:ot.a,alt:"TODO"})),i.a.createElement("div",{className:"timer"},k(c))),i.a.createElement("div",{className:"knight-rider"}))};function pt(e){return(pt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function ft(e){return(ft="function"==typeof Symbol&&"symbol"===pt(Symbol.iterator)?function(e){return pt(e)}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":pt(e)})(e)}function ht(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function dt(e){return(dt=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function mt(e,t){return(mt=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function yt(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var vt=function(e){function t(e){var n,r,i;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),r=this,i=dt(t).call(this,e),(n=!i||"object"!==ft(i)&&"function"!=typeof i?yt(r):i).timeOut=null,l(yt(yt(n))),window.addEventListener("resize",function(){clearTimeout(n.timeOut),n.timeOut=setTimeout(n.onResize,250)}),n}var n,a,o;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&mt(e,t)}(t,r["PureComponent"]),n=t,(a=[{key:"componentDidMount",value:function(){this.setupScene(),this.clock=new N.Clock}},{key:"onResize",value:function(){var e=w(),t=window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)}},{key:"setupScene",value:function(){var e=w(),t=window.innerHeight,n=new N.Scene,r=new N.PerspectiveCamera(100,e/t,1,1e3),i=new N.AmbientLight(16777215,1),a=new N.DirectionalLight(16777215,5);i.position.set(0,-5,600),a.position.set(0,-5,600),n.add(i,a);var o=new N.WebGLRenderer({alpha:!0,antialias:!1});r.position.z=500;var s=window.devicePixelRatio;o.setPixelRatio(1===s?.65*s:.25*s),o.setSize(e,t),o.setClearColor(0,0),this.camera=r,this.renderer=o,this.scene=n,this.stars=this.stars||[],this.mount.appendChild(this.renderer.domElement),this.setupSpaceShip(),this.addStars(),requestAnimationFrame(this.animate)}},{key:"setupSpaceShip",value:function(){var e=this;(new L.a).load("/public/models/saturn_v1.gltf",function(t){var n=t.scene;n.position.set(2,-2,495),n.rotateY(Math.PI);var r=n.children[1].material.map;r.magFilter=N.LinearFilter,r.minFilter=N.LinearFilter,r.generateMipmaps=!1,e.spaceShip=n,e.scene.add(n),e.mixer=new N.AnimationMixer(n),e.mixer.clipAction(t.animations[0]).play()})}},{key:"animate",value:function(){this.animateStars(),this.renderScene(),this.spaceShip&&(this.props.hidden?(this.spaceShip.visible=!0,this.animateSpaceshipZ()):this.spaceShip.visible=!1),requestAnimationFrame(this.animate)}},{key:"animateSpaceshipZ",value:function(){var e=this.clock.getDelta();this.mixer.update(e)}},{key:"addStars",value:function(){for(var e=new N.BoxGeometry(.75,.75,0),t=-1e3;t<1e3;t+=15){var n=void 0;n=t>0&&t<100?new N.MeshBasicMaterial({color:16741754}):new N.MeshBasicMaterial({color:16777215});var r=new N.Mesh(e,n);r.position.x=S(),r.position.y=S(),r.position.z=t,r.scale.set(E(),E(),1),this.scene.add(r),this.stars.push(r)}}},{key:"animateStars",value:function(){this.stars.forEach(function(e){var t=e;t.position.z+=4*Math.random()+8,t.position.z>1e3&&(t.position.z-=1100,t.position.x=S(),t.position.y=S())})}},{key:"renderScene",value:function(){this.renderer.render(this.scene,this.camera)}},{key:"render",value:function(){var e=this;return i.a.createElement("div",{className:"StarField"},i.a.createElement("div",{ref:function(t){e.mount=t}}))}}])&&ht(n.prototype,a),o&&ht(n,o),t}();function bt(e){return(bt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function gt(e){return(gt="function"==typeof Symbol&&"symbol"===bt(Symbol.iterator)?function(e){return bt(e)}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":bt(e)})(e)}function wt(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function kt(e){return(kt=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Et(e,t){return(Et=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function St(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var Ot=function(e){function t(e){var n,r,i;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),r=this,n=!(i=kt(t).call(this,e))||"object"!==gt(i)&&"function"!=typeof i?St(r):i,l(St(St(n))),n.audioManager=new _,n.state={show:!1,hidden:!1,menuVisible:!1,isDriveDoorOpen:!1,isCheckingDisc:!0},n}var n,a,o;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Et(e,t)}(t,r["Component"]),n=t,(a=[{key:"hideDash",value:function(){this.setState(function(e){return{hidden:!e.hidden,show:!1}})}},{key:"showIfHidden",value:function(){this.state.hidden&&this.setState({hidden:!1,show:!0})}},{key:"getClassNames",value:function(){var e=this.props.audio,t=e.playing,n=e.paused,r=(e.repeat,this.state.hidden?"hidden":""),i=n?"paused":"",a=t?"playing":"",o=this.state.show?"show":"";return"".concat(r," ").concat(i," ").concat(a," ").concat(o)}},{key:"render",value:function(){var e=this,t=this.props.audio,n=t.playing,r=t.paused,a=t.repeat;return i.a.createElement("div",{className:this.getClassNames()},i.a.createElement(lt,{currentTrack:this.props.audio.currentTrack,audioManager:this.audioManager}),r&&i.a.createElement("img",{src:ce.a,className:"toast blink"}),i.a.createElement(We,{audioManager:this.audioManager,hidden:this.state.hidden,showIfHidden:this.showIfHidden,toggleMenu:function(){return e.setState({menuVisible:!0})},hideDash:this.hideDash,repeat:a,paused:r,playing:n}),i.a.createElement("div",{className:"dashboard"}),i.a.createElement($,{audioManager:this.audioManager,paused:r,playing:n}),i.a.createElement(vt,{hidden:this.state.hidden}),this.state.menuVisible&&i.a.createElement("div",{className:"overlay"},i.a.createElement(it,{audio:this.props.audio,addTracks:f,toggleMenu:function(){return e.setState(function(e){return{menuVisible:!e.menuVisible}})}})))}}])&&wt(n.prototype,a),o&&wt(n,o),t}();Ot.propTypes={audio:u.a.shape({trackNumber:u.a.number,repeat:u.a.oneOf(["off","context","track"]).isRequired}).isRequired};var Tt=Object(c.b)(function(e){return{audio:e.audio}})(Ot),xt=n(7),Ct=Object(xt.b)({audio:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:j,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"PLAYING":return D({},e,{playing:!0,paused:!1});case"PAUSED":return D({},e,{playing:!1,paused:!0});case"TOGGLE_REPEAT":return D({},e,{repeat:t.data.repeat});case"SET_CURRENT_TRACK":return D({},e,{currentTrack:t.data.trackIndex});case"ADD_TRACKS":return D({},e,{tracks:D({},e.tracks,t.data.tracks),playlist:[].concat(P(e.playlist),P(Object.keys(t.data.tracks)))});default:return e}}});n(68);n.d(t,"store",function(){return At});var At=Object(xt.c)(Ct,window.__REDUX_DEVTOOLS_EXTENSION__&&window.__REDUX_DEVTOOLS_EXTENSION__());o.a.render(i.a.createElement(c.a,{store:At},i.a.createElement(Tt,null)),document.getElementById("root"))}]);