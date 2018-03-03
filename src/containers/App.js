import React, { Component } from 'react';
import * as THREE from 'three';

import autobind from 'utilities/autobind';
import StarField from 'components/StarField';
import Menu from 'components/Menu';

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

class App extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    this.setupScene();
    this.volumeLeft = 1;
    this.volumeRight = 1;
  }
  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  onResize(){
    const width = window.innerWidth > 1000 ? 1000 : window.innerWidth;
    const height = width * .75;
    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize( width, height );
  }

  setupScene() {
    const width = window.innerWidth > 1000 ? 1000 : window.innerWidth;
    const height = width * .75;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(20, width / height, 1, 1000);
    camera.position.z = 45;
    camera.position.y = -28.5;

    const ambient = new THREE.AmbientLight(0xffffff, 0.35); // soft white light
    const directional = new THREE.DirectionalLight(0xffffff, 0.7);
    directional.position.set(0, 0, 900);
    scene.add(ambient, directional);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
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
    this.analyzeAudio();
    window.addEventListener( 'resize', this.onResize, false );
  }

  start() {
    this.frameId = this.frameId || requestAnimationFrame(this.animate);
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  addCubes() {
    const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: 0x69ea78 });
    const leftCube = new THREE.Mesh(geometry, material);
    const rightCube = new THREE.Mesh(geometry, material);
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
    const sizeLeft = this.volumeLeft * 0.01 + 1;
    const sizeRight = this.volumeRight * 0.01 + 1;

    // TODO Vocal frequencies for red coloring?
    // TODO/WTF R/L are swapped because of the camera/scene? hmm
    //
    this.leftCube.scale.set(sizeRight, sizeRight, sizeRight);
    this.rightCube.scale.set(sizeLeft, sizeLeft, sizeLeft);
    // orange 237	192	115
    // red: 166	53	2
  }

  analyzeAudio() {
    const audio = new Audio();
    audio.crossOrigin = 'Anonymous';
    audio.src = '/src/songs/sample.mp3';
    audio.play();
    const context = new AudioContext();
    const src = context.createMediaElementSource(audio);
    const analyserLeft = context.createAnalyser();
    const analyserRight = context.createAnalyser();

    analyserLeft.fftSize = 32;
    analyserLeft.smoothingTimeConstant = 0.3;
    analyserRight.fftSize = 32;
    analyserRight.smoothingTimeConstant = 0.3;

    const splitter = context.createChannelSplitter(2);

    src.connect(splitter);

    splitter.connect(analyserRight, 1, 0);
    splitter.connect(analyserLeft, 0, 0);

    analyserLeft.connect(context.destination);
    analyserRight.connect(context.destination);

    const bufferLengthLeft = analyserLeft.frequencyBinCount;
    const dataArrayLeft = new Uint8Array(bufferLengthLeft);

    const bufferLengthRight = analyserRight.frequencyBinCount;
    const dataArrayRight = new Uint8Array(bufferLengthRight);

    const renderFrame = () => {
      requestAnimationFrame(renderFrame);
      analyserLeft.getByteFrequencyData(dataArrayLeft);
      analyserRight.getByteFrequencyData(dataArrayRight);

      this.volumeLeft = average(dataArrayLeft);
      this.volumeRight = average(dataArrayRight);
    };

    renderFrame();

    this.audio = audio;
  }

  // idleAnimation() {
    // TODO: Animate up and down while idle
    // this.leftCube.rotation.y += 0.009;
    // this.rightCube.rotation.y -= 0.009;
  // }

  animate() {
    // if (this.state.playing) {
    this.rotateCubes();
    this.scaleCubes();
    // } else {
    //   this.idleAnimation();
    // }
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  // TODO: Responsive render

  playOrPause() {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div>
        <div id="canvas" />
        <div
          className="cubes"
          ref={mount => {
            this.mount = mount;
          }}
        />
        <Menu />
        <div className="dashboard" />
        <StarField />
      </div>
    );
  }
}

export default App;
