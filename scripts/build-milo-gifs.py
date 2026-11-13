"""Build transparent, looping GIFs and reduced-motion PNGs from 2x2 Milo sheets.

Requires Pillow. Source sheets live in artwork/milo; no network calls.
Run from any directory: python3 scripts/build-milo-gifs.py
"""
from pathlib import Path
from PIL import Image
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist/assets/milo'
OUT.mkdir(parents=True, exist_ok=True)
POSES = {
    'pfote-lecken': ('Pfote lecken', [0, 1, 2, 3, 2, 1], [300, 180, 250, 240, 200, 180]),
    'katzenbuckel': ('Katzenbuckel', [0, 1, 2, 3, 2, 1], [450, 200, 500, 230, 250, 250]),
    'ball-spielen': ('Mit einem Ball spielen', [0, 1, 2, 3, 2, 1], [250, 220, 230, 300, 220, 230]),
    'schlafen': ('Zusammengerollt schlafen', [0, 1, 2, 3], [700, 700, 900, 700]),
    'sarkastisch': ('Sarkastisch schauen', [0, 1, 2, 3, 2, 1], [1000, 500, 300, 700, 250, 500]),
    'futter-betteln': ('Um Futter betteln', [0, 1, 2, 3, 2, 1], [600, 300, 400, 350, 350, 300]),
    'gluecklich-huepfen': ('Glücklich hüpfen', [0, 1, 2, 3], [300, 160, 260, 300]),
    'beine-strecken': ('Alle Beine nach oben strecken', [0, 1, 2, 3, 2, 1], [450, 300, 600, 300, 350, 300]),
    'gaehnen': ('Gähnen', [0, 1, 2, 3, 2, 1, 0], [900, 250, 650, 250, 200, 200, 700]),
    'schnurren': ('Zufrieden schnurren', [0, 1, 2, 3], [500, 500, 600, 500]),
}
manifest = []
for key, (label, sequence, durations) in POSES.items():
    if sys.argv[1:] and key not in sys.argv[1:]:
        continue
    source = ROOT / 'artwork/milo' / f'{key}.webp'
    sheet = Image.open(source).convert('RGBA')
    w, h = sheet.size
    cells = [sheet.crop((col*w//2, row*h//2, (col+1)*w//2, (row+1)*h//2)) for row in range(2) for col in range(2)]
    # Keep a common camera/crop for all frames: movement inside each cell survives.
    bounds = [cell.getchannel('A').point(lambda a: 255 if a >= 128 else 0).getbbox() for cell in cells]
    if any(box is None for box in bounds):
        raise ValueError(f'Empty frame in {key}')
    box = (min(b[0] for b in bounds), min(b[1] for b in bounds), max(b[2] for b in bounds), max(b[3] for b in bounds))
    scale = min(288/(box[2]-box[0]), 288/(box[3]-box[1]))
    size = (round((box[2]-box[0])*scale), round((box[3]-box[1])*scale))
    frames = []
    for cell in cells:
        frame = Image.new('RGBA', (320, 320))
        art = cell.crop(box).resize(size, Image.Resampling.LANCZOS)
        frame.alpha_composite(art, ((320-size[0])//2, 304-size[1]))
        frames.append(frame)
    frames[0].save(OUT / f'{key}.png', optimize=True)
    # A shared palette prevents palette flashes; reserve index 255 for transparency.
    contact = Image.new('RGB', (320*4, 320), (240, 244, 226))
    for i, frame in enumerate(frames):
        contact.paste(frame, (i*320, 0), frame)
    palette = contact.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
    indexed = []
    for frame in frames:
        background = Image.new('RGB', frame.size, (240, 244, 226))
        background.paste(frame, mask=frame.getchannel('A'))
        paletted = background.quantize(palette=palette, dither=Image.Dither.NONE)
        transparent = frame.getchannel('A').point(lambda a: 255 if a < 128 else 0)
        paletted.paste(255, mask=transparent)
        paletted.info['transparency'] = 255
        indexed.append(paletted)
    gif = OUT / f'{key}.gif'
    ordered = [indexed[i] for i in sequence]
    ordered[0].save(gif, save_all=True, append_images=ordered[1:], duration=durations, loop=0, transparency=255, disposal=2, optimize=False)
    with Image.open(gif) as check:
        assert check.n_frames >= 4 and check.info['loop'] == 0 and 'transparency' in check.info
        distinct = {check.seek(i) or check.convert('RGBA').tobytes() for i in range(check.n_frames)}
        assert len(distinct) >= 4, f'Animation {key} lacks distinct frames'
        count = check.n_frames
    manifest.append({'id': key, 'label': label, 'frames': count, 'width': 320, 'height': 320, 'bytes': gif.stat().st_size})
    print(f'{key}: {count} frames, {gif.stat().st_size:,} bytes')
(OUT/'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
print(f'Built {len(manifest)} transparent GIFs and matching motion-free stills.')
