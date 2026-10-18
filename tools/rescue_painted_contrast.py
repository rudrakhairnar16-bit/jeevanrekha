"""Conservative contrast across each visible text range's painted background.
Text is removed without changing layout. Does not certify anti-aliasing, thin
fonts, browser zoom or assistive technology. PNGs are temporary scratch files.
"""
import json, math, re
from pathlib import Path
from PIL import Image

def luminance(rgb):
    channel=lambda c: c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4
    return sum(channel(c/255)*w for c,w in zip(rgb,[.2126,.7152,.0722]))
def ratio(a,b):
    x,y=sorted([luminance(a),luminance(b)])
    return (y+.05)/(x+.05)
rows=[]
for view in json.loads(Path('/tmp/jeevanrekha-painted-contrast.json').read_text()):
    with Image.open(view['image']).convert('RGB') as image:
        for node in view['text']:
            color=list(map(float,re.findall(r'[\d.]+',node['color'])))
            if len(color)<3:continue
            alpha=(color[3] if len(color)>3 else 1)*node['opacity']
            if alpha<.01:continue
            scores=[]
            for r in node['rectangles']:
                for x in range(max(0,math.floor(r['left'])),min(image.width,math.ceil(r['right'])),2):
                    for y in range(max(0,math.floor(r['top'])),min(image.height,math.ceil(r['bottom'])),2):
                        background=image.getpixel((x,y))
                        foreground=[color[k]*alpha+background[k]*(1-alpha) for k in range(3)]
                        scores.append(ratio(foreground,background))
            if not scores:continue
            threshold=3 if node['fontSize']>=24 or node['fontSize']>=18.667 and int(node['fontWeight'])>=700 else 4.5
            minimum=min(scores)
            rows.append({'width':view['width'],'act':view['act'],'text':node['text'],'fontSize':node['fontSize'],'foreground':node['color'],'minimumRatio':round(minimum,3),'threshold':threshold,'disabled':node['disabled'],'result':'EXEMPT' if node['disabled'] else 'PASS' if minimum>=threshold else 'REVIEW'})
report={'method':'Visible text-range bounds over actual text-free painted screenshots, sampled every2px. Conservative bounding rectangles can include non-glyph pixels; REVIEW is not automatically a WCAG failure. Does not certify visual perception, zoom or assistive technologies.','rows':rows,'reviewItems':[r for r in rows if r['result']=='REVIEW'],'minimumRatio':min(r['minimumRatio'] for r in rows if not r['disabled'])}
path=Path('evidence/rescue/follow-up/painted-contrast.json');path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(report,indent=2));print('Sampled text ranges:',len(rows),'review items:',len(report['reviewItems']),'minimum:',report['minimumRatio'])
for row in report['reviewItems']:print(row)
