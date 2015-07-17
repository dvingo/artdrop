import React from 'react'
import Store from '../../state/main'
import reactor from '../../state/reactor'
import Notification from '../Notification'
import {replaceSvgImageWithText, svgLayerIds} from '../../utils'
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
            errors: [],
            messages: []}
  },

  componentDidUpdate(prevProps, prevState) {
    var layerImageUploaded = this.state.layerImageUploaded
    if (layerImageUploaded != null && prevState.layerImageUploaded !== layerImageUploaded) {
      var messages = [`Layer successfully uploaded at url: ${layerImageUploaded.get('imageUrl')}`]
      this.setState({messages: messages})
    }
  },

  fileSelected(e) {
    if (e.target.files.length > 0) {
      var file = e.target.files[0]
      var errors = []
      var messages = []
      var self = this
      var reader;

      if (file.type !== 'image/svg+xml') {
        errors.push('You can only use svg images for layers.')
        this.setState({errors: errors, messages: messages})
      } else {
        reader = new FileReader()
        reader.onloadend = e => {
          if ('srcElement' in e && 'result' in e.srcElement) {
            let svgText = e.srcElement.result
            let parser = new DOMParser()
            let svgEl = parser.parseFromString(svgText, 'image/svg+xml').children[0]
            if (!allLayersInSvg(svgEl)) {
              let err = 'The SVG file you selected does not have all the required layers.'
              err += ` The layers are: ${svgLayerIds.join(', ')}`
              errors.push(err)
              this.setState({errors: errors, messages: messages})
            } else {
              self.setState({file: file})
            }
          }
        }
        reader.readAsText(file)
      }
      this.setState({errors: errors, messages: messages})
    }
  },

  uploadFile(e) {
    e.preventDefault()
    Store.actions.uploadLayerImageToS3(this.state.file)
  },

  clearMessages() {
    this.setState({messages: []})
  },

  render() {
    var file = this.state.file
    var fileSrc = URL.createObjectURL(file)
    var fileInfo = file ? (
        <div>
          <p>File name: {file.name}</p>
          <p>File size: {file.size / 1024}K</p>
          <p>File type: {file.type}</p>
          <p><img src={fileSrc} width={200} height={200}/></p>
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

        <p>New Layer Image</p>

        {fileInfo}

        <form onSubmit={this.uploadFile}>
          <div>
            <label>Upload a new SVG image</label>
          </div>
          <input type="file" onChange={this.fileSelected}></input>
          {file ? (
            <input type="submit" value="Upload"></input>)
            : null}
        </form>
      </div>
    )
  }
})
