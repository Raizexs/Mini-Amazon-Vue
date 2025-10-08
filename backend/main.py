from flask import Flask, request, jsonify
from flask_cors import CORS
import requests, os

app = Flask(__name__)
CORS(app)

BASE = os.getenv('ML_API_BASE', 'https://api.mercadolibre.com')
SITE = os.getenv('ML_SITE', 'MLC')

@app.get('/api/external/search')
def external_search():
  q = request.args.get('q','').strip()
  limit = int(request.args.get('limit',3))
  if not q: return jsonify([])

  try:
    r = requests.get(f'{BASE}/sites/{SITE}/search', params={'q': q, 'limit': limit}, timeout=5)
    r.raise_for_status()
    res = r.json().get('results', [])
    out = [{
      'source':'ML',
      'id':x.get('id'),
      'title':x.get('title'),
      'price':x.get('price'),
      'currency':x.get('currency_id'),
      'thumbnail':x.get('thumbnail'),
      'permalink':x.get('permalink'),
    } for x in res]
    return jsonify(out)
  except Exception:
    # fallback
    try:
      r = requests.get('https://dummyjson.com/products/search', params={'q': q, 'limit': limit}, timeout=5)
      r.raise_for_status()
      prods = r.json().get('products', [])
      out = [{
        'source':'Dummy',
        'id':p['id'],
        'title':p['title'],
        'price':p['price'],
        'currency':'USD',
        'thumbnail':p.get('thumbnail'),
        'permalink':f"https://dummyjson.com/products/{p['id']}",
      } for p in prods]
      return jsonify(out)
    except Exception:
      return jsonify([]), 200

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=int(os.getenv('PORT',8000)), debug=True)