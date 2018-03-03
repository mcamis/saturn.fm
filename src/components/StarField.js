import React, { Component } from 'react';
import * as THREE from 'three';
import autobind from 'utilities/autobind';

const randomSize = () => Math.random() * (6 - 2) + 2;
const randomPosition = () => Math.random() * 1000 - 500;
class StarField extends Component {
  constructor(props) {
    super(props);

    autobind(this);
  }

  componentDidMount() {
    this.setupScene();
  }

  componentWillUnmount() {
    this.mount.removeChild(this.renderer.domElement);
    this.stop();
  }

  onResize(){
    const width = window.innerWidth > 1000 ? 1000 : window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize( width, height );
  }

  setupScene() {
    const width = window.innerWidth > 1000 ? 1000 : window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    camera.position.z = 500;

    renderer.setPixelRatio(window.devicePixelRatio * 0.25);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // the default

    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;
    this.stars = this.stars || [];
    this.mount.appendChild(this.renderer.domElement);
    this.start();
    this.addStars();
    window.addEventListener( 'resize', this.onResize, false );
  }

  start() {
    this.frameId = this.frameId || requestAnimationFrame(this.animate);
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  animate() {
    this.animateStars();
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  addStars() {
    const geometry = new THREE.BoxGeometry(0.75, 0.75, 0.75);

    for (let z = -1000; z < 1000; z += 20) {
      let material;
      if (z > 0 && z < 20) {
        material = new THREE.MeshBasicMaterial({ color: 0xff757a });
      } else {
        material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      }

      const sphere = new THREE.Mesh(geometry, material);

      sphere.position.x = randomPosition();
      sphere.position.y = randomPosition();
      sphere.position.z = z;

      sphere.scale.set(randomSize(), randomSize(), 1);

      this.scene.add(sphere);
      this.stars.push(sphere);
    }
  }

  animateStars() {
    this.stars.forEach(star => {
      const animatedStar = star;

      animatedStar.position.z += Math.random() * (8 - 4) + 4;

      // if the particle is too close move it to the back
      if (animatedStar.position.z > 1000) {
        animatedStar.position.z -= 1100;
        animatedStar.position.x = randomPosition();
        animatedStar.position.y = randomPosition();
      }
    });
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div className="StarField">
        <div
          ref={mount => {
            this.mount = mount;
          }}
        />
      </div>
    );
  }
}

export default StarField;
