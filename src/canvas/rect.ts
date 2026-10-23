import type { Rect } from "./camera";

/** An element's box in world coordinates. Uses offsets, so the camera transform doesn't affect it. */
export function rectIn(el: HTMLElement, world: HTMLElement): Rect {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== world) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}
