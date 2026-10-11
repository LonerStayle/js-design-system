#!/usr/bin/env python3
"""웹 파일을 변경하지 않는 파일럿 정적 계약 검사."""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
failures=[]
for platform,extension,path in [('Flutter','.dart',root/'flutter/lib/themes'),('Android','.kt',root/'android/app/src/main/java/com/jinsup/ds')]:
 for theme in path.glob('t*'):
  if not theme.is_dir():continue
  for f in theme.rglob('*'+extension):
   s=f.read_text()
   if f.parent.name!='theme' and re.search(r'Color\s*\(\s*0x',s):failures.append(f'{f}: 테마 파일 밖 색상 리터럴')
   for line in s.splitlines():
    if line.strip().startswith('import') and re.search(r't\d\d_',line) and theme.name not in line:failures.append(f'{f}: 테마 간 import')
   if re.search(r'Lorem|John Doe|Acme|Card title|"Title"|\x27Title\x27',s):failures.append(f'{f}: 영어 자리표시')
  for name in (['colors.dart','typography.dart','shape.dart','spacing.dart','motion.dart','elevation.dart','theme.dart'] if platform=='Flutter' else ['Color.kt','Type.kt','Shape.kt','Spacing.kt','Motion.kt','Elevation.kt','Theme.kt']):
   if not(theme/'theme'/name).exists():failures.append(f'{theme}: {name} 누락')
if failures:raise SystemExit('\n'.join(failures))
print('통과: 테마 파일 7종, 컴포넌트/화면 색상 리터럴 0, 테마 간 import 0, 영어 자리표시 0')
def luminance(h):
 rgb=[int(h[i:i+2],16)/255 for i in (2,4,6)]
 linear=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in rgb]
 return sum(a*b for a,b in zip(linear,[.2126,.7152,.0722]))
checked=0
for theme in (root/'flutter/lib/themes').glob('t*'):
 colors=dict((name,(dark,light)) for name,dark,light in re.findall(r'Color get (\w+)\s*=>\s*dark\s*\? const Color\(0x([0-9A-F]+)\)\s*:\s*const Color\(0x([0-9A-F]+)\)',(theme/'theme/colors.dart').read_text()))
 pairs=[('fg','surface'),('fgMuted','surface'),('onAccent','accent'),('onHighlight','highlight'),('onSlabInk','slabInk')] if theme.name.startswith('t01') else [('text','surface'),('text2','surface'),('text3','surface'),('onPrimaryFill','primaryFill') if theme.name.startswith('t15') else ('onInk','ink'),('primary','surface'),('stamp','surface')]
 if theme.name.startswith("t15"):
  pairs += [("text",room) for room in ["roomButter","roomSage","roomFjord","roomOak","roomRose","roomEmber"]]+[("inkOnRoom",room) for room in ["roomButter","roomSage","roomFjord","roomOak","roomRose"]]+[("onAttic","roomAttic")]
 for mode in [0,1]:
  for fg,bg in pairs:
   a,b=luminance(colors[fg][mode]),luminance(colors[bg][mode]);ratio=(max(a,b)+.05)/(min(a,b)+.05)
   assert ratio>=4.5, f'{theme.name} {mode} {fg}/{bg}: {ratio:.2f}'
   checked+=1
print(f'통과: 양 모드 본문·버튼·시그니처 대비 {checked}쌍 모두 4.5:1 이상')
