from pathlib import Path
from PIL import Image

ASSETS = {
    'hero_boas_vindas.png': 960,
    'icone_gerenciamento_peso.png': 192,
    'icone_medicina_regenerativa.png': 192,
    'icone_nutrologia.png': 192,
    'icone_psiquiatria.png': 192,
}

assets_dir = Path(__file__).resolve().parents[1] / 'src' / 'assets'

for filename, max_width in ASSETS.items():
    source = assets_dir / filename
    destination = source.with_suffix('.webp')
    with Image.open(source) as image:
        image.thumbnail((max_width, max_width * 3), Image.Resampling.LANCZOS)
        if image.mode not in ('RGB', 'RGBA'):
            image = image.convert('RGBA' if 'transparency' in image.info else 'RGB')
        image.save(destination, 'WEBP', quality=84, method=6)
        print(f'{source.name}: {source.stat().st_size} bytes -> {destination.name}: {image.size}')
