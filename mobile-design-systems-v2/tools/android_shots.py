#!/usr/bin/env python3
"""전용/선택 에뮬레이터에서 테마 캡처. 표시 설정은 성공·실패 모두 원복한다."""
from pathlib import Path
import os,subprocess,time
adb=Path(os.environ.get('ANDROID_HOME',str(Path.home()/'Library/Android/sdk')))/'platform-tools/adb'
serial=os.environ.get('ANDROID_SERIAL','emulator-5580')
def run(*args):return subprocess.check_output([str(adb),'-s',serial,*args],text=True,timeout=120 if args[0]=='install' or args[:3]==('shell','am','start') else 30).strip()
def original(cmd):
 s=run('shell','wm',cmd)
 return s.split('Override '+('size' if cmd=='size' else 'density')+': ')[-1] if 'Override' in s else 'reset'
size=original('size');density=original('density');scale=run('shell','settings','get','system','font_scale')
root=Path(__file__).resolve().parents[1];out=Path('/private/tmp/mobile-v2-shots/android')
if os.environ.get('MOBILE_SKIP_INSTALL')!='1':
 run('install','--no-streaming','-r',str(root/'android/app/build/outputs/apk/debug/app-debug.apk'))
try:
 run('shell','wm','size','780x1688');run('shell','wm','density','320')
 run('shell','input','keyevent','KEYCODE_WAKEUP');run('shell','wm','dismiss-keyguard')
 run('shell','am','force-stop','com.jinsup.ds.v2')
 for fontscale in os.environ.get('MOBILE_SHOT_SCALES','1.0,1.3').split(','):
  run('shell','settings','put','system','font_scale',fontscale)
  for theme in map(int,os.environ.get('MOBILE_SHOT_THEMES','1,2,3,4,15,30').split(',')):
   folder=out/f'theme-{theme:02}';folder.mkdir(parents=True,exist_ok=True)
   for mode in os.environ.get('MOBILE_SHOT_MODES','light,dark').split(','):
    dark=mode=='dark'
    for screen in map(int,os.environ.get('MOBILE_SHOT_SCREENS','0,1,2,3').split(',')):
     request_id=str(time.time_ns())
     run('shell','run-as','com.jinsup.ds.v2','rm','-f','files/capture.png')
     run('shell','am','start','--activity-single-top','-n','com.jinsup.ds.v2/com.jinsup.ds.catalog.MainActivity','--ei','theme',str(theme),'--ei','screen',str(screen),'--ez','dark',str(dark).lower(),'--ez','capture','true','--es','capture_id',request_id)
     name=f'{screen}_{"dark" if dark else "light"}'+('_scale13' if fontscale=='1.3' else '')+'.png'
     for attempt in range(40):
      completed=subprocess.run([str(adb),'-s',serial,'shell','run-as','com.jinsup.ds.v2','cat','files/capture.id'],stdout=subprocess.PIPE,stderr=subprocess.DEVNULL,text=True,timeout=30)
      ready=completed.returncode==0 and completed.stdout.strip()==request_id
      if ready:break
      time.sleep(.5)
     else:raise RuntimeError(f'앱 Window 캡처 준비 실패: {name}')
     with (folder/name).open('wb') as f:
      subprocess.run([str(adb),'-s',serial,'exec-out','run-as','com.jinsup.ds.v2','cat','files/capture.png'],stdout=f,check=True,timeout=30)
     print(f'{theme:02} {name}',flush=True)
finally:
 run('shell','wm','size',size);run('shell','wm','density',density)
 run('shell','settings','put','system','font_scale',scale if scale!='null' else '1.0')
print('표시 설정 복구 완료')
