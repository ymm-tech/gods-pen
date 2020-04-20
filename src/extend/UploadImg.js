import plupload from 'plupload'
import {
  getBlobBydataURI,
  readAsDataURL
} from './Util'
import Server from '../extend/Server'
var getUploadConfig = function (callback) {
  Server({
    url: 'upload/getTocken',
    method: 'get', // default
    needLoading: false,
    data: {}
  }).then((respond) => {
    var data = respond.data.data
    callback(data)
  })
}

var UploadImage = function ({
  id,
  skipSizeCheck,
  filters,
  isAddUploadFile,
  callback
}) {
  this.imgSrc = ''
  var uploadControll = false
  var me = this
  var acceptFilters = {
    image: {
      title: '资源选择',
      extensions: 'jpg,gif,png,jpeg'
    },
    video: {
      title: '资源选择',
      extensions: 'mp4'
    },
    audio: {
      title: '资源选择',
      extensions: 'mp3'
    },
    file: {
      title: '资源选择',
      extensions: 'csv,json,txt'
    }
  }
  if (window.mOxie) window.mOxie.Mime.mimes.csv = '.csv' // csv mime hack
  this.uploader = new plupload.Uploader({
    runtimes: 'html5',
    browse_button: id,
    url: 'https://oss.aliyuncs.com',
    filters: [acceptFilters[filters]],
    prevent_duplicates: true,
    max_file_size: '100mb',
    init: {
      PostInit() {},
      FilesAdded(up, files) {
        if (uploadControll) {
          return false
        }
        uploadControll = true
        let that = this
        let name = files[0].name
        if (isAddUploadFile) {
          let pos = name.lastIndexOf('.')
          if (pos !== -1) {
            name = 'ymm_' + new Date().getTime() + name.substring(pos)
          }
          readAsDataURL(files[0].getNative(), function (src) {
            var filesSource = new window.File([getBlobBydataURI(src, files[0].type)], name, {
              type: files[0].type
            })
            that.addFile(filesSource)
            that.removeFile(files[0])
            me.send(name)
          })
        }
      },
      BeforeUpload(up, file) {},
      UploadProgress(up, file) {},
      FileUploaded(up, file, info) {
        if (info.status === 200) {
          me.imgSrc = me.imgSrc.replace('ymm.oss-cn-hangzhou.aliyuncs.com', 'imagecdn.ymm56.com')
          callback(me.imgSrc)
        } else {}
        uploadControll = false
      },
      Error(up, err) {}
    }
  })
  this.uploader.init()
}

UploadImage.prototype.send = function (name) {
  var fileName = name || 'ymm' + new Date().getTime() + '.png'
  getUploadConfig((configUplaod) => {
    configUplaod.key = configUplaod.dir + 'resource/' + fileName
    this.imgSrc = configUplaod.host + '/' + configUplaod.key
    let newMultipartParams = {
      'key': configUplaod.key,
      'policy': configUplaod.policy,
      'OSSAccessKeyId': configUplaod.accessid,
      'success_action_status': '200',
      'signature': configUplaod.signature
    }
    console.log('newMultipartParams', newMultipartParams)
    this.uploader.setOption({
      'url': configUplaod.host,
      'multipart_params': newMultipartParams
    })
    this.uploader.start()
  })
}
export default UploadImage
