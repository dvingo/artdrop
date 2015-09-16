# Print.io API Consumer

1. Reads all products.
2. Requests all variants for products with variants.
3. Parses the responses into JSON suitabable for Firebase.

To fetch all the products and their variants, run the following:
```bash
node index.js <recipeId> outputfile.json
```

To set the surfaces in firebase:

```bash
python set_surfaces.py <firebase_token> <json_surface_data_filename>
```
