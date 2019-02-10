import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
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
    directional.position.set(0, 0, 900);
    scene.add(ambient, directional);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });

    const pixRatio = window.devicePixelRatio;
    renderer.setPixelRatio(pixRatio === 1 ? pixRatio * 0.65 : pixRatio * 0.25);
    renderer.setSize(width, height);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.mount.appendChild(this.renderer.domElement);
    this.addCubes();
    requestAnimationFrame(this.animate);
  }

  addCubes() {
    const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
    const leftMaterial = new THREE.MeshLambertMaterial({
      color: new THREE.Color('hsl(143, 100%, 48%)'),
    });
    const rightMaterial = new THREE.MeshLambertMaterial({
      color: new THREE.Color('hsl(143, 100%, 48%)'),
    });
    const leftCube = new THREE.Mesh(geometry, leftMaterial);
    const rightCube = new THREE.Mesh(geometry, rightMaterial);

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
    // TWEEN.update();
    // Only animated the cubes when audio is playing
    if (this.props.playing) {
      const { leftChannel, rightChannel } = this.props.audioManager.analyserFFT;

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
