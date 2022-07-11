/* eslint-disable react/display-name */
import React, { forwardRef, useMemo } from "react";
import { Uniform } from "three";
import { Effect } from "postprocessing";

const fragmentShader = `
  uniform sampler2D tDiffuse;
  uniform vec3 uTint;

  varying vec2 vUv;

  void main()
  {
    vec4 color = texture2D(tDiffuse, vUv);
    color.rgb += uTint;

    gl_FragColor = color;
  }
`;

let _uParam;

// Effect implementation
class TintEffectImpl extends Effect {
  constructor({ param = 0.1 } = {}) {
    super("TintEffect", fragmentShader, {
      uniforms: new Map([["param", new Uniform(param)]]),
    });

    _uParam = param;
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get("param").value = _uParam;
  }
}

// Effect component
export const TintEffect = forwardRef(({ param }, ref) => {
  const effect = useMemo(() => new TintEffectImpl(param), [param]);
  return <primitive ref={ref} object={effect} dispose={null} />;
});
