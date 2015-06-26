import React from 'react'
var s3Endpoint = 'https://s3.amazonaws.com'
var bucketName = 'com.artdrop.images'
export default React.createClass({

  getInitialState() {
    return {file:null}
  },

  fileSelected(e) {
    if (e.target.files.length > 0) {
      var file = e.target.files[0]
      this.setState({file:file})
    }
  },

  uploadFile(e) {
    e.preventDefault()
    AWS.config.credentials = {
      accessKeyId: '',
      secretAccessKey:''}
    var s3 = new AWS.S3()
    var params = {
      Bucket: 'com.artdrop.images',
      Key: this.state.file.name,
      ACL: 'public-read',
      Body: this.state.file
    }
    s3.putObject(params, (err,d) => {
     if (err) {console.log('got error: ',err)}
     else {console.log('got data: ',d)
       // here we would create a layerImage in firebase
       // url is:
       //`${s3Endpoint}/${bucketName}/${this.state.file.name}`
     }
    })
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
