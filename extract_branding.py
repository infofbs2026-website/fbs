import fitz
import os
import json

doc = fitz.open('Branding FBS.pdf')
print('Total pages:', len(doc))

out_dir = os.path.join('public', 'branding')
os.makedirs(out_dir, exist_ok=True)

report = []

for i, page in enumerate(doc):
    text = page.get_text()
    page_data = {
        'page': i + 1,
        'text': text.strip(),
        'images': []
    }
    
    # Render full page as high-res PNG for perfect reference
    pix = page.get_pixmap(dpi=150)
    page_render_path = os.path.join(out_dir, f'page_{i+1}_full.png')
    pix.save(page_render_path)
    page_data['render'] = page_render_path
    
    # Extract embedded images
    image_list = page.get_images(full=True)
    for img_idx, img in enumerate(image_list):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image['image']
        image_ext = base_image['ext']
        w = base_image['width']
        h = base_image['height']
        
        img_name = f'page_{i+1}_asset_{img_idx+1}_{xref}.{image_ext}'
        img_path = os.path.join(out_dir, img_name)
        with open(img_path, 'wb') as f:
            f.write(image_bytes)
        
        page_data['images'].append({
            'name': img_name,
            'path': img_path,
            'width': w,
            'height': h,
            'ext': image_ext
        })
        
    report.append(page_data)

with open(os.path.join(out_dir, 'branding_report.json'), 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

print('Extracted successfully! Check public/branding/')
