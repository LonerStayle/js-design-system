#!/usr/bin/env python3
"""검증 이미지로만 레포 밖에 웹·Android·Flutter 비교 갤러리를 만든다."""
from pathlib import Path
root=Path('/private/tmp/mobile-v2-shots')
themes={1:('판판레코드',['운영 보드','음반 상세','문의함','매장 설정']),2:('오선음악당',['매표 현황','공연 상세','받은편지함','내 계정']),3:('행간',['편집국','단권','독자 편지','구독 계정']),4:('윤슬홈',['집','무드등','알림','집 설정']),15:('모닥',['쇼룸','담요','상담함','내 계정']),30:('레저라인',['마감 현황','결재함','지출결의서','결재 규칙'])}
html=['''<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>모바일 v2 화면 검토</title><style>body{margin:0;background:#eee;color:#151515;font:15px/1.6 system-ui,sans-serif}header{padding:24px;position:sticky;top:0;background:#fff;border-bottom:1px solid #bbb;z-index:2}h1{margin:0;font-size:26px}nav{display:flex;gap:16px;flex-wrap:wrap}a{color:inherit}section{padding:24px}h2{border-top:2px solid;padding-top:16px}h3{margin:28px 0 12px}.row{display:flex;gap:16px;overflow-x:auto;padding-bottom:12px}figure{margin:0;flex:0 0 300px}img{display:block;width:100%;height:auto;border:1px solid #aaa}figcaption{padding:8px 0;font-weight:600}</style><header><h1>모바일 v2 · 웹과 양 플랫폼 비교</h1><nav>''']
html.extend(f'<a href="#t{n}">{brand}</a>' for n,(brand,_) in themes.items());html.append('</nav></header>')
for theme,(brand,names) in themes.items():
 html.append(f'<section id="t{theme}"><h2>{theme:02} {brand}</h2>')
 for i,name in enumerate(names):
  html.append(f'<h3>{name}</h3>')
  for mode in ['light','dark']:
   html.append(f'<h4>{"라이트" if mode=="light" else "다크"}</h4><div class="row">')
   webPage=['dashboard','product','inbox','settings'][i] if theme!=30 else ['dashboard','inbox','product','settings'][i]
   paths=[('웹',f'web/theme-{theme:02}/{webPage}-{mode}.png'),('Android',f'android/theme-{theme:02}/{i}_{mode}.png'),('Flutter',f'flutter/theme-{theme:02}/{i}_{mode}.png'),('Android 글자 1.3배',f'android/theme-{theme:02}/{i}_{mode}_scale13.png'),('Flutter 글자 1.3배',f'flutter/theme-{theme:02}/{i}_{mode}_scale13.png')]
   for label,path in paths:
    if not(root/path).is_file():continue
    html.append(f'<figure><a href="{path}"><img src="{path}" alt="{brand} {name} {label}" loading="lazy"></a><figcaption>{label}</figcaption></figure>')
   html.append('</div>')
 html.append('</section>')
html.append('</html>');(root/'index.html').write_text('\n'.join(html));print(root/'index.html')
