import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dir=path.join(root,'dist');
const app=fs.readFileSync(path.join(dir,'app.js'),'utf8');
const initial=vm.runInNewContext('('+app.match(/const initial=(.*);\nconst KEY=/)[1]+')');
const companion=vm.runInNewContext('('+app.match(/const defaultCompanion=(.*);\nfunction normalizeCompanion/)[1]+')');
const seed={topics:[{course:initial}],companion};
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webp':'image/webp','.png':'image/png','.gif':'image/gif'};
const assets={};function walk(folder){for(const entry of fs.readdirSync(folder,{withFileTypes:true})){if(['server','.openai'].includes(entry.name))continue;const p=path.join(folder,entry.name);if(entry.isDirectory()){walk(p);continue}const ext=path.extname(p),type=types[ext];if(!type)continue;const key='/'+path.relative(dir,p).split(path.sep).join('/');if(['.html','.js','.css','.json'].includes(ext)){let text=fs.readFileSync(p,'utf8');if(key==='/app.js')text=text.replace(/const initial=.*;\nconst KEY=/,'const initial={title:"Lernraum",chapters:[]};\nconst KEY=');assets[key]={type,text}}else assets[key]={type,base64:fs.readFileSync(p).toString('base64')}}}walk(dir);
fs.mkdirSync(path.join(dir,'server'),{recursive:true});fs.writeFileSync(path.join(dir,'server/index.js'),fs.readFileSync(path.join(root,'worker/index.mjs'),'utf8')+'\nconst ASSETS='+JSON.stringify(assets)+';\nconst SEED='+JSON.stringify(seed)+';\nexport default createWorker(ASSETS,SEED);\n');
fs.writeFileSync(path.join(root,'worker/test-seed.json'),JSON.stringify(seed));
console.log('Built authenticated Worker with '+Object.keys(assets).length+' protected assets.');

// Carry schema migrations with the artifact as well as the source journal.
const migrationFiles=fs.readdirSync(path.join(root,'migrations')).filter(f=>f.endsWith('.sql')).sort();
const journalPath=path.join(root,'drizzle/meta/_journal.json');
const journal=fs.existsSync(journalPath)?JSON.parse(fs.readFileSync(journalPath,'utf8')):{version:'7',dialect:'sqlite',entries:[]};
const migrations=[];
for(const name of migrationFiles){const sql=fs.readFileSync(path.join(root,'migrations',name),'utf8'),tag=name.slice(0,-4);
 for(const location of ['drizzle','dist/server/drizzle','dist/server/migrations']){const target=path.join(root,location);fs.mkdirSync(target,{recursive:true});fs.writeFileSync(path.join(target,name),sql)}
 if(!journal.entries.some(e=>e.tag===tag))journal.entries.push({idx:journal.entries.length,version:'6',when:Date.now(),tag,breakpoints:false});migrations.push({id:tag,sql});
}
for(const location of ['drizzle/meta','dist/server/drizzle/meta']){const target=path.join(root,location);fs.mkdirSync(target,{recursive:true});fs.writeFileSync(path.join(target,'_journal.json'),JSON.stringify(journal,null,2)+'\n')}
fs.writeFileSync(path.join(root,'.openai/migrations.json'),JSON.stringify({version:1,migrations},null,2)+'\n');
