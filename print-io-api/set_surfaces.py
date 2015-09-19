import sys
import json
import requests
endpoint = 'https://artdrop-testing3.firebaseio.com'
print 'sys argv: ', sys.argv

if len(sys.argv) != 3:
    print 'You must provide an auth token and a json file of surface data'
    sys.exit()

token = sys.argv[1]
data_file = open(sys.argv[2])
data = json.loads(data_file.read())

products = data['products']
products_json = json.dumps(products)
product_options = data['productOptions']
product_options_json = json.dumps(product_options)

first_surface_id = products.keys()[0]
first_surface_option_id = products[first_surface_id]['options'].keys()[0]

print 'surface id: ',first_surface_id
print 'surface option id: ',first_surface_option_id

connection = requests.Session()
connection.headers.update({'Content-type': 'application/json'})
surfaces_url = endpoint + '/surfaces.json?auth=' +  token + "&print=pretty"
surface_options_url = endpoint + '/surfaceOptions.json?auth=' +  token + "&print=pretty"

designs_url = endpoint + '/designs.json'

response = connection.put(surfaces_url, data=products_json)
print 'Response from surfaces: ', response

response = connection.put(surface_options_url, data=product_options_json)

print 'Response from surface options: ', response

r = connection.get(designs_url)
surface_patch = json.dumps({"surface": first_surface_id, 'surfaceOption':first_surface_option_id})
print 'surfac patcH: ', surface_patch

all_data = r.json()
for d in all_data:
    d_url = endpoint + '/designs/' + d + '.json?auth=' + token
    resp = connection.patch(d_url, data=surface_patch)
    print 'got d: ', d
    print 'got resp: ', resp
    print 'got resp: ', resp.content

print 'Done.'
