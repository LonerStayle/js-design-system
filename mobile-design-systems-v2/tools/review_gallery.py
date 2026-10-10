#!/usr/bin/env python3
"""검증 이미지만 읽어 레포 밖에 비교용 HTML을 만든다."""
from pathlib import Path
root=Path('/private/tmp/mobile-v2-shots')
html=['''<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>모바일 v2 파일럿 검토</title><style>body{margin:0;background:#eee;color:#151515;font:15px/1.6 system-ui,sans-serif}header{padding:32px;position:sticky;top:0;background:#fff;border-bottom:1px solid #bbb;z-index:2}h1{margin:0;font-size:26px}nav{display:flex;gap:16px;flex-wrap:wrap}a{color:inherit}section{padding:24px 32px}h2{border-top:2px solid;padding-top:16px}h3{margin:28px 0 12px}.row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}figure{margin:0}img{display:block;width:100%;height:auto;border:1px solid #aaa}figcaption{padding:8px 0;font-weight:600}@media(max-width:900px){.row{grid-template-columns:repeat(2,minmax(0,1fr))}section{padding:16px}}</style><header><h1>모바일 v2 · 파일럿 2종</h1><nav><a href="#t1">판판레코드</a><a href="#t30">레저라인</a><a href="flutter-review.png">플러터 전체 화면</a><a href="web-review.png">웹 원본</a></nav></header>''']
for theme,names in [(1,['운영 보드','음반 상세','문의함','매장 설정']),(30,['마감 현황','결재함','지출결의서','결재 규칙'])]:
 html.append(f'<section id="t{theme}"><h2>{"판판레코드" if theme==1 else "레저라인"}</h2>')
 for i,name in enumerate(names):
  html.append(f'<h3>{name}</h3><div class="row">')
  for platform,mode in [('android','light'),('flutter','light'),('android','dark'),('flutter','dark')]:
   path=f'{platform}/theme-{theme:02}/{i}_{mode}.png';label=f'{"안드로이드" if platform=="android" else "플러터"} · {"라이트" if mode=="light" else "다크"}'
   html.append(f'<figure><a href="{path}"><img src="{path}" alt="{name} {label}" loading="lazy"></a><figcaption>{label}</figcaption></figure>')
  html.append('</div>')
 html.append('</section>')
html.append('</html>');(root/'index.html').write_text('\n'.join(html))
print(root/'index.html')
