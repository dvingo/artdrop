# Users
- Add Users collection to Firebase
- Admin page to CRUD users

# Admin

- Require authentication of the user before allowing admin access.
  - This requires adding rules to Firebase - will need our specific google account info
    to set this up.

- All designs admin page
  - Search, enter by id, by author/creator

- Upload new layer images which are SVGs to S3 or Google Bucket
  - Validate before uploading that it contains the proper layer ids as expected
    for the color replacement to work.

- Clean up create a new design page to be more like the user facing one.
  - Upload finished JPG image to S3, set this URL on the design.

- Add Firebase authorization rules to prevent access to adminCreated designs to users with isAdmin == true.

- In firebase, make an adminUsers collection instead of using "isAdmin".

# Orders
- For now on buy screen, create an "order" in the db and fill in its properties.

# Etc
- on the layers model, layerImages should be a collection of ids, not an array.

(data.child('adminCreated').val() === false || newData.child('adminCreated').val() === false)
                     || root.child('users').child(auth.uid).child('isAdmin').val() === true
