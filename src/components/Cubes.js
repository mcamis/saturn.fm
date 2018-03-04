import React, { Component } from 'react';
import { AmbientLight } from 'three/src/lights/AmbientLight';
import { BoxGeometry } from 'three/src/geometries/Geometries';
import { Color } from 'three/src/math/Color';
import { DirectionalLight } from 'three/src/lights/DirectionalLight';
import { Mesh } from 'three/src/objects/Mesh';
import { MeshLambertMaterial } from 'three/src/materials/Materials';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { Scene } from 'three/src/scenes/Scene';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
import TWEEN from '@tweenjs/tween.js';

import autobind from 'utilities/autobind';
import { colorTween } from 'utilities/helpers';

class Cubes extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    this.setupScene();
  }
  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  onResize() {
    const width = window.innerWidth > 1000 ? 1000 : window.innerWidth;
    const height = width * 0.75;
    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setupScene() {
    const width = window.innerWidth > 1000 ? 1000 : window.innerWidth;
    const height = width * 0.75;

    const scene = new Scene();
    const camera = new PerspectiveCamera(20, width / height, 1, 1000);
    camera.position.z = 45;
    camera.position.y = -27;

    const ambient = new AmbientLight(0xffffff, 0.35); // soft white light
    const directional = new DirectionalLight(0xffffff, 0.7);
    directional.position.set(0, 0, 900);
    scene.add(ambient, directional);

    const renderer = new WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(window.devicePixelRatio * 0.25); // Retina
    // renderer.setPixelRatio(window.devicePixelRatio * 0.35); // Regular
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // the default

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.mount.appendChild(this.renderer.domElement);
    this.start();
    this.addCubes();
    window.addEventListener('resize', this.onResize, false);
  }

  start() {
    this.frameId = this.frameId || requestAnimationFrame(this.animate);
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  addCubes() {
    const geometry = new BoxGeometry(1, 1, 1, 1, 1, 1);
    const leftMaterial = new MeshLambertMaterial({
      color: new Color('hsl(142.5, 100%, 48%)'),
    });
    const rightMaterial = new MeshLambertMaterial({
      color: new Color('hsl(142.5, 100%, 48%)'),
    });
    const leftCube = new Mesh(geometry, leftMaterial);
    const rightCube = new Mesh(geometry, rightMaterial);
    this.leftCube = leftCube;
    this.rightCube = rightCube;
    this.geometry = geometry;
    this.scene.add(leftCube, rightCube);

    const xOffset = 7;

    leftCube.position.set(xOffset * -1, -30, 0);
    rightCube.position.set(xOffset, -30, 0);
    rightCube.rotateY(0.75);
    rightCube.rotateX(0.015);
    leftCube.rotateX(0.015);
  }

  rotateCubes() {
    this.leftCube.rotation.x += Math.random() * (0.03 - 0.01) + 0.01;
    this.leftCube.rotation.y += Math.random() * (0.03 - 0.01) + 0.01;
    this.rightCube.rotation.x -= Math.random() * (0.03 - 0.01) + 0.01;
    this.rightCube.rotation.y -= Math.random() * (0.03 - 0.01) + 0.01;
  }

  scaleCubes() {
    const sizeLeft = this.props.volumeLeft * 0.01 + 1;
    const sizeRight = this.props.volumeRight * 0.01 + 1;

    // this.leftCube.material.color = newColor;
    colorTween(this.leftCube, this.props.volumeRight);
    colorTween(this.rightCube, this.props.volumeLeft);

    // TODO: Tween scale

    // TODO/WTF R/L are swapped because of the camera/scene? hmm
    this.leftCube.scale.set(sizeRight, sizeRight, sizeRight);
    this.rightCube.scale.set(sizeLeft, sizeLeft, sizeLeft);
  }

  // idleAnimation() {
  // TODO: Animate up and down while idle
  // this.leftCube.rotation.y += 0.009;
  // this.rightCube.rotation.y -= 0.009;
  // }

  animate() {
    TWEEN.update();
    // if (this.state.playing) {
    this.rotateCubes();
    this.scaleCubes();
    // } else {
    //   this.idleAnimation();
    // }
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
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

export default Cubes;
