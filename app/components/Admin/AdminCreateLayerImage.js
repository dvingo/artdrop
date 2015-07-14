import React from 'react'
import Store from '../../state/main'

export default React.createClass({

  getInitialState() {
    return {file: null}
  },

  fileSelected(e) {
    if (e.target.files.length > 0) {
      var file = e.target.files[0]
      this.setState({file:file})
    }
  },

  uploadFile(e) {
    e.preventDefault()
    Store.actions.uploadLayerImageToS3(this.state.file)
    console.log('upload file')
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
    return (
      <div className="admin-create-layer-image">
        <p>New Layer Image</p>
        {fileInfo}
        <form onSubmit={this.uploadFile}>
          <label>Upload a new image</label>
          <input type="file" onChange={this.fileSelected}></input>
          <input type="submit"></input>
        </form>
      </div>
    )
  }
})
