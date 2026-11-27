// Treeyagi, drawn as one SVG per pose from the pack's front-facing frames.
// Pure: no engine calls, so the preview script and the hook share it.
//
// The band shows its picture as an image, where SMIL plays, so each frame is
// an <image> whose visibility steps on its own discrete <animate>.

import { CLIPS, type Clip } from './sprites'

// Frame space is the pack's 160 x 160 cell, ground at y=150. The band's slot
// is 72 x 57, so the view is widened to that shape around the character.
const VIEW = '-14.75 4 189.5 150'

/** Clawd's alt text -> pose, read off the picture token-optimizer drew. */
const ALT_TO_POSE: Record<string, string> = {
  'Clawd: waking up': 'wake',
  'Clawd: watching': 'idle',
  'Clawd: thinking': 'think',
  'Clawd: reading': 'read',
  'Clawd: typing': 'type',
  'Clawd: heavy lifting': 'lift',
  'Clawd: needs you': 'ask',
  'Clawd: writing': 'write',
  'Clawd: compacting': 'compact',
  'Clawd: done': 'done',
  'Clawd: stopped': 'stop',
  'Clawd: dizzy': 'error',
  'Clawd: cold': 'cold',
  'Clawd: napping': 'sleep',
  // Hovering the band: he waves back.
  'Clawd: watching your pointer': 'ask',
}

export function poseForAlt(alt: string): string | null {
  return ALT_TO_POSE[alt] ?? null
}

export function treeyagiAlt(alt: string): string {
  return alt.replace(/^Clawd\b/, 'Treeyagi')
}

export type DrawOptions = { animate: boolean; fadeIn: boolean }

function frames(clip: Clip, animate: boolean): string {
  const total = clip.frames.reduce((s, f) => s + f.ms, 0)
  let at = 0
  return clip.frames.map((f, i) => {
    const start = at / total
    at += f.ms
    const end = at / total
    const img = (vis: string, anim: string) =>
      `<image href="${f.uri}" x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" visibility="${vis}">${anim}</image>`
    if (!animate) return i === 0 ? img('visible', '') : ''
    const last = i === clip.frames.length - 1
    // A one-shot plays once and keeps its last frame.
    const repeat = clip.loop ? ' repeatCount="indefinite"' : ' fill="freeze"'
    const values = i === 0 ? 'visible;hidden' : last ? 'hidden;visible' : 'hidden;visible;hidden'
    const times = i === 0 ? `0;${end.toFixed(4)}` : last ? `0;${start.toFixed(4)}` : `0;${start.toFixed(4)};${end.toFixed(4)}`
    const anim = `<animate attributeName="visibility" values="${values}" keyTimes="${times}" dur="${total}ms" calcMode="discrete"${repeat}/>`
    return img(i === 0 ? 'visible' : 'hidden', anim)
  }).join('')
}

/** The laptop on his lap while he types, with code floating off the screen. */
function laptop(animate: boolean): string {
  const line = (x: number, y: number, w: number, begin: number) =>
    `<rect x="${x}" y="${y}" width="${w}" height="3" rx="1.5" fill="#6be3c9" opacity="${animate ? 0 : 0.7}">` +
    (animate
      ? `<animateTransform attributeName="transform" type="translate" values="0 0;0 -26" dur="1.5s" begin="${begin}s" repeatCount="indefinite"/>` +
        `<animate attributeName="opacity" values="0;0.95;0" keyTimes="0;0.25;1" dur="1.5s" begin="${begin}s" repeatCount="indefinite"/>`
      : '') + '</rect>'
  const bob = animate
    ? `<animateTransform attributeName="transform" type="translate" values="0 0;0 1.2;0 0" dur="0.26s" repeatCount="indefinite"/>`
    : ''
  return `<g>${bob}` +
    // Screen back, facing us, with a little leaf for a logo.
    `<rect x="54" y="98" width="52" height="30" rx="4" fill="#3d3b37"/>` +
    `<rect x="54" y="98" width="52" height="5" rx="2.5" fill="#ffffff" opacity="0.12"/>` +
    `<path d="M80 108c5 0 7 4 7 7c-4 0-8-2-7-7z" fill="#6be3c9"/><path d="M80 108c-4 1-6 4-5 8" stroke="#6be3c9" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
    // Base.
    `<rect x="46" y="127" width="68" height="5" rx="2.5" fill="#2b2a27"/>` +
    '</g>' +
    line(122, 98, 14, 0) + line(126, 108, 9, 0.5) + line(120, 118, 12, 1)
}

export function treeyagiSvg(pose: string, alt: string, opts: DrawOptions): string | null {
  const clip = CLIPS[pose]
  if (!clip) return null
  const body = frames(clip, opts.animate) + (pose === 'type' ? laptop(opts.animate) : '')
  const fade = opts.animate && opts.fadeIn
    ? `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="0s" dur="0.35s" fill="freeze"/>`
    : '<g>'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEW}" role="img" aria-label="${alt}">` +
    `<title>${alt}</title>` + fade +
    `<ellipse cx="80" cy="150" rx="46" ry="4" fill="#1f1e1d" opacity="0.12"/>` +
    body + '</g></svg>'
}
