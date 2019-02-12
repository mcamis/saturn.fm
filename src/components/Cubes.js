import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import autobind from 'utilities/autobind';
import GLTFLoader from 'three-gltf-loader';

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
    this.loader = new GLTFLoader();
    autobind(this);
    window.addEventListener('resize', () => {
      clearTimeout(this.debouncedResize);
      this.debouncedResize = setTimeout(this.onResize, 250);
    });
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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(20, width / height, 1, 1200);
    camera.position.z = 45;
    camera.position.y = -27;

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    const directional = new THREE.DirectionalLight(0xffffff, 0.7);
    directional.position.set(0, 500, 900);
    scene.add(ambient, directional);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });

    let isSsfari = false;
    if (
      navigator.userAgent.indexOf('Safari') !== -1 &&
      navigator.userAgent.indexOf('Chrome') === -1
    ) {
      isSsfari = true;
    }
    const pixRatio = window.devicePixelRatio;
    renderer.setPixelRatio(pixRatio === 1 ? pixRatio * 0.5 : pixRatio * 0.18);
    renderer.setSize(width, height);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.setupCube('leftCube', [-6.75, -29.5, 0]);
    this.setupCube('rightCube', [6.75, -29.5, 0]);

    this.mount.appendChild(this.renderer.domElement);
  }

  setupCube(slot, [x, y, z]) {
    this.loader.load(
      './models/cubeBigger.gltf',
      ({
        scene: {
          children: [, , cubeModel],
        },
      }) => {
        cubeModel.material.color = new THREE.Color('hsl(143, 100%, 48%)');
        cubeModel.position.set(x, y, z);

        this[slot] = cubeModel;
        this.scene.add(cubeModel);
        if (slot === 'rightCube') requestAnimationFrame(this.animate);
      }
    );
  }

  animate() {
    // Only animated the cubes when audio is playing
    if (this.props.playing) {
      const [leftChannel, rightChannel] = this.props.audioManager.analyserFFT;

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
  // audioManager: PropTypes.instanceOf(AudioManager).isRequired,
  playing: PropTypes.bool.isRequired,
};

export default Cubes;
