import * as THREE from 'three';
import {Vector2} from 'three';
import {extend} from '@react-three/fiber';

export class SphericalGradientMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        resolution: {value: new Vector2(0, 0)},
        noise: {value: 0.02}
      },
      vertexShader: /* language=GLSL */ `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* language=GLSL */ `
        uniform vec2 resolution;
        uniform float noise;
        #define VIG_REDUCTION_POWER 1.5 // 1.25
        #define VIG_BOOST 1.5 // 1.1
        float random(vec3 scale, float seed){ return fract(sin(dot(gl_FragCoord.xyz+seed, scale))*43758.5453+seed); }
        void main() {
          vec3 color = vec3(1.);
//          vec3 tint = vec3(0.345, 0.584, 0.8);
          vec3 tint = vec3(0.2532, 0.2961, 0.4506);
          vec2 center = resolution * 0.5;
          float vignette = distance(center, gl_FragCoord.xy) / resolution.x;
          vec3 tintedColor = mix(color, tint, vignette);
          vignette = VIG_BOOST - vignette * VIG_REDUCTION_POWER;
          float n = noise * (.5 - random(vec3(1.), length(gl_FragCoord)));
//          gl_FragColor = vec4(color * vec3(vignette) + vec3(n), 1.);
          gl_FragColor = vec4(tintedColor + vec3(n), 1.);
        }`
    });
  }
}

extend({SphericalGradientMaterial});
