# Admin
- Color palette admin
  - Update existing
  - Create new

- For now remove user and all designs links

## Error and message reporting
- Add an error store and have the admin subscribe to it, display any errors if it isn't empty
- Same thing for success messages

## Create Design
- Remove the canvas and jpg rendering.
- Upload to S3, set this on the design.

# LayerImages
- validOrder should be an array. - new layer images have this set to validOrders, but old ones do not

# Etc
- on the layers model, layerImages should be a collection of ids, not an array.
