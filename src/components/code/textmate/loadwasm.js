import {
  loadWASM,
  OnigScanner,
  OnigString
} from 'onigasm'
export const isBasicWasmSupported = typeof window.WebAssembly !== 'undefined'

export function fetchOnigasm () {
  return new Promise((resolve, reject) => {
    const request = new window.XMLHttpRequest()

    request.onreadystatechange = function () {
      if (this.readyState === window.XMLHttpRequest.DONE) {
        if (this.status === 200) {
          resolve(this.response)
        } else {
          reject(new Error('Could not fetch onigasm'))
        }
      }
    }

    request.open('GET', './onigasm.wasm', true)
    request.responseType = 'arraybuffer'
    request.send()
  })
}
export class OnigasmLib {
  createOnigScanner (sources) {
    return new OnigScanner(sources)
  }
  createOnigString (sources) {
    return new OnigString(sources)
  }
}
const onigasmPromise = isBasicWasmSupported ? fetchOnigasm().then(async buffer => {
  await loadWASM(buffer)
  return new OnigasmLib()
}) : Promise.reject(new Error('wasm not supported'))
export default onigasmPromise
