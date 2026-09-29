"""Import the public MKC collection and each product's public builder options.
Run from the repo root: python3 scripts/import-mkc-catalog.py
Only reads public storefront/CDN endpoints. Never reads or writes orders.
"""
import concurrent.futures, datetime, html, json, pathlib, re, subprocess, time
ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = 'https://mkcthreads.com/collections/customized-1'
CDN = 'https://cdn.thecustomproductbuilder.com/34348761132/'

def fetch(url):
    return subprocess.check_output(['curl', '--fail', '-Ls', '--retry', '2', '--max-time', '60', url])
def plain(value):
    return html.unescape(re.sub('<[^>]+>', ' ', str(value or ''))).strip()
def logic(value, panel_id):
    if not value or not value.get('rules'): return None
    value = json.loads(json.dumps(value))
    for rule in value['rules']:
        if rule.get('category'):
            rule['category'] = str(rule.get('panel') or panel_id) + ':' + rule['category']
    return value

def import_product(p):
    config_url = CDN + str(p['id']) + '.json'
    for attempt in range(3):
        try:
            raw = json.loads(fetch(config_url))
            break
        except (json.JSONDecodeError, subprocess.CalledProcessError):
            if attempt == 2: raise RuntimeError(f'Could not import {p["handle"]}: {config_url}')
            time.sleep(1)
    panels = []
    for panel in raw['data'].get('panels', []):
        fields=[]
        for c in panel.get('categories', []):
            choices=[]
            for o in c.get('options', []):
                d=o.get('option', {}).get('data', {})
                choices.append({'id':o['id'], 'label':plain(d.get('label') or d.get('value') or c.get('title')), 'value':d.get('value'), 'price':o.get('price',0), 'inStock':o.get('inStock',True), 'logic':logic(o.get('logic'),panel['id']), 'settings':{k:d[k] for k in ['inputLengthValue','inputMinLengthValue','inputMinValue','inputMaxValue','inputStep','chargePerCharacter','useCustomCharacterPrcies','countSpaceAsCharacter','customCharacterPrices','defaultSelectValue'] if k in d}})
            fields.append({'id':panel['id']+':'+c['id'],'title':plain(c.get('title')),'type':c.get('type'),'display':c.get('display'),'required':c.get('required',False),'description':plain(c.get('description')),'logic':logic(c.get('logic'),panel['id']),'options':choices})
        panels.append({'id':panel['id'],'title':plain(panel.get('title')),'logic':logic(panel.get('logic'),panel['id']),'fields':fields})
    render = {'base': raw['data'].get('base', {}).get('image', {}), 'images': [], 'regions': []}
    for layer in raw['data'].get('customLayers', []):
        item = {'id':layer['id'], 'title':plain(layer.get('title')), 'view':layer.get('view','front'), 'logic':logic(layer.get('logic'),layer.get('selectPanel') or ''), 'points':layer.get('points', [])}
        if layer.get('type') == 'img' and layer.get('image', {}).get('defaultValue'):
            item['url'] = layer['image']['defaultValue']
            render['images'].append(item)
        elif layer.get('type') == 'path':
            render['regions'].append(item)
    config={'source':config_url,'basePrice':raw['data'].get('price'),'panels':panels,'render':render}
    dest=ROOT/'public/catalog/options';dest.mkdir(parents=True,exist_ok=True)
    (dest/(p['handle']+'.json')).write_text(json.dumps(config,ensure_ascii=False,separators=(',',':')))
    title=p['title']
    collection=next((x for x in ['Deluxe Greek Letters','Deluxe Box Logo','Minimalistic','Collegiate','Box Logo','Greek'] if title.startswith(x)), 'Packages' if 'Package' in title else 'Specialty')
    if title.startswith('Standard Greek'):collection='Greek'
    name=title.lower()
    category=next((label for words,label in [(['package'],'Packages'),(['jacket','anorak'],'Jackets'),(['hood'],'Hoodies'),(['quarter-zip'],'Quarter-zips'),(['crewneck','sweatshirt'],'Crewnecks'),(['jersey'],'Jerseys'),(['shirt'],'T-shirts'),(['quarter-zip'],'Quarter-zips'),(['cap','hat','beanie'],'Headwear'),(['blanket'],'Blankets'),(['tote'],'Bags')] if any(w in name for w in words)),'Accessories')
    image=p['images'][0]['src'] if p.get('images') else ''
    return {'id':str(p['id']),'handle':p['handle'],'title':title,'collection':collection,'category':category,'price':float(p['variants'][0]['price']),'available':any(v['available'] for v in p['variants']),'image':image,'images':[i['src'] for i in p.get('images',[])],'source':f"https://mkcthreads.com/products/{p['handle']}",'panelCount':len(panels),'fieldCount':sum(len(x['fields']) for x in panels)}

def main():
    products=[]
    for page in range(1,20):
        batch=json.loads(fetch(f'{SOURCE}/products.json?limit=250&page={page}'))['products']
        products.extend(batch)
        if len(batch)<250: break
    assert len({p['id'] for p in products})==len(products)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        result=list(pool.map(import_product,products))
    dest=ROOT/'src/data';dest.mkdir(exist_ok=True)
    (dest/'catalog.json').write_text(json.dumps({'source':SOURCE,'importedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'products':result},ensure_ascii=False,indent=2)+'\n')
    print(f'Imported {len(result)} products and {sum(p["fieldCount"] for p in result)} customization fields.')
if __name__=='__main__': main()
