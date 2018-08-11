import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import AudioManager from 'utilities/audioManager';

// Three.js imports
import { AmbientLight } from 'three/src/lights/AmbientLight';
import { BoxGeometry } from 'three/src/geometries/Geometries';
import { Color } from 'three/src/math/Color';
import { DirectionalLight } from 'three/src/lights/DirectionalLight';
import { Mesh } from 'three/src/objects/Mesh';
import { MeshLambertMaterial } from 'three/src/materials/Materials';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { Scene } from 'three/src/scenes/Scene';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';

// Todo: Import specific tween functions as needed
import TWEEN from '@tweenjs/tween.js';

import autobind from 'utilities/autobind';
import { sceneWidth } from 'utilities/helpers';
import {
  activeRotation,
  idleRotation,
  updateScaleAndColor,
} from 'utilities/cubeTransforms';

class Cubes extends PureComponent {
  constructor(props) {
    super(props);
    this.debouncedResize = null;
    autobind(this);
  }

  componentDidMount() {
    this.setupScene();
  }

  onResize() {
    const width = sceneWidth();
    const height = width * 0.75;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setupScene() {
    const width = sceneWidth();
    const height = width * 0.75;

    const scene = new Scene();
    const camera = new PerspectiveCamera(20, width / height, 1, 1000);
    camera.position.z = 45;
    camera.position.y = -27;

    const ambient = new AmbientLight(0xffffff, 0.35);
    const directional = new DirectionalLight(0xffffff, 0.7);
    directional.position.set(0, 0, 900);
    scene.add(ambient, directional);

    const renderer = new WebGLRenderer({ alpha: true, antialias: false });

    // TODO: Test on low DPI screens
    // Pixelated on Retina with * .25
    renderer.setPixelRatio(window.devicePixelRatio * 0.25);
    renderer.setSize(width, height);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.mount.appendChild(this.renderer.domElement);
    this.addCubes();
    requestAnimationFrame(this.animate);
    window.addEventListener('resize', () => {
      clearTimeout(this.debouncedResize);
      this.debouncedResize = setTimeout(this.onResize, 250);
    });
  }

  addCubes() {
    const geometry = new BoxGeometry(1, 1, 1, 1, 1, 1);
    const leftMaterial = new MeshLambertMaterial({
      color: new Color('hsl(143, 100%, 48%)'),
    });
    const rightMaterial = new MeshLambertMaterial({
      color: new Color('hsl(143, 100%, 48%)'),
    });
    const leftCube = new Mesh(geometry, leftMaterial);
    const rightCube = new Mesh(geometry, rightMaterial);

    leftCube.position.set(-Math.abs(7), -30, 0);
    rightCube.position.set(7, -30, 0);

    // Offset rotations so they're not symmetrical
    rightCube.rotateY(0.75);
    rightCube.rotateX(0.015);
    leftCube.rotateX(0.015);

    this.leftCube = leftCube;
    this.rightCube = rightCube;
    this.scene.add(leftCube, rightCube);
  }

  animate() {
    const { leftChannel, rightChannel } = this.props.audioManager.analyserFFT;

    TWEEN.update();
    // Only animated the cubes when audio is playing
    if (this.props.playing) {
      updateScaleAndColor(this.leftCube, leftChannel);
      updateScaleAndColor(this.rightCube, rightChannel);
      activeRotation(this.leftCube);
      activeRotation(this.rightCube, -1);
    } else {
      idleRotation(this.leftCube);
      idleRotation(this.rightCube, -1);
    }

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.animate);
  }

  render() {
    return (
      <div
        className="cubes"
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}

Cubes.propTypes = {
  audioManager: PropTypes.instanceOf(AudioManager).isRequired,
  playing: PropTypes.bool.isRequired,
};

export default Cubes;
