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

# Orders
- For now on buy screen, create an "order" in the db and fill in its properties.
