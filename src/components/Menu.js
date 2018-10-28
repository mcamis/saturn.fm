import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import AudioManager from 'utilities/audioManager';
import {
  animateButtonPosition,
  createButtons,
  orbitGeometry,
  purpleMesh,
  alphaTexture,
  pinkMesh,
  planeGeometry,
} from 'utilities/menuElements';

// Todo: Import specific tween functions as needed
import TWEEN from '@tweenjs/tween.js';

// Three.js imports

import { Mesh } from 'three/src/objects/Mesh';

import { MeshBasicMaterial } from 'three/src/materials/Materials';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { Scene } from 'three/src/scenes/Scene';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
import * as THREE from 'three';

import buttonSrc from 'songs/button-press.mp3';
import highlightSrc from 'songs/button-highlight.mp3';

import autobind from 'utilities/autobind';

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
    if (this.props.hidden) return;

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

      // TODO: Scale up onClick

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
    const camera = new PerspectiveCamera(2.5, width / height, 1, 500);

    camera.position.z = 360;
    camera.position.y = 0.5;

    const renderer = new WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(window.devicePixelRatio); // Retina
    renderer.setSize(width, height);

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

    domElement.addEventListener('mousedown', e => this.onMouseDown(e), false);

    domElement.addEventListener('mousemove', e => this.onMouseMove(e), false);
  }

  createMenuElements() {
    const menuElements = createButtons(
      this.props.audioManager,
      this.hideMenu,
      this.props.hideDash
    );

    menuElements.forEach(button => this.placeInScene(button));
  }

  placeInScene({
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
    pink.visible = false;
    purple.visible = false;

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

    // Push the orbits slight ahead in Z so they hit the plane at the eges of the sphere
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

    if (this.props.hidden) {
      pink.material.visible = false;
      purple.material.visible = false;
    } else {
      pink.material.visible = true;
      purple.material.visible = true;
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
      if (name && name !== this.state.activeButton) {
        this.setState({ activeButton: name });
      }
      document.body.classList.add('pointer');
    } else {
      document.body.classList.remove('pointer');
    }
  }

  hideMenu() {
    this.planes.forEach(plane => {
      const { x, y, z } = plane.position;
      animateButtonPosition(plane, new THREE.Vector3(x, y - 10, z));
    });
    this.props.hideDash();
    setTimeout(() => this.setState({ allowToggle: true }), 1400);
    // this.setState(() => ({allowToggle: true }), this.props.hideDash() );
  }

  animate() {
    // TODO: Move tween.update to a central location?
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
        animateButtonPosition(plane, new THREE.Vector3(x, y + 10, z));
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
  hideDash: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired,
  showIfHidden: PropTypes.func.isRequired,
};

export default Menu;
