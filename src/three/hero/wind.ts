import type { Material } from 'three'

/** One shared clock value for every swaying plant (updated each frame by the scene). */
export const windUniform = { value: 0 }

/**
 * Makes an instanced plant material sway in the breeze.
 * The tips move, the base stays put, and each plant sways a little differently.
 */
export function addWind(material: Material, strength = 0.08) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = windUniform
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        #ifdef USE_INSTANCING
          vec3 basePos = instanceMatrix[3].xyz;
        #else
          vec3 basePos = vec3(0.0);
        #endif
        float sway = sin(uTime * 1.6 + basePos.x * 0.7 + basePos.z * 0.5) + 0.4 * sin(uTime * 3.1 + basePos.x * 1.9);
        transformed.x += sway * ${strength.toFixed(3)} * max(position.y, 0.0);
        transformed.z += sway * ${(strength * 0.5).toFixed(3)} * max(position.y, 0.0);`,
      )
  }
  material.customProgramCacheKey = () => `wind-${strength}`
  return material
}
