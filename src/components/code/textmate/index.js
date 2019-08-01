import * as monaco from 'monaco-editor'
import {
  SINGLETON
} from './monaco-theme-registry'
import onigasmPromise from './loadwasm'
import {
  INITIAL,
  Registry,
  parseRawGrammar
} from 'vscode-textmate'
var currentTheme = ''
var jtml = require('./javascripttm.json')

var TokenizerState = (function () {
  function TokenizerState(ruleStack) {
    this.ruleStack = ruleStack
  }
  TokenizerState.prototype.clone = function () {
    return new TokenizerState(this.ruleStack)
  }
  TokenizerState.prototype.equals = function (other) {
    return other instanceof TokenizerState && (other === this || other.ruleStack === this.ruleStack)
  }
  return TokenizerState
}())
var grammarPaths = {
  'source.js': 'grammar.json'
}


function createTextmateTokenizer(grammar, options) {
  return {
    getInitialState: function () {
      return new TokenizerState(INITIAL)
    },
    tokenizeEncoded: function (line, state) {
      var processedLine = line
      if (options.lineLimit !== undefined && line.length > options.lineLimit) {
        processedLine = line.substr(0, options.lineLimit)
      }
      var result = grammar.tokenizeLine2(processedLine, state.ruleStack)
      return {
        endState: new TokenizerState(result.ruleStack),
        tokens: result.tokens
      }
    }
  }
}
async function init(theme) {
  if (theme === currentTheme) {
    return
  }
  currentTheme = theme
  var registry = new Registry({
    theme: SINGLETON.getTheme(theme),
    getOnigLib: () => onigasmPromise,
    loadGrammar: function (scopeName) {
      var path = grammarPaths[scopeName]
      if (path) {
        return new Promise((resolve, reject) => {
          var rawGrammar = parseRawGrammar(JSON.stringify(jtml), path)
          resolve(rawGrammar)
        })
      }
      return null
    }
  })
  const grammar = await registry.loadGrammarWithConfiguration('source.js', 42, {})
  monaco.languages.setTokensProvider('javascript', createTextmateTokenizer(grammar, {}))
  monaco.editor.setTheme(theme)
}

export default {
  init: init
}
