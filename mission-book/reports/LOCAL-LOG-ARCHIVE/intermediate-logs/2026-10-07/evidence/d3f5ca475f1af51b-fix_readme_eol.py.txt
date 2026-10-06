import pathlib,re
p=pathlib.Path('D:/Digital-City-REX-20261006/mission-book/research-strengthening/en/README.md')
t=p.read_text(encoding='utf8');a,b=t.split('<!-- READING_ACCEPTED_PREFLIGHT_638955B:START -->',1)
b=re.sub(r'```[\s\S]*?```',lambda m:m[0].replace('\n\n','\n'),b)
p.write_text(a+'<!-- READING_ACCEPTED_PREFLIGHT_638955B:START -->'+b,encoding='utf8')
s=p.parent.parent.joinpath('README.md').read_text(encoding='utf8');fs=re.findall(r'```[^\n]*\n[\s\S]*?```',s[s.index('### REX 集成前置测量'):]);assert len(fs)==3
assert all(f in b for f in fs)
print('VERIFIED 3 canonical preflight fences')
