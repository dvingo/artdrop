# Admin

- Upload new layer images which are SVGs to S3 or Google Bucket
  - Validate before uploading that it contains the proper layer ids as expected
    for the color replacement to work.

- Clean up create a new design page to be more like the user facing one.
  - Upload finished JPG image to S3, set this URL on the design.

- All designs admin page
  - Search, enter by id, by author/creator

# Orders
- For now on buy screen, create an "order" in the db and fill in its properties.

# LayerImages
- validOrder should be an array.

# Etc
- on the layers model, layerImages should be a collection of ids, not an array.
