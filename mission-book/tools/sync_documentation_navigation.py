#!/usr/bin/env python3
"""Generate bilingual documentation navigation; never edit workbook truth."""
from __future__ import annotations
import argparse,json,os,pathlib,re,sys
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parent))
from sync_mission_progress import collect
ROOT=pathlib.Path(__file__).resolve().parents[2]
if os.name=='nt' and not str(ROOT).startswith('\\\\?\\'):
 ROOT=pathlib.Path('\\\\?\\'+str(ROOT))
START='<!-- DOCUMENT_NAVIGATION:START -->'
END='<!-- DOCUMENT_NAVIGATION:END -->'

def relative(p):return p.relative_to(ROOT).as_posix()
def documents(folder):return sorted((p for p in folder.rglob('*.md') if '.runtime' not in p.parts and '.git' not in p.parts),key=lambda p:p.as_posix())
def rows(folder):
 out=[]
 for child in sorted(folder.iterdir(),key=lambda p:p.name):
  if not child.is_dir() or child.name.startswith('.'):continue
  docs=documents(child)
  if not docs:continue
  entry=child/'README.md'
  if not entry.exists():
   entry=next((q for name in ('REVIEW_REPORT.md','DEVELOPMENT_REPORT.md','PAPER_MATERIAL_INDEX.md') for q in docs if q.name==name),docs[0])
  out.append((child,len(docs),entry))
 return out

def block(folder):
 docs=documents(folder)
 lines=[START,'## 导航与快速信息 / Navigation and quick information','',
  '本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.','',
  f'当前Markdown文档 / Current Markdown documents: **{len(docs)}**.','',
  '| 子区 / Area | 文档数 / Documents | 导航 / Entry |','|---|---:|---|']
 for child,count,entry in rows(folder):
  link=entry.relative_to(folder).as_posix().replace(' ','%20')
  lines.append(f'| {child.name} | {count} | [打开 / Open]({link}) |')
 direct=[p for p in sorted(folder.glob('*.md'),key=lambda p:p.name) if p.name!='README.md']
 if direct:
  lines+=['','### 本目录说明 / Local documents','']
  lines += [f'- [{p.name}]({p.name.replace(" ","%20")})' for p in direct]
 lines+=['',END]
 return '\n'.join(lines)

def expected(folder):
 p=folder/'README.md'
 if p.exists():text=p.read_text(encoding='utf-8')
 else:text=f'# {folder.name} / 文档导航\n\n本页导航保留原目录的文档和证据。 / This page navigates the existing documents and evidence.\n'
 generated=block(folder)
 if START in text and END in text:
  return re.sub(re.escape(START)+'.*?'+re.escape(END),lambda _:generated,text,flags=re.S)
 return text.rstrip()+'\n\n'+generated+'\n'

def series_outputs():
 outputs={}
 for programme in collect()['programmes']:
  ref=programme.get('readme')
  if not ref:continue
  p=ROOT/'mission-book'/ref
  if p.is_dir():p=p/'README.md'
  if p.name!='README.md' or not p.exists():continue
  lines=['<!-- SERIES_DASHBOARD:START -->','## 任务快速面板 / Task dashboard','',
   '自动读取canonical工作书；本表不提供领取锁或额外authority。 / Generated from canonical workbooks; this table grants no claim lock or extra authority.','',
   f"总完成 / Complete {programme['task_complete']}/{programme['total']} · 开发 / Development {programme['development_complete']}/{programme['total']} · 复检 / Review {programme['review_complete']}/{programme['total']} · `{programme['status']}`",'',
   '| 任务 / Task | 状态 / Status | 开发 / Development | 复检 / Review | 可执行 / Enabled |','|---|---|:---:|:---:|:---:|']
  for task in programme['tasks']:
   source=ROOT/'mission-book'/task['path']
   link=os.path.relpath(source,p.parent).replace('\\','/').replace(' ','%20')
   yn=lambda v:'YES' if v else 'NO'
   lines.append(f"| [{task['id']}]({link}) | {task['status']} | {yn(task['development_complete'])} | {yn(task['review_complete'])} | {yn(task['execution_enabled'])} |")
  lines+=['','<!-- SERIES_DASHBOARD:END -->']
  text=p.read_text(encoding='utf-8');b='\n'.join(lines)
  if '<!-- SERIES_DASHBOARD:START -->' in text:
   want=re.sub('<!-- SERIES_DASHBOARD:START -->.*?<!-- SERIES_DASHBOARD:END -->',lambda _:b,text,flags=re.S)
  else:want=text.rstrip()+'\n\n'+b+'\n'
  outputs[p]=want
 return outputs

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--check',action='store_true');args=ap.parse_args()
 scopes=[ROOT/'mission-book/reports',ROOT/'mission-book/finished',ROOT/'mission-book/logs',ROOT/'docs']
 targets=set(scopes)
 for scope in scopes:
  if scope.exists():
   targets.update(p for p in scope.rglob('*') if p.is_dir() and len(documents(p))>=2 and p.name not in {'en','zh-CN'})
 # Materialize missing navigation files first, so parent counts are stable.
 missing=[p/'README.md' for p in targets if not (p/'README.md').exists()]
 if missing and args.check:
  print('Missing navigation files:',len(missing));return 1
 for p in missing:p.write_text(f'# {p.parent.name} / 文档导航\n',encoding='utf-8')
 drift=[]
 for folder in sorted(targets,key=relative):
  p=folder/'README.md';want=expected(folder)
  if p.read_text(encoding='utf-8')!=want:
   drift.append(relative(p))
   if not args.check:p.write_text(want,encoding='utf-8')
 for p,want in series_outputs().items():
  if p.read_text(encoding='utf-8')!=want:
   drift.append(relative(p))
   if not args.check:p.write_text(want,encoding='utf-8')
 all_docs=documents(ROOT)
 inventory={'schema_version':2,'scope':'all Markdown explanation documents; metadata/code and evidence claims preserved','byte_measurement':'UTF8 text with LF line endings; original malformed byte preimages stored separately','markdown_count':len(all_docs),'total_bytes':0,'entries':[]}
 for p in all_docs:
  text=p.read_text(encoding='utf-8',errors='replace')
  byte_count=len(text.encode('utf-8'))
  inventory['total_bytes']+=byte_count
  encoding_state='REPAIR_REQUIRED' if '\ufffd' in text else 'UTF8'
  prose=re.sub(r'^---\n.*?\n---\n','',text,flags=re.S)
  prose=re.sub(r'```.*?```','',prose,flags=re.S)
  chinese=len(re.findall(r'[\u4e00-\u9fff]',prose))
  english=len(re.findall(r'\b[A-Za-z]{3,}\b',prose))
  rel=relative(p);parts=p.parts
  peer=None
  candidates=[]
  if p.parent.name in {'en','zh-CN'}:
   candidates.append(p.parent.parent/p.name)
   candidates.append(p.parent.parent/('zh-CN' if p.parent.name=='en' else 'en')/p.name)
  if p.parent==ROOT:
   candidates.extend([ROOT/'docs'/language/p.name for language in ('en','zh-CN')])
  if p.parent.parent==ROOT/'docs' and p.parent.name in {'en','zh-CN'}:
   candidates.append(ROOT/p.name)
  candidates.extend([p.with_name(p.stem+'.'+language+'.md') for language in ('en','zh-CN')])
  for language in ('en','zh-CN'):
   if p.name.endswith('.'+language+'.md'):
    candidates.append(p.with_name(p.name[:-len('.'+language+'.md')]+'.md'))
  for candidate in candidates:
   if candidate!=p and candidate.exists():
    peer=relative(candidate);break
  for left,right in [('en','zh-CN'),('zh-CN','en')]:
   if left in parts:
    candidate=pathlib.Path(*[right if x==left else x for x in parts])
    if candidate.exists():peer=relative(candidate);break
  for language in ('en','zh-CN'):
   candidate=p.parent/language/p.name
   if candidate.exists():peer=relative(candidate)
  for old,new in [('.en.md','.zh-CN.md'),('.zh-CN.md','.en.md')]:
   if rel.endswith(old):
    candidate=ROOT/(rel[:-len(old)]+new)
    if candidate.exists():peer=relative(candidate)
  inventory['entries'].append({'path':rel,'bytes':byte_count,'encoding_state':encoding_state,'chinese_characters':chinese,'english_words':english,'paired_path':peer,'language_presence':'PAIR_PRESENT' if peer else 'BOTH_PRESENT_REVIEW_REQUIRED' if chinese>30 and english>30 else 'TRANSLATION_REVIEW_REQUIRED'})
 out=ROOT/'docs/DOCUMENTATION_INVENTORY.json'
 rendered=json.dumps(inventory,ensure_ascii=False,indent=2)+'\n'
 if not out.exists() or out.read_text(encoding='utf-8')!=rendered:
  drift.append(relative(out))
  if not args.check:out.write_text(rendered,encoding='utf-8')
 print(('Navigation drift' if args.check else 'Navigation synchronized'),len(drift),'files; Markdown',len(all_docs))
 return int(args.check and bool(drift))
if __name__=='__main__':raise SystemExit(main())
