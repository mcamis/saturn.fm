import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import AudioManager from 'utilities/audioManager';

// Three.js imports
import {
  CylinderGeometry,
  PlaneGeometry,
} from 'three/src/geometries/Geometries';
import { Mesh } from 'three/src/objects/Mesh';
import { MeshBasicMaterial } from 'three/src/materials/Materials';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { Scene } from 'three/src/scenes/Scene';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
import * as THREE from 'three';

// Todo: Import specific tween functions as needed
import TWEEN from '@tweenjs/tween.js';

import buttonSrc from 'songs/button-press.mp3';
import highlightSrc from 'songs/button-highlight.mp3';

import textureSrc from 'images/texture.gif';
import pinkSrc from 'images/pinkTexture.gif';
import pinkAlphaSrc from 'images/pinkAlphaMap.gif';
import playPauseIcon from 'images/play-pause.png';

import orbSrc from 'images/orb-top.png';
import orbAlpha from 'images/orb-alpha.png';

import autobind from 'utilities/autobind';

const orbitGeometry = new CylinderGeometry(1.15, 1.15, 0.17, 30, 1, true);
const orbitTexture = new THREE.TextureLoader().load(textureSrc);
const pinkTexture = new THREE.TextureLoader().load(pinkSrc);

// NearestFilter gets us that sweet sweet pixelated look
orbitTexture.magFilter = THREE.NearestFilter;
pinkTexture.magFilter = THREE.NearestFilter;

const purpleMesh = new MeshBasicMaterial({
  lights: false,
  side: THREE.DoubleSide,
  transparent: true,
  map: orbitTexture,
});

const alphaTexture = new THREE.TextureLoader().load(pinkAlphaSrc);

const pinkMesh = new MeshBasicMaterial({
  lights: false,
  side: THREE.DoubleSide,
  transparent: true,
  map: pinkTexture,
});

const planeTexture = new THREE.TextureLoader().load(orbSrc);
planeTexture.magFilter = THREE.NearestFilter;

const planeGeometry = new PlaneGeometry(1.5, 1.5, 1, 1);

class Menu extends PureComponent {
  constructor(props) {
    super(props);
    this.timeOut = null;
    this.planes = [];

    this.buttonEffect = new Audio();
    this.buttonEffect.src = buttonSrc;
    this.highlightEffect = new Audio();
    this.highlightEffect.src = highlightSrc;
    this.state = {
      activeButton: 'play',
    };
    autobind(this);
  }

  componentDidMount() {
    this.setupScene();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.activeButton !== prevState.activeButton) {
      this.highlightEffect.currentTime = 0;
      this.highlightEffect.play();
    }
  }

  onResize() {
    const width = window.innerWidth > 1000 ? 1000 : window.innerWidth;
    const height = width * 0.75;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  onMouseDown(e) {
    e.stopPropagation();
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.planes);
    if (intersects.length > 0) {
      const { object: { material: { userData: { callback } } } } = intersects[0];
      this.buttonEffect.currentTime = 0;
      this.buttonEffect.play();
      callback();
    }
  }

  onMouseMove(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    // TODO/WTF: Why is * 1.5 necessary!?
    this.mouse.x =
      (e.clientX - rect.left * 1.5) / (rect.width - rect.left) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
  }

  setupScene() {
    const width = window.innerWidth > 1000 ? 1000 : window.innerWidth;
    const height = width * 0.75;

    const scene = new Scene();
    const camera = new PerspectiveCamera(20, width / height, 1, 1000);
    camera.position.z = 45;
    camera.position.y = -27;

    const renderer = new WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(window.devicePixelRatio * 0.25); // Retina
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // the default

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.mount.appendChild(this.renderer.domElement);


    this.createMenuElements();
    this.setupEventListeners();

    requestAnimationFrame(this.animate);
  }

  setupEventListeners() {
    const { renderer: { domElement } } = this;
    window.addEventListener('resize', () => {
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(this.onResize, 250);
    });

    this.renderer.domElement.addEventListener(
      'mousedown',
      e => this.onMouseDown(e),
      false
    );
    this.renderer.domElement.addEventListener(
      'mousemove',
      e => this.onMouseMove(e),
      false
    );
  }

  createMenuElements() {
    this.createButton(
      'play',
      [1, -32, 1],
      this.props.audioManager.togglePlay,
      playPauseIcon
    );
    this.createButton(
      'hide',
      [-2, -32, 1],
      this.props.hideDash,
      playPauseIcon
    );
  }

  createButton(name = '', coords, callback, mapSrc) {
    const [x, y, z] = coords;

    // Setup orbits
    const pink = new Mesh(orbitGeometry, pinkMesh);
    const purple = new Mesh(orbitGeometry, purpleMesh);

    const planeMaterial = new MeshBasicMaterial({
      map: planeTexture,
      name,
      userData: {
        callback,
      },
    });
    const plane = new Mesh(planeGeometry, planeMaterial);

    pink.position.set(x, y, z);
    pink.rotateX(0.15);
    pink.rotateZ(-0.8);

    purple.position.set(x, y, 1.5);
    purple.rotateZ(0.8);
    purple.rotateX(0.15);
    purple.rotateY(1);

    plane.position.set(x, y, z);
    plane.rotateZ(0.75);

    this.orbits = {
      ...this.orbits,
      [name]: {
        pink,
        purple,
      },
    };

    this.planes.push(plane);

    this.scene.add(pink, purple, plane);
  }

  orbitButton() {
    const { pink, purple } = this.orbits[this.state.activeButton];
    pink.rotateY(-0.075);
    purple.rotateY(0.08);
  }

  manageActiveButton() {

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.planes);
    if (intersects.length > 0) {
      const { object: { material: { name } } } = intersects[0];
      if (name) {
        this.setState({ activeButton: name });
      }
    }

    Object.keys(this.orbits).forEach(key => {
      if (this.state.activeButton === key) {
        this.orbits[key].pink.visible = true;
        this.orbits[key].purple.visible = true;
      } else {
        this.orbits[key].pink.visible = false;
        this.orbits[key].purple.visible = false;
      }
    });
  }

  animate() {
    TWEEN.update();
    this.orbitButton();
    this.manageActiveButton();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }

  render() {
    return (
      <div
        className="menu"
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}
Menu.propTypes = {
  audioManager: PropTypes.instanceOf(AudioManager).isRequired,
  repeat: PropTypes.oneOf(['off', 'context', 'track']).isRequired,
};


export default Menu;

//   buttonClick(callback) {
//     this.buttonEffect.currentTime = 0;
//     this.buttonEffect.play();
//     callback();
//   }

//   fooRender() {
//     const { audioManager, repeat, playing, paused } = this.props;
//     let repeatElement = (
//       <div>
//         Repeat: 1 / All / <strong>Off</strong>
//       </div>
//     );
//     if (repeat === 'track') {
//       repeatElement = (
//         <div>
//           Repeat: <strong>1</strong> / All / Off
//         </div>
//       );
//     } else if (repeat === 'context') {
//       repeatElement = (
//         <div>
//           Repeat: 1 / <strong>All</strong> / Off
//         </div>
//       );
//     }

//     let playElement = <div>Play / Pause</div>;
//     if (playing) {
//       playElement = (
//         <div>
//           <strong>Play</strong> / Pause
//         </div>
//       );
//     } else if (paused) {
//       playElement = (
//         <div>
//           Play / <strong>Pause</strong>
//         </div>
//       );
//     }

//     return (
//       <ul>
//         <li>
//           <Link to="source" className="gold disc">
//             <img src={discIcon} alt="TODO" />
//           </Link>
//         <OrbButton
//           buttonClick={this.buttonClick}
//           className="gold"
//           icon={moreIcon}
//           tooltipText="System Settings"
//         />
//         <OrbButton
//           buttonClick={this.buttonClick}
//           className="gold test"
//           callback={this.props.hideDash}
//           icon={visualizerIcon}
//           tooltipText="Hide Controls"
//         />
//         <OrbButton
//           buttonClick={this.buttonClick}
//           className="middle rewind"
//           icon={rwdIcon}
//           callback={audioManager.previousTrack}
//           tooltipText="Skip Backwards"
//         />
//         <OrbButton
//           buttonClick={this.buttonClick}
//           className="middle play-pause"
//           icon={playPauseIcon}
//           callback={audioManager.togglePlay}
//           tooltipText={playElement}
//         />
//         <OrbButton
//           buttonClick={this.buttonClick}
//           className="middle fast-forward"
//           icon={ffwdIcon}
//           tooltipText="Skip Forwards"
//           callback={audioManager.nextTrack}
//         />
//         <OrbButton
//           buttonClick={this.buttonClick}
//           className="bottom repeat"
//           icon={repeatIcon}
//           callback={audioManager.toggleRepeat}
//           tooltipText={repeatElement}
//         />
//         <OrbButton
//           buttonClick={this.buttonClick}
//           className="bottom stop"
//           icon={stopIcon}
//           callback={audioManager.stop}
//           tooltipText="Stop"
//         />
//         <OrbButton
//           buttonClick={this.buttonClick}
//           className="bottom globe"
//           tooltipText="Advanced Controls"
//         />
//       </ul>
//     );
//   }
// }


// export default Menu;
