# Admin
- Upload multiple design jpeg image sizes on creation.

Sizes from the scss:
$design-small-size: 100px;
$design-medium-size: 120px;
$design-large-size: 180px;

## Error and message reporting
- Add an error store and have the admin subscribe to it, display any errors if it isn't empty
- Same thing for success messages

# LayerImages
- validOrder should be an array. - new layer images have this set to validOrders, but old ones do not

# User Editor
- Colors and Layers, make scrolling vertical when choosing layer art.

# Etc
- on the layers model, layerImages should be a collection of ids, not an array.
- When Editing a layer image, add undo/redo stack.

# Firebase rules
- Save rules in repo
- Update .write rules for layers to use $layer_id and then have specific property rules
  - that only allow changing what the app allows from the UI.
