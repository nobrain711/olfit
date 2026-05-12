import re
import json

def transform_notes(notes_str):
    if not notes_str:
        return []
    return [s.strip() for s in notes_str.split(',')]

def refactor():
    file_path = r'C:\Users\jacob\4th_project\4th_react_ts_playground\src\data\personalData.ts'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match the array content
    match = re.search(r'export const personalProducts: Product\[\] = \[(.*)\];', content, re.DOTALL)
    if not match:
        print("Could not find personalProducts array")
        return

    # This is a bit risky with regex for nested objects, but let's try a more robust way.
    # We can split by objects if they follow a consistent pattern.
    
    # Actually, let's use a more manual approach to be safe with the Korean characters and nested structures.
    
    products_raw = match.group(1)
    
    # Split by individual product objects. They start with { and end with },
    # but they have nested objects. We'll find them by looking for "id: "
    
    # A better way might be to parse it as JSON if it were valid JSON, but it's TS.
    # Let's try to find each product block.
    
    product_blocks = []
    start = 0
    depth = 0
    for i, char in enumerate(products_raw):
        if char == '{':
            if depth == 0:
                start = i
            depth += 1
        elif char == '}':
            depth -= 1
            if depth == 0:
                product_blocks.append(products_raw[start:i+1])

    new_products = []
    for block in product_blocks:
        # Extract fields using regex
        def get_field(field, text):
            m = re.search(fr'{field}:\s*"(.*?)"', text)
            if m: return m.group(1)
            m = re.search(fr'{field}:\s*\[(.*?)\]', text)
            if m: return [s.strip().strip('"') for s in m.group(1).split(',')]
            m = re.search(fr'{field}:\s*(\d+)', text)
            if m: return int(m.group(1))
            return None

        p_id = get_field('id', block)
        name = get_field('name', block)
        brand = get_field('brand', block)
        price = get_field('price', block)
        size = get_field('size', block)
        image = get_field('image', block)
        tags = get_field('tags', block)
        notes = get_field('notes', block)
        family = get_field('family', block)
        category = get_field('category', block)
        
        # Details
        details_match = re.search(r'details:\s*\{(.*?)\}', block, re.DOTALL)
        details_text = details_match.group(1) if details_match else ""
        
        story = get_field('story', details_text)
        topNotes = get_field('topNotes', details_text)
        middleNotes = get_field('middleNotes', details_text)
        baseNotes = get_field('baseNotes', details_text)
        bestFor = get_field('bestFor', details_text)

        # Transformation
        new_block = f"""  {{
    id: {p_id},
    name: "{name}",
    brand: "{brand}",
    price: "{price}",
    size: "{size}",
    image: "{image}",
    tags: {json.dumps(tags, ensure_ascii=False)},
    notes: "{notes}",
    family: "{family}",
    mainAccords: ["{family}"],
    moods: [],
    occasions: [],
    category: "{category}",
    details: {{
      story: "{story}",
      topNotes: {json.dumps(transform_notes(topNotes), ensure_ascii=False)},
      middleNotes: {json.dumps(transform_notes(middleNotes), ensure_ascii=False)},
      baseNotes: {json.dumps(transform_notes(baseNotes), ensure_ascii=False)},
      bestFor: "{bestFor}"
    }}
  }}"""
        new_products.append(new_block)

    new_content = "import type { Product } from '@/types';\n\nexport const personalProducts: Product[] = [\n" + ",\n".join(new_products) + "\n];\n\n// EOF: personalData.ts"
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully refactored personalData.ts")

if __name__ == "__main__":
    refactor()
