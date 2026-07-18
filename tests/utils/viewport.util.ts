export const DEFAULT_TEST_VIEWPORT_WIDTH = 1280

export function setTestViewport(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
    writable: true,
  })
  window.dispatchEvent(new Event("resize"))
}
