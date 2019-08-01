export default {
  EditorHistory: [],
  index: -1, // 未初始化
  maxLength: 50,
  getPrev: function () {
    var prev = this.index - 1
    var prevData = this.EditorHistory[prev]
    if (prevData) {
      this.index = prev
      try {
        prevData = JSON.parse(prevData)
      } catch (e) {
        prevData = null
      }
    }
    return prevData
  },
  getNext: function () {
    var next = this.index + 1
    var nextData = this.EditorHistory[next]
    if (nextData) {
      this.index = next
      try {
        nextData = JSON.parse(nextData)
      } catch (e) {
        nextData = null
      }
    }
    return nextData
  },
  add: function (data) {
    if (!data) return
    var index = this.index
    var startIndex = 0
    var length = this.EditorHistory.length
    if (!(index == length - 1 && length < this.maxLength)) {
      startIndex = Math.max(index + 2 - this.maxLength, 0)
      this.EditorHistory = this.EditorHistory.slice(startIndex, index + 1)
    }
    this.EditorHistory.push(JSON.stringify(data))
    this.index = this.EditorHistory.length - 1
  }
}
