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

# Etc
- on the layers model, layerImages should be a collection of ids, not an array.
- When Editing a layer image, add undo/redo stack.

# Firebase rules
- Save rules in repo
- Update .write rules for layers to use $layer_id and then have specific property rules
  - that only allow changing what the app allows from the UI.

# Admin
  - Delete designs.
  - Edit existing designs.
    - Will need to recapture the jpeg and upload again.

# Perf
  - Use a sprite sheet to avoid many network requests
  - Ensure shouldComponentUpdate is implemented for every component.
  - Load all layer images on the home page, in the background
  - When changing colors and layers, prevent the user from pressing the button before the last change is complete
  - All data should be lazy loaded, the homepage calls hydrateDesign for all admin designs, this is blocking the
    homepage from loading until all resources for all designs are loaded. We should just load the designs and show the images
    immediately. When someone clicks on a design, then load its dependent data.

# Firebase
  - Script to delete any non admin created designs that are older than 2 days.
