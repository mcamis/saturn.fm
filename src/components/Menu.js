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

// NearestFilter gets us that sweet sweet pixelated look
orbitTexture.magFilter = THREE.NearestFilter;
pinkTexture.magFilter = THREE.NearestFilter;

const purpleMesh = new MeshBasicMaterial({
  lights: false,
  side: THREE.DoubleSide,
  transparent: true,
  map: orbitTexture,
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
      allowToggle: false,
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
            userData: { onClick },
          },
        },
      } = intersects[0];
      this.buttonEffect.currentTime = 0;
      this.buttonEffect.play();
      onClick();
    }
  }

  onMouseMove(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    // TODO/WTF: Why is * 1.5 necessary!?
    this.mouse.x =
      ((e.clientX - rect.left * 1.5) / (rect.width - rect.left)) * 2 - 1;
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
    const menuButtons = [
      {
        name: 'disc',
        position: [-2.25, -28, 1],
        onClick: this.props.audioManager.togglePlay,
        animationDuration: 400,
        animationDelay: 220,
        mapSrc: discSrc,
      },
      {
        name: 'settings',
        position: [0, -28, 1],
        onClick: this.props.audioManager.previousTrack,
        animationDelay: 100,
        animationDuration: 400,
        mapSrc: moreSrc,
      },
      {
        name: 'hide',
        position: [2.25, -28, 1],
        onClick: this.testFunc,
        animationDelay: 180,
        animationDuration: 400,
        mapSrc: hideSrc,
      },
      {
        name: 'rewind',
        position: [-2.25, -30.15, 1],
        onClick: this.props.audioManager.previousTrack,
        animationDelay: 500,
        animationDuration: 350,
        mapSrc: rwdSrc,
      },
      {
        name: 'play',
        position: [0, -30.15, 1],
        onClick: this.props.audioManager.togglePlay,
        animationDelay: 300,
        animationDuration: 350,
        mapSrc: playSrc,
      },
      {
        name: 'fastforward',
        position: [2.25, -30.15, 1],
        onClick: this.props.audioManager.nextTrack,
        animationDelay: 280,
        animationDuration: 350,
        mapSrc: ffwdSrc,
      },
      {
        name: 'repeat',
        position: [-2.25, -32.3, 1],
        onClick: this.props.audioManager.toggleRepeat,
        animationDelay: 600,
        animationDuration: 300,
        mapSrc: repeatSrc,
      },
      {
        name: 'stop',
        position: [0, -32.3, 1],
        onClick: this.props.audioManager.stop,
        animationDelay: 700,
        animationDuration: 300,
        mapSrc: stopSrc,
      },

      {
        name: 'advanced',
        position: [2.25, -32.3, 1],
        onClick: this.props.hideDash,
        animationDelay: 900,
        animationDuration: 300,
        mapSrc: advancedSrc,
      },
    ];

    menuButtons.forEach(button => this.createButton(button));
    // TODO: Shadows
  }

  createButton({
    name = '',
    position,
    onClick,
    mapSrc,
    animationDelay,
    animationDuration,
  }) {
    const [x, y, z] = position;

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
        onClick,
        animationDelay,
        originalPosition: position,
        animationDuration,
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
    const activeButton = this.orbits[this.state.activeButton];
    const { pink, purple } = activeButton;
    if (this.props.hidden) {
      pink.material.visible = false;
      purple.material.visible = false;
    } else {
      pink.rotateY(-0.065);
      purple.rotateY(0.07);
    }
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
      document.body.classList.add('pointer');
    } else {
      document.body.classList.remove('pointer');
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

  /* Animates a Vector3 to the target */
  animateVector3(vectorToAnimate, target, options = {}) {
    // get targets from options or set to defaults
    const to = target || THREE.Vector3();
    const easing = options.easing || TWEEN.Easing.Quadratic.In;
    const duration = options.duration || 2000;
    // create the tween
    const tweenVector3 = new TWEEN.Tween(vectorToAnimate)
      .to({ x: to.x, y: to.y, z: to.z }, duration)
      .easing(easing)
      .onUpdate(d => {
        if (options.update) {
          options.update(d);
        }
      })
      .onComplete(() => {
        if (options.callback) options.callback();
      })
      .delay(options.delay);
    // start the tween
    tweenVector3.start();
    // return the tween in case we want to manipulate it later on
    return tweenVector3;
  }

  testFunc() {
    this.planes.forEach(plane => {
      const { x, y, z } = plane.position;
      const target = new THREE.Vector3(x, y - 8, z); // create on init
      this.hideButton(plane, target);
    });
    this.props.hideDash();
    setTimeout(() => this.setState({ allowToggle: true }), 1200);
    // this.setState(() => ({allowToggle: true }), this.props.hideDash() );
  }

  hideButton(plane, target) {
    this.animateVector3(plane.position, target, {
      duration: plane.material.userData.animationDuration,
      delay: plane.material.userData.animationDelay,
      easing: TWEEN.Easing.Quadratic.InOut,
    });
  }
  animate() {
    TWEEN.update();
    this.orbitButton();
    this.manageActiveButton();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }

  showIfHidden() {
    if (this.state.allowToggle && this.props.hidden) {
      this.props.showIfHidden();
      this.setState({ allowToggle: false });
      this.planes.forEach(plane => {
        const { x, y, z } = plane.position;

        const target = new THREE.Vector3(x, y + 8, z); // create on init
        this.hideButton(plane, target);
      });
    }
  }

  render() {
    return (
      <div
        onClick={this.showIfHidden}
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
