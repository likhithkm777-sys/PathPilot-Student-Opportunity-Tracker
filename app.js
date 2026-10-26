'use strict';
const STORAGE_KEY = 'pathpilot_opportunities_v1';
const sampleOpportunities = [
 {id:'demo-1',title:'Software Engineering Intern',company:'Northstar Technologies',category:'Internship',status:'Applied',deadline:'2026-11-08',url:'https://example.com/internship',notes:'Review data structures and prepare project walkthrough.',createdAt:'2026-10-18T09:00:00.000Z'},
 {id:'demo-2',title:'AI for Good Hackathon',company:'Build for Tomorrow',category:'Hackathon',status:'Interested',deadline:'2026-11-14',url:'https://example.com/hackathon',notes:'Form a team and shortlist an accessibility-focused idea.',createdAt:'2026-10-20T09:00:00.000Z'},
 {id:'demo-3',title:'Junior Data Analyst',company:'BluePeak Analytics',category:'Job',status:'Interview',deadline:'2026-10-30',url:'https://example.com/analyst',notes:'Prepare SQL joins, Python basics, and a short introduction.',createdAt:'2026-10-21T09:00:00.000Z'},
 {id:'demo-4',title:'Cloud Fundamentals Certificate',company:'Learning Hub',category:'Course',status:'Interested',deadline:'2026-12-01',url:'https://example.com/cloud',notes:'Complete one module each weekend.',createdAt:'2026-10-22T09:00:00.000Z'},
 {id:'demo-5',title:'Graduate Trainee Programme',company:'Vertex Systems',category:'Job',status:'Offer',deadline:'2026-11-02',url:'https://example.com/graduate',notes:'Compare role details and prepare questions for HR.',createdAt:'2026-10-23T09:00:00.000Z'}
];
const $ = (selector) => document.querySelector(selector);
let opportunities = loadOpportunities();
function loadOpportunities(){
 try { const stored = localStorage.getItem(STORAGE_KEY); if(stored !== null){const parsed=JSON.parse(stored);if(Array.isArray(parsed)) return parsed;} }
 catch(error){console.warn('Could not read saved opportunities:',error);}
 return sampleOpportunities.map(item=>({...item}));
}
function saveOpportunities(){
 try {localStorage.setItem(STORAGE_KEY,JSON.stringify(opportunities));}
 catch(error){showToast('Could not save. Browser storage may be full or disabled.');console.error(error);}
}
function escapeHTML(value){return String(value ?? '').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function safeExternalUrl(value){try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)?url.href:'';}catch{return '';}}
function formatDate(value){if(!value)return 'No date set';const date=new Date(`${value}T00:00:00`);return Number.isNaN(date.getTime())?'Invalid date':new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',year:'numeric'}).format(date);}
function statusClass(status){return String(status).toLowerCase().replace(/[^a-z]+/g,'-');}
function initials(company){return String(company||'?').trim().split(/\s+/).slice(0,2).map(word=>word[0]||'').join('').toUpperCase()||'?';}
function renderStats(){
 $('#total-count').textContent=opportunities.length;
 $('#progress-count').textContent=opportunities.filter(item=>['Interested','Applied'].includes(item.status)).length;
 $('#interview-count').textContent=opportunities.filter(item=>item.status==='Interview').length;
 $('#offer-count').textContent=opportunities.filter(item=>item.status==='Offer').length;
}
function getFilteredOpportunities(){
 const query=$('#search-input').value.trim().toLowerCase();const status=$('#status-filter').value;const category=$('#category-filter').value;
 return opportunities.filter(item=>{
  const searchable=[item.title,item.company,item.category,item.notes,item.status].join(' ').toLowerCase();
  return (!query||searchable.includes(query))&&(status==='all'||item.status===status)&&(category==='all'||item.category===category);
 }).sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||''));
}
function renderOpportunities(){
 const filtered=getFilteredOpportunities();$('#visible-count').textContent=`${filtered.length} ${filtered.length===1?'item':'items'}`;
 $('#empty-state').hidden=filtered.length!==0;
 $('#opportunity-list').innerHTML=filtered.map(item=>{
  const url=safeExternalUrl(item.url);const link=url?`<a class="icon-btn" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">Open link ↗</a>`:'';
  return `<article class="opportunity-card"><div class="company-mark" aria-hidden="true">${escapeHTML(initials(item.company))}</div><div class="op-details"><div class="op-title">${escapeHTML(item.title)}</div><div class="op-company">${escapeHTML(item.company)} · ${escapeHTML(item.category)}</div><div class="op-meta"><span>▦ ${escapeHTML(formatDate(item.deadline))}</span>${item.notes?`<span title="Notes">✎ ${escapeHTML(item.notes)}</span>`:''}</div><div class="card-actions">${link}<button class="icon-btn" data-action="status" data-id="${escapeHTML(item.id)}">Update status</button><button class="icon-btn" data-action="delete" data-id="${escapeHTML(item.id)}" aria-label="Delete ${escapeHTML(item.title)}">Delete</button></div></div><div class="op-status-wrap"><span class="status ${escapeHTML(statusClass(item.status))}">${escapeHTML(item.status)}</span></div></article>`;
 }).join('');
 renderStats();
}
function showToast(message){const toast=$('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2600);}
$('#opportunity-form').addEventListener('submit',event=>{
 event.preventDefault();const form=event.currentTarget;const data=new FormData(form);const title=String(data.get('title')||'').trim();const company=String(data.get('company')||'').trim();
 if(!title||!company){showToast('Please fill in the required fields.');return;}
 const rawUrl=String(data.get('url')||'').trim();if(rawUrl&&!safeExternalUrl(rawUrl)){showToast('Enter a valid http or https link.');return;}
 const item={id:window.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(16).slice(2)}`,title,company,category:String(data.get('category')),status:String(data.get('status')),deadline:String(data.get('deadline')||''),url:rawUrl,notes:String(data.get('notes')||'').trim(),createdAt:new Date().toISOString()};
 opportunities.unshift(item);saveOpportunities();form.reset();renderOpportunities();showToast('Opportunity saved successfully.');
});
$('#search-input').addEventListener('input',renderOpportunities);$('#status-filter').addEventListener('change',renderOpportunities);$('#category-filter').addEventListener('change',renderOpportunities);
$('#opportunity-list').addEventListener('click',event=>{
 const button=event.target.closest('button[data-action]');if(!button)return;const id=button.dataset.id;const action=button.dataset.action;
 if(action==='delete'){const item=opportunities.find(record=>record.id===id);if(!item)return;if(!window.confirm(`Delete “${item.title}”?`))return;opportunities=opportunities.filter(record=>record.id!==id);saveOpportunities();renderOpportunities();showToast('Opportunity deleted.');}
 if(action==='status'){const item=opportunities.find(record=>record.id===id);if(!item)return;const statuses=['Interested','Applied','Interview','Offer','Rejected'];const next=statuses[(statuses.indexOf(item.status)+1)%statuses.length];item.status=next;saveOpportunities();renderOpportunities();showToast(`Status changed to ${next}.`);}
});
$('#jump-add').addEventListener('click',()=>{$('#add-panel').scrollIntoView({behavior:'smooth',block:'start'});$('#opportunity-form').elements.title.focus({preventScroll:true});});
$('#clear-filters').addEventListener('click',()=>{$('#search-input').value='';$('#status-filter').value='all';$('#category-filter').value='all';renderOpportunities();});
$('#reset-demo').addEventListener('click',()=>{if(!window.confirm('Restore the original sample opportunities? Your current demo entries will be replaced.'))return;opportunities=sampleOpportunities.map(item=>({...item}));saveOpportunities();$('#clear-filters').click();showToast('Sample data restored.');});
renderOpportunities();
