import React from 'react'
import Store from '../../state/main'
import reactor from '../../state/reactor'
import {s3UrlForImage} from '../../state/utils'
import {layerImagesRef} from '../../state/firebaseRefs'
import Notification from '../Notification'
import {compositeTwoImages, replaceSvgImageWithText, svgLayerIds} from '../../utils'
var allLayersInSvg = svgEl => {
  return svgLayerIds.every(id => svgEl.querySelector(`#${id}`) != null)
}

export default React.createClass({
  mixins: [reactor.ReactMixin],
  getDataBindings() {
    return {layerImageUploaded: ['layerImageUploaded']}
  },

  getInitialState() {
    return {file: null,
            fileUrl: null,
            fileSvgEl: null,
            compositeFile: null,
            compositeFileUrl: null,
            compositeFileSvgEl: null,
            blendedImageUrl: null,
            isUploadInProgress: false,
            errors: [],
            messages: []}
  },

  componentDidUpdate(prevProps, prevState) {
    var layerImageUploaded = this.state.layerImageUploaded
    if (layerImageUploaded != null && prevState.layerImageUploaded !== layerImageUploaded) {
      var messages = [`Layer image successfully uploaded at url: ${layerImageUploaded.get('imageUrl')}`]
      this.setState({messages: messages, isUploadInProgress: false})
    }

    var file = this.state.file
    var baseSvg = this.state.fileSvgEl
    var compositeFile = this.state.compositeFile
    var topSvg = this.state.compositeFileSvgEl
    if ((file != null && compositeFile != null) &&
        (file !== prevState.file || compositeFile !== prevState.compositeFile)) {
      this.setState({blendedImageUrl: compositeTwoImages(200, baseSvg, topSvg)})
    }
  },

  setIfImageIsNew(propName, file) {
    var imageUrl = s3UrlForImage(file.name)
    layerImagesRef.orderByChild(propName).equalTo(imageUrl).once('value', snapshot => {

      var existingImageUrl = snapshot.val()
      if (existingImageUrl != null) {
        this.setState({errors: [`A layer image already exists with that URL: ${imageUrl}`]})
        return
      }

      var self = this
      var reader = new FileReader()
      reader.onloadend = e => {
        if ('srcElement' in e && 'result' in e.srcElement) {
          let svgText = e.srcElement.result
          let parser = new DOMParser()
          let svgEl = parser.parseFromString(svgText, 'image/svg+xml').children[0]

          if (propName === 'imageUrl' && !allLayersInSvg(svgEl)) {
            let err = 'The SVG file you selected does not have all the required layers.'
            err += ` The layers are: ${svgLayerIds.join(', ')}`
            self.setState({errors: [err]})
          } else {
            var newState = (propName === 'imageUrl' ?
               {file: file,
                fileUrl: URL.createObjectURL(file),
                fileSvgEl: svgEl}
               : {compositeFile: file,
                  compositeFileUrl: URL.createObjectURL(file),
                  compositeFileSvgEl: svgEl}
              )
              this.setState(newState)
          }
        }
      }
      reader.readAsText(file)
    })
  },

  fileSelected(imageProp, e) {
    if (e.target.files.length > 0) {
      var file = e.target.files[0]
      var errors = []
      if (file.type !== 'image/svg+xml') {
        errors.push('You can only use svg images for layers.')
      } else {
        this.setIfImageIsNew(imageProp, file)
      }
      this.setState({errors: errors})
    }
  },

  uploadFile(e) {
    e.preventDefault()
    if (this.state.compositeFile) {
      console.log('IN COMPosite')
      Store.actions.uploadLayerImageWithCompositeToS3({
        base: this.state.file,
        top: this.state.compositeFile
      })
    } else if (!this.state.isUploadInProgress) {
      this.setState({isUploadInProgress: true})
      Store.actions.uploadLayerImageToS3(this.state.file)
    }
  },

  clearMessages() {
    this.setState({messages: []})
  },

  render() {
    var file = this.state.file
    var compositeFile = this.state.compositeFile
    var blendedFileSrc = URL.createObjectURL(this.state.blendedImage)
    var fileInfo = file ? (
        <div>
          <p>File name: {file.name}</p>
          <p>File size: {file.size / 1024}K</p>
          <p>File type: {file.type}</p>
          <p><img src={this.state.fileUrl} width={200} height={200}/></p>
        </div>
      ) : null

    var compositeFileInfo = compositeFile ? (
        <div>
          <p>Composite File name: {file.name}</p>
          <p>Composite File size: {file.size / 1024}K</p>
          <p>Composite File type: {file.type}</p>
          <p><img src={this.state.compositeFileUrl} width={200} height={200}/></p>
        </div>
      ) : null

    var errors = this.state.errors.map(e => {
      return <p style={{background:'#E85672'}}>{e}</p>
    })

    var messages = this.state.messages.map(m => {
      return <Notification message={m} onClose={this.clearMessages}/>
    })

    return (
      <div className="admin-create-layer-image">
        {this.state.errors.length > 0 ? <div>{errors}</div> : null}
        {this.state.messages.length > 0 ? <div>{messages}</div> : null}

        <h1>New Layer Image</h1>

        <form onSubmit={this.uploadFile}>

          <div>
            <div style={{margin: 20}}>
              <label>Upload a new SVG image</label>
            </div>

            <input type="file" onChange={this.fileSelected.bind(null, 'imageUrl')}></input>

            {fileInfo}
          </div>

          <div style={{borderTop:'1px solid', marginTop: 20}}>
            <div style={{margin: 20}}>
              <label>Upload a new SVG composite image</label>
            </div>

            <input type="file" onChange={this.fileSelected.bind(null, 'compositeImageUrl')}></input>

            {compositeFileInfo}

            {this.state.blendedImageUrl ? (
              <div>
                <p>This layer will be blended as: </p>
                <img src={this.state.blendedImageUrl} height="200" width="200"/>
              </div>) : null}

            {file ? (
              <div style={{padding: 30, background: 'slategray'}}>
                <input type="submit" value="Upload"></input>
              </div>)
              : null}
          </div>
        </form>

      </div>
    )
  }
})
