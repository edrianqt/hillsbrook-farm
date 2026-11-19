/**
 * A synthesised "moo" made with the browser's Web Audio API, so there is no sound file to download.
 * Sound only plays after a visitor turns it on (browsers require a click before any audio).
 */
let ctx: AudioContext | null = null

/** Call from a click: prepares the audio engine. */
export function unlockAudio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
}

/** Play one moo. Calves moo higher and shorter. */
export function moo(calf = false) {
  if (!ctx || ctx.state !== 'running') return
  const now = ctx.currentTime
  const pitch = calf ? 1.7 : 1 + (Math.random() - 0.5) * 0.12
  const length = calf ? 0.8 : 1.35

  const out = ctx.createGain()
  out.gain.setValueAtTime(0.0001, now)
  out.gain.exponentialRampToValueAtTime(0.32, now + 0.12)
  out.gain.setValueAtTime(0.32, now + length * 0.6)
  out.gain.exponentialRampToValueAtTime(0.0001, now + length)

  // a throat-like filter that "opens" then closes: m-OOO-oo
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.Q.value = 4
  filter.frequency.setValueAtTime(380, now)
  filter.frequency.linearRampToValueAtTime(950, now + length * 0.3)
  filter.frequency.linearRampToValueAtTime(420, now + length)

  // slight wobble in the voice
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 5.5
  lfoGain.gain.value = 3 * pitch

  const voices = [0, 7].map((detune) => {
    const osc = ctx!.createOscillator()
    osc.type = 'sawtooth'
    osc.detune.value = detune
    osc.frequency.setValueAtTime(150 * pitch, now)
    osc.frequency.linearRampToValueAtTime(120 * pitch, now + length * 0.25)
    osc.frequency.linearRampToValueAtTime(112 * pitch, now + length * 0.7)
    osc.frequency.linearRampToValueAtTime(92 * pitch, now + length)
    lfoGain.connect(osc.frequency)
    osc.connect(filter)
    return osc
  })

  lfo.connect(lfoGain)
  filter.connect(out)
  out.connect(ctx.destination)
  ;[lfo, ...voices].forEach((o) => {
    o.start(now)
    o.stop(now + length + 0.05)
  })
}
