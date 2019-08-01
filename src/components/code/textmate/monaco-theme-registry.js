/********************************************************************************
把现有主题进行注册
 ********************************************************************************/
import * as monaco from 'monaco-editor'
import {
    Registry
} from 'vscode-textmate'

export class MonacoThemeRegistry {
    constructor () {
        this.themes = {}
    }

    getTheme (name) {
        return this.themes[name]
    }

    /**
     * Register VS Code compatible themes
     */
    register (json, includes, givenName, monacoBase) {
        const name = givenName || json.name
        const result = {
            name,
            base: monacoBase || 'vs',
            inherit: true,
            colors: {},
            rules: [],
            settings: []
        }
        if (this.themes[name]) {
            return this.themes[name]
        }
        this.themes[name] = result
        if (typeof json.include !== 'undefined') {
            if (!includes || !includes[json.include]) {
                console.error(`Couldn't resolve includes theme ${json.include}.`)
            } else {
                const parentTheme = this.register(includes[json.include], includes)
                Object.assign(result.colors, parentTheme.colors)
                result.rules.push(...parentTheme.rules)
                result.settings.push(...parentTheme.settings)
            }
        }
        if (json.tokenColors) {
            result.settings.push(...json.tokenColors)
        }
        if (json.colors) {
            Object.assign(result.colors, json.colors)
            result.encodedTokensColors = Object.keys(result.colors).map(key => result.colors[key])
        }
        if (monacoBase && givenName) {
            for (const setting of result.settings) {
                this.transform(setting, rule => result.rules.push(rule))
            }
            const reg = new Registry()
            reg.setTheme(result)
            result.encodedTokensColors = reg.getColorMap()
            // index 0 has to be set to null as it is 'undefined' by default, but monaco code expects it to be null
            // tslint:disable-next-line:no-null-keyword
            result.encodedTokensColors[0] = null
            // index 1 and 2 are the default colors
            if (result.colors && result.colors['editor.foreground']) {
                result.encodedTokensColors[1] = result.colors['editor.foreground']
            }
            if (result.colors && result.colors['editor.background']) {
                result.encodedTokensColors[2] = result.colors['editor.background']
            }
            monaco.editor.defineTheme(givenName, result)
        }
        return result
    }

    transform (tokenColor, acceptor) {
        if (typeof tokenColor.scope === 'undefined') {
            tokenColor.scope = ['']
        } else if (typeof tokenColor.scope === 'string') {
            // tokenColor.scope = tokenColor.scope.split(',').map((scope: string) => scope.trim()); // ?
            tokenColor.scope = [tokenColor.scope]
        }

        for (const scope of tokenColor.scope) {
            // Converting numbers into a format that monaco understands
            const settings = Object.keys(tokenColor.settings).reduce((previous, current) => {
                let value = tokenColor.settings[current]
                if (typeof value === typeof '') {
                    value = value.replace(/^\#/, '').slice(0, 6)
                }
                previous[current] = value
                return previous
            }, {})

            acceptor({
                ...settings,
                token: scope
            })
        }
    }
}

export const SINGLETON = new MonacoThemeRegistry()

export const DARK_DEFAULT_THEME = SINGLETON.register(
    require('../theme/dark_plus.json'), {
        './dark_defaults.json': require('../theme/dark_defaults.json'),
        './dark_vs.json': require('../theme/dark_vs.json')
    }, 'dark-plus', 'vs-dark').name
export const LIGHT_DEFAULT_THEME = SINGLETON.register(require('../theme/light_plus.json'), {
    './light_defaults.json': require('../theme/light_defaults.json'),
    './light_vs.json': require('../theme/light_vs.json')
}, 'light-plus', 'vs').name
export const ONEMONOKAI = SINGLETON.register(require('../theme/OneMonokai-color-theme.json'), {
}, 'onemonokai', 'vs-dark').name
export const SUBLIME = SINGLETON.register(require('../theme/sublime.json'), {
}, 'sublime', 'vs-dark').name
