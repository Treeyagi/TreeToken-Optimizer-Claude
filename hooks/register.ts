// Treeyagi in the Token Optimizer band.
//
// Token Optimizer draws its band row with Clawd as an <Svg> whose alt says
// what he is doing ("Clawd: typing"). This hook sits over that row, lets
// Token Optimizer draw it, and swaps each Clawd picture for the matching
// Treeyagi one. Nothing in Token Optimizer is edited, so its updates keep it.

import type { Register } from 'claude-code'
import { poseForAlt, treeyagiAlt, treeyagiSvg } from './treeyagi'

type Node = { type?: unknown; props?: Record<string, unknown>; children?: unknown }

const cache = new Map<string, string | null>()

function picture(pose: string, alt: string, animate: boolean, fadeIn: boolean): string | null {
  const key = `${pose}|${alt}|${animate}|${fadeIn}`
  if (!cache.has(key)) cache.set(key, treeyagiSvg(pose, alt, { animate, fadeIn }))
  return cache.get(key) ?? null
}

function swapClawd(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(swapClawd)
  if (node === null || typeof node !== 'object') return node
  const el = node as Node
  const alt = el.props?.alt
  if (el.type === 'Svg' && typeof alt === 'string' && alt.startsWith('Clawd')) {
    const pose = poseForAlt(alt)
    if (pose === null) return node
    const old = String(el.props?.source ?? '')
    // Follow Token Optimizer's own choices: still when it draws him still
    // (TOKEN_OPTIMIZER_STATUS_BAR_ANIMATE=0), a fade only on a pose change.
    const newAlt = treeyagiAlt(alt)
    const source = picture(pose, newAlt, old.includes('<animate'), old.includes('fill="freeze"'))
    return source === null ? node : { ...el, props: { ...el.props, source, alt: newAlt } }
  }
  if (el.children !== undefined) return { ...el, children: swapClawd(el.children) }
  return node
}

export const register: Register = on => {
  on('ui.render', { component: 'AbovePrompt', plugin: 'token-optimizer' }, async ($, e, next) => {
    const tree = await next(e)
    if (e.surface !== 'desktop' && e.surface !== 'mobile' && e.surface !== 'vscode') return tree
    return swapClawd(tree) as typeof tree
  })
}
