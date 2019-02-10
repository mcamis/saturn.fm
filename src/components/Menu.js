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

import testPng from 'images/test.png';

// Todo: Import specific tween functions as needed
import TWEEN from '@tweenjs/tween.js';
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

    this.clock = new THREE.Clock();

    this.buttons = [
      'disc',
      'settings',
      'hide',
      'rewind',
      'play',
      'fastforward',
      'repeat',
      'stop',
      'advanced',
    ];
    autobind(this);
  }

  componentDidMount() {
    this.setupScene();

    this.setupKeyboardListeners();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.activeButton !== prevState.activeButton) {
      this.highlightEffect.currentTime = 0;
      this.highlightEffect.play();
      const [x, y] = this.menuElements[this.state.activeButton].position;
      this.orbits.pink.position.set(x, y, 2);
      this.orbits.purple.position.set(x, y, 2.03);
    }
  }

  onResize() {
    const width = window.innerWidth > 1200 ? 1200 : window.innerWidth;
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

    this.manageActiveButton();
  }

  setupKeyboardListeners() {
    window.addEventListener('keydown', e => {
      let nextIndex = this.buttons.indexOf(this.state.activeButton);
      switch (e.code) {
        case 'ArrowRight':
          if (nextIndex !== 2 && nextIndex !== 5) {
            nextIndex += 1;
          }
          break;
        case 'ArrowLeft':
          if (nextIndex !== 3 && nextIndex !== 6) {
            nextIndex -= 1;
          }
          break;

        case 'ArrowUp':
          nextIndex -= 3;
          break;
        case 'ArrowDown':
          nextIndex += 3;
          break;
        case 'Enter':
          this.menuElements[this.buttons[nextIndex]].onClick();
          break;
        default:
          nextIndex = -1;
      }

      if (nextIndex >= 0 && nextIndex < this.buttons.length) {
        this.setState({ activeButton: this.buttons[nextIndex] });
      }
    });
  }

  setupScene() {
    const width = window.innerWidth > 1200 ? 1200 : window.innerWidth;
    const height = width * 0.75;

    const scene = new THREE.Scene();
    // TODO: OrthographicCamera?
    const camera = new THREE.PerspectiveCamera(2.5, width / height, 1, 500);

    camera.position.z = 360;
    camera.position.y = 0.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(width, height);

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.mount.appendChild(this.renderer.domElement);

    this.createMenuElements();
    this.setupOrbAnimation();
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

  setupOrbAnimation() {
    const [x, y, z] = [2.25, -4.3, 1];

    const globeTexture = new THREE.TextureLoader().load(testPng);
    globeTexture.magFilter = THREE.NearestFilter;
    globeTexture.minFilter = THREE.NearestFilter;

    // https://stemkoski.github.io/Three.js/Texture-Animation.html
    this.textureAnimator = new this.TextureAnimator(
      globeTexture,
      461,
      1,
      461,
      40
    ); // texture, #horiz, #vert, #total, duration.
    const globeMaterial = new THREE.MeshBasicMaterial({
      map: globeTexture,
      transparent: true,
      name: 'advanced',
      userData: {
        animationDelay: 900,
        animationDuration: 300,
      },
    });
    const spinningGlobe = new THREE.Mesh(planeGeometry, globeMaterial);
    spinningGlobe.position.set(x, y, z);

    this.planes.push(spinningGlobe);
    this.scene.add(spinningGlobe);
  }

  // TODO: Move to utility class
  TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
    this.tilesHorizontal = tilesHoriz;
    this.tilesVertical = tilesVert;
    this.numberOfTiles = numTiles;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

    this.tileDisplayDuration = tileDispDuration;
    this.currentDisplayTime = 0;
    this.currentTile = 0;

    this.update = function(milliSec) {
      this.currentDisplayTime += milliSec;
      while (this.currentDisplayTime > this.tileDisplayDuration) {
        this.currentDisplayTime -= this.tileDisplayDuration;
        this.currentTile++;
        if (this.currentTile === this.numberOfTiles) this.currentTile = 0;
        const currentColumn = this.currentTile % this.tilesHorizontal;
        texture.offset.x = currentColumn / this.tilesHorizontal;
        const currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
        texture.offset.y = currentRow / this.tilesVertical;
      }
    };
  }

  placeOrbitsInScene() {
    const [x, y] = [0, -2.15];
    const pink = new THREE.Mesh(orbitGeometry, pinkMesh);
    const purple = new THREE.Mesh(orbitGeometry, purpleMesh);
    // pink.visible = false;
    // purple.visible = false;

    // Push the orbits slight ahead in Z so they hit the plane at the eges of the sphere
    pink.position.set(x, y, 2);
    pink.rotateX(0.35);
    pink.rotateZ(-0.8);

    purple.position.set(x, y, 2.03);
    purple.rotateZ(0.8);
    purple.rotateX(0.25);
    purple.rotateY(1);

    this.orbits = {
      pink,
      purple,
    };

    this.scene.add(pink, purple);
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

    const planeMaterial = new THREE.MeshBasicMaterial({
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
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(x, y, z);
    // plane.rotateZ(0.75);
    this.planes.push(plane);
    this.scene.add(plane);
  }

  orbitButton() {
    const { pink, purple } = this.orbits;

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

  // TODO: Throttle this
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
    if (this.props.hidden) {
      return this.showIfHidden();
    }
    this.planes.forEach(plane => {
      const { x, y, z } = plane.position;
      animateButtonPosition(plane, new THREE.Vector3(x, y - 10, z));
    });
    this.props.hideDash();
    setTimeout(() => this.setState({ allowToggle: true }), 1400);
  }

  animate() {
    // TODO: Move tween.update to a central location?
    TWEEN.update();
    this.orbitButton();
    this.renderer.render(this.scene, this.camera);

    const delta = this.clock.getDelta();

    this.textureAnimator.update(1000 * delta);

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

  getToolTip() {
    const { playing, paused, repeat } = this.props;

    const tooltips = {
      disc: () => <p>Choose Songs</p>,
      settings: () => <p>System Settings</p>,
      hide: () => <p>Hide</p>,
      rewind: () => <p>Rewind</p>,
      fastforward: () => <p>Fast Forward</p>,
      play: () => {
        let playElement = <p>Play / Pause</p>;
        if (playing) {
          playElement = (
            <p>
              <strong>Play</strong>/ Pause
            </p>
          );
        } else if (paused) {
          playElement = (
            <p>
              Play / <strong>Pause</strong>
            </p>
          );
        }
        return playElement;
      },
      repeat: () => {
        let repeatElement = (
          <p>
            Repeat: 1 / All / <strong>Off</strong>
          </p>
        );
        if (repeat === 'track') {
          repeatElement = (
            <p>
              Repeat: <strong>1</strong> / All / Off
            </p>
          );
        } else if (repeat === 'context') {
          repeatElement = (
            <p>
              Repeat: 1 / <strong>All</strong> / Off
            </p>
          );
        }
        return repeatElement;
      },
      stop: () => <p>Stop</p>,
      advanced: () => <p>Advanced</p>,
    };

    return tooltips[this.state.activeButton]();
  }

  createMenuElements() {
    const menuElements = createButtons(
      this.props.audioManager,
      this.hideMenu,
      this.props.toggleMenu
    );
    menuElements.forEach(button => this.placeInScene(button));
    this.menuElements = menuElements.reduce(
      (obj, { name, position, onClick }) => ({
        [name]: {
          onClick,
          position,
        },
        ...obj,
      }),
      {}
    );
    this.menuElements.advanced = {
      onClick: () => {},
      position: [2.25, -4.3, 1],
    };

    this.placeOrbitsInScene();
  }

  render() {
    return (
      <div>
        <div
          onClick={this.showIfHidden}
          className="menu"
          ref={mount => {
            this.mount = mount;
          }}
        />
        <div className="tooltips">{this.getToolTip()}</div>
      </div>
    );
  }
}

Menu.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  audioManager: PropTypes.instanceOf(AudioManager).isRequired,
  repeat: PropTypes.oneOf(['off', 'context', 'track']).isRequired,
  hideDash: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired,
  showIfHidden: PropTypes.func.isRequired,
};

export default Menu;