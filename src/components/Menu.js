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
import pinkSrc from 'images/pink.gif';
import pinkAlphaSrc from 'images/pinkAlphaMap.gif';
import purpleAlphaSrc from 'images/purpleAlpha.png';

import discSrc from 'images/disc.png';
import moreSrc from 'images/more.png';
import hideSrc from 'images/hide.png';
import rwdSrc from 'images/rwd.png';
import playSrc from 'images/play-pause.png';
import ffwdSrc from 'images/ffwd.png';
import stopSrc from 'images/stop.png';
import repeatSrc from 'images/repeat.png';
import advancedSrc from 'images/advanced.png';

import orbAlpha from 'images/orb-alpha.png';

import autobind from 'utilities/autobind';

const orbitGeometry = new CylinderGeometry(1.45, 1.45, 0.35, 12, 1, true);
const orbitTexture = new THREE.TextureLoader().load(textureSrc);
const pinkTexture = new THREE.TextureLoader().load(pinkSrc);

const purpleAlpha = new THREE.TextureLoader().load(purpleAlphaSrc);

// NearestFilter gets us that sweet sweet pixelated look
orbitTexture.magFilter = THREE.NearestFilter;
pinkTexture.magFilter = THREE.NearestFilter;

const purpleMesh = new MeshBasicMaterial({
  lights: false,
  side: THREE.DoubleSide,
  transparent: true,
  map: orbitTexture,
  // alphaMap: purpleAlpha
});

const alphaTexture = new THREE.TextureLoader().load(orbAlpha);
alphaTexture.magFilter = THREE.NearestFilter;

const pinkMesh = new MeshBasicMaterial({
  lights: false,
  side: THREE.DoubleSide,
  transparent: true,
  map: pinkTexture,
});

const planeGeometry = new PlaneGeometry(2, 2, 1, 1);

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
      const {
        object: {
          material: {
            userData: { callback },
          },
        },
      } = intersects[0];
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
    renderer.setPixelRatio(window.devicePixelRatio); // Retina
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
    const {
      renderer: { domElement },
    } = this;
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
      'disc',
      [-2.25, -28, 1],
      this.props.audioManager.togglePlay,
      discSrc
    );
    this.createButton('settings', [0, -28, 1], () => {}, moreSrc);
    this.createButton('hide', [2.25, -28, 1], this.props.hideDash, hideSrc);
    this.createButton(
      'rewind',
      [-2.25, -30.15, 1],
      this.props.audioManager.previousTrack,
      rwdSrc
    );
    this.createButton(
      'play',
      [0, -30.15, 1],
      this.props.audioManager.togglePlay,
      playSrc
    );
    this.createButton(
      'fastforward',
      [2.25, -30.15, 1],
      this.props.audioManager.nextTrack,
      ffwdSrc
    );
    this.createButton(
      'repeat',
      [-2.25, -32.3, 1],
      this.props.audioManager.toggleRepeat,
      repeatSrc
    );
    this.createButton(
      'stop',
      [0, -32.3, 1],
      this.props.audioManager.stop,
      stopSrc
    );
    this.createButton(
      'advanced',
      [2.25, -32.3, 1],
      this.props.hideDash,
      advancedSrc
    );

    // TODO: Shadows
  }

  createButton(name = '', coords, callback, mapSrc) {
    const [x, y, z] = coords;

    const planeTexture = new THREE.TextureLoader().load(mapSrc);
    planeTexture.magFilter = THREE.NearestFilter;
    planeTexture.minFilter = THREE.NearestFilter;

    // Setup orbits
    const pink = new Mesh(orbitGeometry, pinkMesh);
    const purple = new Mesh(orbitGeometry, purpleMesh);

    const planeMaterial = new MeshBasicMaterial({
      map: planeTexture,
      transparent: true,
      name,
      userData: {
        callback,
      },
      alphaMap: alphaTexture,
    });
    const plane = new Mesh(planeGeometry, planeMaterial);

    // Push the orbits slight ahead in Z so they hit the plan at the eges of the sphere
    pink.position.set(x, y, 2);
    pink.rotateX(0.35);
    pink.rotateZ(-0.8);

    purple.position.set(x, y, 2.03);
    purple.rotateZ(0.8);
    purple.rotateX(0.25);
    purple.rotateY(1);

    plane.position.set(x, y, z);
    // plane.rotateZ(0.75);

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
    pink.rotateY(-0.065);
    purple.rotateY(0.07);
  }

  manageActiveButton() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.planes);
    if (intersects.length > 0) {
      const {
        object: {
          material: { name },
        },
      } = intersects[0];
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
