import React from 'react'
import Store from '../../state/main'
import Notification from '../Notification'
import {replaceSvgImageWithText} from '../../utils'

export default React.createClass({

  getInitialState() {
    return {file: null,
            errors: [],
            messages: []}
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
      }

      if (errors.length === 0) {
        reader = new FileReader()
        reader.onloadend = e => {
          if ('srcElement' in e && 'result' in e.srcElement) {
            let svgText = e.srcElement.result
            console.log('got svgText: ', svgText)
            let parser = new DOMParser()
            let svgEl = parser.parseFromString(svgText, 'application/xml')
            console.log('GOT SVG: ', svgEl)
            // TODO check that the svg has all four layer ids
            self.setState({file:file})
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
