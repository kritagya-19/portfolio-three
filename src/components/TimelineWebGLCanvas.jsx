import { useEffect, useRef } from 'react'

/**
 * Native WebGL ambient particle stream for the Timeline section.
 * Zero external libraries, hardware-accelerated 60/120fps background.
 * Uses cream (#F4E7CD) and peach (#FDC3A1) palette at low opacity.
 */
export default function TimelineWebGLCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl =
      canvas.getContext('webgl', { alpha: true, antialias: true }) ||
      canvas.getContext('experimental-webgl', { alpha: true, antialias: true })

    if (!gl) return

    // Vertex shader
    const vsSource = `
      attribute vec3 a_position;
      attribute float a_size;
      attribute float a_alpha;
      attribute float a_color_mix;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      varying float v_alpha;
      varying float v_color_mix;

      void main() {
        vec3 pos = a_position;

        // Subtle ambient harmonic drift
        pos.y += sin(u_time * 0.45 + a_position.x * 3.14) * 0.04;
        pos.x += cos(u_time * 0.35 + a_position.y * 3.14) * 0.03 + (u_mouse.x - 0.5) * 0.05;

        // Keep inside normalized device coordinates [-1, 1]
        pos.y = mod(pos.y + 1.0, 2.0) - 1.0;
        pos.x = mod(pos.x + 1.0, 2.0) - 1.0;

        gl_Position = vec4(pos.xy, 0.0, 1.0);
        gl_PointSize = a_size * (u_resolution.y / 700.0);

        v_alpha = a_alpha * (0.6 + 0.4 * sin(u_time * 0.8 + a_position.z * 6.28));
        v_color_mix = a_color_mix;
      }
    `

    // Fragment shader: soft circular points with editorial palette tint
    const fsSource = `
      precision mediump float;

      varying float v_alpha;
      varying float v_color_mix;

      uniform vec3 u_color_cream;
      uniform vec3 u_color_peach;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        float smoothEdge = smoothstep(0.5, 0.05, dist);
        vec3 col = mix(u_color_cream, u_color_peach, v_color_mix);

        gl_FragColor = vec4(col, smoothEdge * v_alpha * 0.38);
      }
    `

    function createShader(glCtx, type, source) {
      const shader = glCtx.createShader(type)
      glCtx.shaderSource(shader, source)
      glCtx.compileShader(shader)
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource)
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource)
    if (!vs || !fs) return

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return

    gl.useProgram(program)

    // Particle setup
    const PARTICLE_COUNT = 160
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const alphas = new Float32Array(PARTICLE_COUNT)
    const colorMixes = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 0] = Math.random() * 2 - 1
      positions[i * 3 + 1] = Math.random() * 2 - 1
      positions[i * 3 + 2] = Math.random() * 2 - 1

      sizes[i] = Math.random() * 5.0 + 2.0
      alphas[i] = Math.random() * 0.55 + 0.25
      colorMixes[i] = Math.random() > 0.7 ? 1.0 : 0.0 // mostly cream (#F4E7CD), some peach (#FDC3A1)
    }

    function createBuffer(data, attribLocation, size) {
      const buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
      gl.enableVertexAttribArray(attribLocation)
      gl.vertexAttribPointer(attribLocation, size, gl.FLOAT, false, 0, 0)
      return buffer
    }

    const posLoc = gl.getAttribLocation(program, 'a_position')
    const sizeLoc = gl.getAttribLocation(program, 'a_size')
    const alphaLoc = gl.getAttribLocation(program, 'a_alpha')
    const colorMixLoc = gl.getAttribLocation(program, 'a_color_mix')

    const posBuf = createBuffer(positions, posLoc, 3)
    const sizeBuf = createBuffer(sizes, sizeLoc, 1)
    const alphaBuf = createBuffer(alphas, alphaLoc, 1)
    const colorMixBuf = createBuffer(colorMixes, colorMixLoc, 1)

    // Uniforms
    const uRes = gl.getUniformLocation(program, 'u_resolution')
    const uTime = gl.getUniformLocation(program, 'u_time')
    const uMouse = gl.getUniformLocation(program, 'u_mouse')
    const uCream = gl.getUniformLocation(program, 'u_color_cream')
    const uPeach = gl.getUniformLocation(program, 'u_color_peach')

    // Set colors: cream #F4E7CD (244, 231, 205) and peach #FDC3A1 (253, 195, 161)
    gl.uniform3f(uCream, 244 / 255, 231 / 255, 205 / 255)
    gl.uniform3f(uPeach, 253 / 255, 195 / 255, 161 / 255)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    let mouseX = 0.5
    let mouseY = 0.5
    let targetMouseX = 0.5
    let targetMouseY = 0.5

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      if (rect.height <= 0 || rect.width <= 0) return
      targetMouseX = (e.clientX - rect.left) / rect.width
      targetMouseY = (e.clientY - rect.top) / rect.height
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth
      const h = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr
        canvas.height = h * dpr
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.uniform2f(uRes, canvas.width, canvas.height)
      }
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    let animId = 0
    let startTime = performance.now()

    const render = (now) => {
      const elapsed = (now - startTime) * 0.001
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.uniform1f(uTime, elapsed)
      gl.uniform2f(uMouse, mouseX, mouseY)

      gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT)

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', resize)
      gl.deleteBuffer(posBuf)
      gl.deleteBuffer(sizeBuf)
      gl.deleteBuffer(alphaBuf)
      gl.deleteBuffer(colorMixBuf)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.85 }}
      aria-hidden="true"
    />
  )
}

