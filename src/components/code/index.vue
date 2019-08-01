<template>
  <div class="codeviewer">
    <div class="editor" ref="editor"></div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .codeviewer {
    height: 100%;
    width: 100%;

    .editor {
      height: 100%;
      width: 100%;
    }

    .theme {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
</style>

<script type="text/ecmascript-6">
  /**
   * 代码编辑器
   */
  import BaseComponent from 'src/extend/BaseComponent'
  import * as monaco from 'monaco-editor'
  import textmate from './textmate'
  window.textmate = textmate
  var debounce = require('lodash/debounce')
  export default {
    mixins: [BaseComponent],
    name: 'CodeViewer',
    props: {
      ctype: {
        type: String,
        default: 'javascript'
      },
      highlight: Object,
      contents: {
        type: String,
        default: ''
      },
      options: {
        type: Object,
        default: function () {
          return {}
        }
      },
      // 内容变化后会调用
      onChange: {
        type: Function,
        default: function () {
        }
      },
      dirty: {
        default: false,
        type: [Boolean, Number]
      },
      ctrls: Boolean
    },
    editor: null,
    data: function () {
      return {
        themes: ['dark-plus', 'light-plus', 'onemonokai', 'sublime'],
        theme: window.localStorage.getItem('monacotheme') || 'dark-plus',
        savedContent: '',
        mEditor: null,
        codeChangeEmitter: null
      }
    },
    watch: {
      theme: {
        handler: function (theme) {
          window.localStorage.setItem('monacotheme', theme)
          textmate.init(theme)
        }
      },
      contents: function (newVal) {
        if (this.mEditor) {
          if (newVal != this.mEditor.getValue()) {
            this.mEditor.setValue(newVal || '') // editor初始化
          }
        }
      },
      ctype: function (val, old) {
        if (val != old) this.initEditor()
      },
      highlight: {
        handler ({line, start, end} = {}) {
          var that = this
          if (!line || !start || !end) return
          if (!this.mEditor) return setTimeout(highlight.bind(this), 100)
          highlight()
          function highlight () {
            var editor = that.mEditor
            editor.focus()
            editor.revealLineInCenter(line)
            // editor.setPosition({lineNumber: line, column: end})
            editor.setSelection({
              selectionStartLineNumber: line,
              positionLineNumber: line,
              selectionStartColumn: start,
              positionColumn: end,
            })
          }
        },
        immediate: true
      }
    },
    mounted () {
      this.$nextTick(this.initEditor)
    },
    beforDestroy: function () {
      if (this.mEditor) {
        this.mEditor.container.remove()
      }
    },
    methods: {
      async initEditor () {
        var that = this
        this.mEditor = monaco.editor.create(this.$refs.editor, dealOptions())
        this.mEditor.onDidChangeModelContent(event => {
          that.editorChange(event)
        })
        this.mEditor.getModel().updateOptions({tabSize: 2})
        this.addAction(this.mEditor)
        if (this.ctrls) {
          this.mEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
            var content = this.mEditor.getValue()
            this.$emit('ctrls', content)
            that.$emit('update:dirty', 0)
            that.savedContent = content
          })
        }
        setTimeout(v => {
          textmate.init(this.theme)
        }, 500)
        this.changeContent()
        this.savedContent = this.contents
        function dealOptions () {
          var type = that.ctype || 'javascript'
          return Object.assign({}, {
            language: type,
            theme: that.theme,
            lineNumbers: type === 'javascript' ? 'on' : 'off',
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            scrollbar: {
              verticalScrollbarSize: 5,
              horizontalScrollbarSize: 5,
            }
          }, that.options || {})
        }
      },
      addAction: function (editor) {
        var me = this
        editor.addAction({
          // An unique identifier of the contributed action.
          id: 'nextchangeTheme',
          // A label of the action that will be presented to the user.
          label: '下一个主题',
          // An optional array of keybindings for the action.
          keybindings: [
            monaco.KeyCode.F4,
            // chord
            monaco.KeyMod.chord(monaco.KeyCode.F4)
          ],
          // A precondition for this action.
          precondition: null,
          // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
          keybindingContext: null,
          contextMenuGroupId: 'navigation',
          contextMenuOrder: 1.5,
          run: function (ed) {
            me.nextTheme(1)
            return null
          }
        })
        editor.addAction({
          // An unique identifier of the contributed action.
          id: 'prevchangeTheme',
          // A label of the action that will be presented to the user.
          label: '上一个主题',
          // An optional array of keybindings for the action.
          keybindings: [
            monaco.KeyCode.F3,
            // chord
            monaco.KeyMod.chord(monaco.KeyCode.F3)
          ],
          // A precondition for this action.
          precondition: null,
          // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
          keybindingContext: null,
          contextMenuGroupId: 'navigation',
          contextMenuOrder: 1.5,
          run: function (ed) {
            me.nextTheme(-1)
            return null
          }
        })
      },
      editorChange: function (e) {
        var that = this
        if (that.codeChangeEmitter) {
          this.codeChangeEmitter(e)
        } else {
          this.codeChangeEmitter = debounce(e => {
            var content = this.mEditor.getValue()
            that.$emit('update:contents', content)
            that.$emit('update:dirty', content !== this.savedContent)
            that.onChange(content)
          }, 500)
        }
      },
      nextTheme: function (flag) {
        let index = this.themes.indexOf(this.theme)
        if (flag < 0) {
          index = index - 1
          if (index < 0) {
            index = this.themes.length - 1
          }
        } else {
          index = index + 1
          if (index == this.themes.length) {
            index = 0
          }
        }
        this.theme = this.themes[index]
      },
      changeContent: function () {
        this.mEditor.setValue(this.contents || '')
      }
    }
  }
</script>

