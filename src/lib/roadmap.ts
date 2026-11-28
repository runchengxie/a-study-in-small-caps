interface Copy {en:string;zh:string;}
export interface Task {
 id:string;priority:string;workstream:string;status:string;owner:string;title:Copy;
 acceptance:Copy;nextAction:Copy;gap:Copy|null;dependsOn:string[];evidence:string[];
}
interface Roadmap {schema:string;statusMeaning:Copy;tasks:Task[];}
const copy=(v:Copy)=>v&&typeof v.en==='string'&&v.en.length>0&&typeof v.zh==='string'&&v.zh.length>0;
export function validateRoadmap(data:Roadmap){
 if(data.schema!=='smallcap.research-roadmap.v1'||!copy(data.statusMeaning)||!data.tasks.length)throw Error('Invalid roadmap');
 const byId=new Map<string,Task>();
 for(const task of data.tasks){
  if(!/^SC-\d{3}$/.test(task.id)||byId.has(task.id))throw Error('Duplicate or invalid task ID');
  if(!['done','partial','ready','waiting'].includes(task.status)||!['P0','P1','P2','P3'].includes(task.priority))throw Error('Invalid task status/priority');
  if(![task.title,task.acceptance,task.nextAction].every(copy))throw Error('Missing bilingual task text');
  if(task.status==='waiting'&&!copy(task.gap!))throw Error('Missing evidence gate');
  if(task.status==='done'&&!task.evidence.length)throw Error('Missing completion evidence');
  byId.set(task.id,task);
 }
 const visiting=new Set<string>(),visited=new Set<string>();
 const visit=(id:string)=>{if(visiting.has(id))throw Error('Task cycle');if(visited.has(id))return;const task=byId.get(id);if(!task)throw Error('Missing dependency');visiting.add(id);for(const dependency of task.dependsOn)visit(dependency);visiting.delete(id);visited.add(id);};
 for(const task of data.tasks){visit(task.id);if(['ready','done'].includes(task.status)&&task.dependsOn.some(id=>byId.get(id)?.status!=='done'))throw Error('Unfinished prerequisite');}
 return true;
}
