# Perf
  - Use mutiple builds, one for admin one for rest of the site - /admin should use its own router.
    - In admin build, build only s3 part of aws JS sdk.
  - Use a sprite sheet to avoid many network requests
  - Ensure shouldComponentUpdate is implemented for every component.
  - Load all layer images on the home page, in the background
  - ChooseArt - we should limit the max number of possible layerImages, as downloading hundreds of images is too many.
    - We could also lazy load them somehow. Load the first 30, then when you scroll to the end, load the next 30 etc.
    - See yelp mobile site side scroll of images.


## Error and message reporting
- Add an error store and have the admin subscribe to it, display any errors if it isn't empty
- Same thing for success messages

# LayerImages
- validOrder should be an array. - new layer images have this set to validOrders, but old ones do not

# Etc
- on the layers model, layerImages should be a collection of ids, not an array.
- When Editing a layer image, add undo/redo stack.

# Firebase
  - Script to delete any non admin created designs that are older than 2 days. - tough to do once we launch, as you
    don't know if someone saved a link to a design.
  - Add validation rules to firebase.
## Rules
  - Save rules in repo
  - Update .write rules for layers to use $layer_id and then have specific property rules
    - that only allow changing what the app allows from the UI.

# General
  - Change 'addDesign' and 'addManyDesigns' to 'setDesign' and 'setManyDesigns'
  - Need favicon
