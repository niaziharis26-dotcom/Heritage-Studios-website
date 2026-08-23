'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import AdminLayoutWrapper from '@/components/AdminLayoutWrapper';

// Toast
function showToast(msg, type = 'success') {
  if (typeof document === 'undefined') return;
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, {
    position:'fixed',bottom:'1.5rem',right:'1.5rem',zIndex:99999,
    padding:'0.85rem 1.5rem',borderRadius:'12px',fontFamily:'Outfit,sans-serif',
    fontWeight:600,fontSize:'0.9rem',color:'#fff',maxWidth:'340px',
    background: type==='success'?'#059669': type==='error'?'#dc2626':'#6366f1',
    boxShadow:'0 8px 30px rgba(0,0,0,0.3)',opacity:1,transition:'opacity 0.4s',
  });
  document.body.appendChild(el);
  setTimeout(()=>{el.style.opacity='0';setTimeout(()=>el.remove(),400);},3200);
}

const inp = {
  background:'#0a0f1a',border:'1px solid rgba(255,255,255,0.09)',
  borderRadius:8,padding:'0.62rem 0.85rem',color:'#f1f5f9',
  fontSize:'0.9rem',fontFamily:'inherit',outline:'none',
  width:'100%',boxSizing:'border-box',
};
const lbl = {
  display:'block',fontSize:'0.72rem',fontWeight:700,color:'#6b7280',
  textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.35rem',
};
const cardS = {
  background:'#0e1420',border:'1px solid rgba(255,255,255,0.06)',
  borderRadius:12,padding:'1.5rem',marginBottom:'1rem',
};
const btn = {
  background:'linear-gradient(135deg,#059669,#047857)',border:'none',
  borderRadius:9,color:'#fff',padding:'0.7rem 1.5rem',
  fontFamily:'Outfit,sans-serif',fontWeight:700,fontSize:'0.9rem',
  cursor:'pointer',transition:'opacity 0.2s',
};
const btnGhost = {
  background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',
  borderRadius:9,color:'#9ca3af',padding:'0.65rem 1.2rem',
  fontFamily:'Outfit,sans-serif',fontWeight:600,fontSize:'0.85rem',cursor:'pointer',
};
const btnDanger = {
  background:'rgba(220,38,38,0.12)',border:'1px solid rgba(220,38,38,0.25)',
  borderRadius:7,color:'#f87171',padding:'0.4rem 0.7rem',
  fontFamily:'inherit',fontWeight:600,fontSize:'0.8rem',cursor:'pointer',
};
const secH = {
  fontSize:'1.15rem',fontWeight:800,color:'#fff',
  margin:'0 0 1.5rem',fontFamily:'Outfit,sans-serif',
};
const g2 = {display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'};

function Field({label,value,onChange,type='text',rows=3,placeholder=''}) {
  if(type==='textarea') return(
    <div style={{marginBottom:'1rem'}}>
      <label style={lbl}>{label}</label>
      <textarea style={{...inp,resize:'vertical'}} rows={rows} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
    </div>
  );
  return(
    <div style={{marginBottom:'1rem'}}>
      <label style={lbl}>{label}</label>
      <input style={inp} type={type} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
    </div>
  );
}

function Repeater({label,items=[],fields,onAdd,onUpdate,onRemove,onMove}) {
  return(
    <div style={{marginBottom:'1.5rem'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
        <label style={{...lbl,marginBottom:0}}>{label}</label>
        <button onClick={onAdd} style={{...btn,padding:'0.35rem 0.85rem',fontSize:'0.78rem'}}>+ Add</button>
      </div>
      {items.map((item,idx)=>(
        <div key={idx} style={{...cardS,padding:'1rem',marginBottom:'0.65rem',background:'#141a26'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
            <span style={{color:'#6b7280',fontSize:'0.78rem',fontWeight:700}}>#{idx+1}</span>
            <div style={{display:'flex',gap:'0.4rem'}}>
              {onMove&&idx>0&&<button onClick={()=>onMove(idx,-1)} style={{...btnGhost,padding:'0.25rem 0.5rem',fontSize:'0.75rem'}}>↑</button>}
              {onMove&&idx<items.length-1&&<button onClick={()=>onMove(idx,1)} style={{...btnGhost,padding:'0.25rem 0.5rem',fontSize:'0.75rem'}}>↓</button>}
              <button onClick={()=>onRemove(idx)} style={btnDanger}>✕ Remove</button>
            </div>
          </div>
          {fields.map(f=>(
            <Field key={f.key} label={f.label} value={item[f.key]} onChange={v=>onUpdate(idx,f.key,v)} type={f.type||'text'} rows={f.rows} placeholder={f.placeholder||''}/>
          ))}
        </div>
      ))}
      {items.length===0&&<p style={{color:'#4b5563',fontSize:'0.85rem',textAlign:'center',padding:'1rem'}}>No items yet. Click + Add.</p>}
    </div>
  );
}

function StringList({label,items=[],onAdd,onUpdate,onRemove}) {
  return(
    <div style={{marginBottom:'1.5rem'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.5rem'}}>
        <label style={{...lbl,marginBottom:0}}>{label}</label>
        <button onClick={onAdd} style={{...btn,padding:'0.3rem 0.75rem',fontSize:'0.78rem'}}>+ Add</button>
      </div>
      {items.map((item,idx)=>(
        <div key={idx} style={{display:'flex',gap:'0.5rem',marginBottom:'0.4rem'}}>
          <input style={{...inp,flex:1}} value={item||''} onChange={e=>onUpdate(idx,e.target.value)} placeholder="Enter value..."/>
          <button onClick={()=>onRemove(idx)} style={{...btnDanger,flexShrink:0}}>✕</button>
        </div>
      ))}
    </div>
  );
}

function ConfirmDialog({message,onConfirm,onCancel}) {
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:99998}}>
      <div style={{background:'#0e1420',border:'1px solid rgba(255,255,255,0.1)',borderRadius:14,padding:'2rem',width:400,fontFamily:'Outfit,sans-serif'}}>
        <h3 style={{margin:'0 0 1rem',color:'#fff',fontSize:'1.1rem'}}>Confirm Action</h3>
        <p style={{color:'#9ca3af',marginBottom:'1.75rem',fontSize:'0.9rem'}}>{message}</p>
        <div style={{display:'flex',gap:'0.75rem',justifyContent:'flex-end'}}>
          <button onClick={onCancel} style={btnGhost}>Cancel</button>
          <button onClick={onConfirm} style={{...btn,background:'linear-gradient(135deg,#dc2626,#b91c1c)'}}>Confirm Delete</button>
        </div>
      </div>
    </div>
  );
}

function SaveBar({saving,dirty,onSave,label='Save Changes'}) {
  return(
    <div style={{display:'flex',alignItems:'center',gap:'1rem',marginTop:'2rem',paddingTop:'1.5rem',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
      <button onClick={onSave} disabled={saving} style={{...btn,opacity:saving?0.65:1,minWidth:160}}>
        {saving?'⏳ Saving...':`💾 ${label}`}
      </button>
      {dirty&&!saving&&<span style={{color:'#fbbf24',fontSize:'0.82rem',fontWeight:600}}>● Unsaved changes</span>}
      {!dirty&&!saving&&<span style={{color:'#34d399',fontSize:'0.82rem',fontWeight:600}}>✓ Saved</span>}
    </div>
  );
}

// ── Section Editors ──────────────────────────────────────────────────────────
function HomepageEditor({data,onChange}) {
  const d=data||{};
  function s(k){return d[k]||{};}
  function u(k,v){onChange({...d,[k]:{...(d[k]||{}),...v}});}
  return(
    <div>
      <div style={cardS}>
        <h3 style={secH}>🏠 Hero Section</h3>
        <div style={g2}>
          <Field label="Main Heading" value={s('hero').heading} onChange={v=>u('hero',{heading:v})} placeholder="Heritage Studios"/>
          <Field label="Subheading" value={s('hero').subheading} onChange={v=>u('hero',{subheading:v})}/>
        </div>
        <Field label="Description" value={s('hero').description} onChange={v=>u('hero',{description:v})} type="textarea"/>
        <div style={g2}>
          <Field label="Primary Button Text" value={s('hero').primaryCtaText} onChange={v=>u('hero',{primaryCtaText:v})} placeholder="Explore Services"/>
          <Field label="Primary Button URL" value={s('hero').primaryCtaUrl} onChange={v=>u('hero',{primaryCtaUrl:v})} placeholder="/services"/>
          <Field label="Secondary Button Text" value={s('hero').secondaryCtaText} onChange={v=>u('hero',{secondaryCtaText:v})} placeholder="Book a Call"/>
          <Field label="Secondary Button URL" value={s('hero').secondaryCtaUrl} onChange={v=>u('hero',{secondaryCtaUrl:v})}/>
        </div>
        <Field label="Hero Image URL" value={s('hero').imageUrl} onChange={v=>u('hero',{imageUrl:v})} placeholder="/images/hero.jpg"/>
      </div>
      <div style={cardS}>
        <h3 style={secH}>⚡ Capabilities Section</h3>
        <Field label="Section Heading" value={s('capabilities').heading} onChange={v=>u('capabilities',{heading:v})}/>
        <Repeater label="Capability Cards" items={s('capabilities').items||[]}
          fields={[{key:'title',label:'Card Title'},{key:'desc',label:'Card Description',type:'textarea',rows:2}]}
          onAdd={()=>u('capabilities',{items:[...(s('capabilities').items||[]),{title:'',desc:''}]})}
          onUpdate={(idx,k,v)=>{const it=[...(s('capabilities').items||[])];it[idx]={...it[idx],[k]:v};u('capabilities',{items:it});}}
          onRemove={idx=>u('capabilities',{items:(s('capabilities').items||[]).filter((_,i)=>i!==idx)})}
          onMove={(idx,dir)=>{const it=[...(s('capabilities').items||[])];const t=idx+dir;[it[idx],it[t]]=[it[t],it[idx]];u('capabilities',{items:it});}}
        />
      </div>
      <div style={cardS}>
        <h3 style={secH}>🛠️ Services Section Header</h3>
        <Field label="Section Heading" value={s('servicesSection').heading} onChange={v=>u('servicesSection',{heading:v})} placeholder="Our Services"/>
        <Field label="Subheading" value={s('servicesSection').subheading} onChange={v=>u('servicesSection',{subheading:v})} type="textarea" rows={2}/>
      </div>
      <div style={cardS}>
        <h3 style={secH}>🔄 Process Timeline</h3>
        <Field label="Section Heading" value={s('process').heading} onChange={v=>u('process',{heading:v})}/>
        <Repeater label="Process Steps" items={s('process').steps||[]}
          fields={[{key:'step',label:'Step Number'},{key:'name',label:'Step Name'},{key:'desc',label:'Description',type:'textarea',rows:2}]}
          onAdd={()=>{const st=[...(s('process').steps||[])];st.push({step:`0${st.length+1}`,name:'',desc:''});u('process',{steps:st});}}
          onUpdate={(idx,k,v)=>{const st=[...(s('process').steps||[])];st[idx]={...st[idx],[k]:v};u('process',{steps:st});}}
          onRemove={idx=>u('process',{steps:(s('process').steps||[]).filter((_,i)=>i!==idx)})}
          onMove={(idx,dir)=>{const st=[...(s('process').steps||[])];const t=idx+dir;[st[idx],st[t]]=[st[t],st[idx]];u('process',{steps:st});}}
        />
      </div>
      <div style={cardS}>
        <h3 style={secH}>🚀 CTA Banner</h3>
        <Field label="Heading" value={s('cta').heading} onChange={v=>u('cta',{heading:v})}/>
        <Field label="Description" value={s('cta').description} onChange={v=>u('cta',{description:v})} type="textarea"/>
        <div style={g2}>
          <Field label="Primary Button Text" value={s('cta').primaryCtaText} onChange={v=>u('cta',{primaryCtaText:v})}/>
          <Field label="Primary Button URL" value={s('cta').primaryCtaUrl} onChange={v=>u('cta',{primaryCtaUrl:v})}/>
          <Field label="Secondary Button Text" value={s('cta').secondaryCtaText} onChange={v=>u('cta',{secondaryCtaText:v})}/>
          <Field label="Secondary Button URL" value={s('cta').secondaryCtaUrl} onChange={v=>u('cta',{secondaryCtaUrl:v})}/>
        </div>
      </div>
      <div style={cardS}>
        <h3 style={secH}>⭐ Reviews Section Header</h3>
        <Field label="Section Heading" value={s('reviewsSection').heading} onChange={v=>u('reviewsSection',{heading:v})}/>
      </div>
      <div style={cardS}>
        <h3 style={secH}>✉️ Contact Section Header</h3>
        <Field label="Heading" value={s('contactSection').heading} onChange={v=>u('contactSection',{heading:v})}/>
        <Field label="Subheading" value={s('contactSection').subheading} onChange={v=>u('contactSection',{subheading:v})} type="textarea" rows={2}/>
      </div>
    </div>
  );
}

function AboutEditor({data,onChange}) {
  const d=data||{};
  const u=(k,v)=>onChange({...d,[k]:v});
  return(
    <div style={cardS}>
      <h3 style={secH}>📖 About Page</h3>
      <div style={g2}>
        <Field label="Hero Title" value={d.heroTitle} onChange={v=>u('heroTitle',v)}/>
        <Field label="Hero Subtitle" value={d.heroSubtitle} onChange={v=>u('heroSubtitle',v)}/>
        <Field label="Mission Title" value={d.missionTitle} onChange={v=>u('missionTitle',v)}/>
        <Field label="Mission Description" value={d.missionDescription} onChange={v=>u('missionDescription',v)} type="textarea"/>
      </div>
      <Repeater label="Core Values" items={d.values||[]}
        fields={[{key:'title',label:'Value Title'},{key:'desc',label:'Value Description',type:'textarea',rows:2}]}
        onAdd={()=>u('values',[...(d.values||[]),{title:'',desc:''}])}
        onUpdate={(idx,k,v)=>{const vals=[...(d.values||[])];vals[idx]={...vals[idx],[k]:v};u('values',vals);}}
        onRemove={idx=>u('values',(d.values||[]).filter((_,i)=>i!==idx))}
        onMove={(idx,dir)=>{const vals=[...(d.values||[])];const t=idx+dir;[vals[idx],vals[t]]=[vals[t],vals[idx]];u('values',vals);}}
      />
    </div>
  );
}

function ServicesPageEditor({data,onChange}) {
  const d=data||{};const u=(k,v)=>onChange({...d,[k]:v});
  return(
    <div style={cardS}>
      <h3 style={secH}>🛠️ Services Page Headers</h3>
      <div style={g2}>
        <Field label="Hero Title" value={d.heroTitle} onChange={v=>u('heroTitle',v)}/>
        <Field label="Hero Subtitle" value={d.heroSubtitle} onChange={v=>u('heroSubtitle',v)} type="textarea"/>
        <Field label="CTA Title" value={d.ctaTitle} onChange={v=>u('ctaTitle',v)}/>
        <Field label="CTA Description" value={d.ctaDescription} onChange={v=>u('ctaDescription',v)} type="textarea"/>
      </div>
    </div>
  );
}

function ContactPageEditor({data,onChange}) {
  const d=data||{};const u=(k,v)=>onChange({...d,[k]:v});
  return(
    <div style={cardS}>
      <h3 style={secH}>✉️ Contact Page</h3>
      <div style={g2}>
        <Field label="Hero Title" value={d.heroTitle} onChange={v=>u('heroTitle',v)}/>
        <Field label="Hero Subtitle" value={d.heroSubtitle} onChange={v=>u('heroSubtitle',v)} type="textarea"/>
        <Field label="Form Title" value={d.formTitle} onChange={v=>u('formTitle',v)}/>
        <Field label="Form Description" value={d.formDescription} onChange={v=>u('formDescription',v)} type="textarea"/>
      </div>
    </div>
  );
}

function ServiceDetailEditor({service,onChange}) {
  const d=service||{};const u=(k,v)=>onChange({...d,[k]:v});
  const arrUpd=(arr,key,idx,field,val)=>{const a=[...(d[arr]||[])];a[idx]={...a[idx],[field]:val};u(arr,a);};
  const arrMove=(arr,idx,dir)=>{const a=[...(d[arr]||[])];const t=idx+dir;[a[idx],a[t]]=[a[t],a[idx]];u(arr,a);};
  return(
    <div>
      <div style={cardS}>
        <h3 style={secH}>📋 Core Service Info</h3>
        <div style={g2}>
          <Field label="Service Name" value={d.name} onChange={v=>u('name',v)}/>
          <Field label="URL Slug" value={d.slug} onChange={v=>u('slug',v)} placeholder="shopify-development"/>
          <Field label="Icon (Emoji)" value={d.icon} onChange={v=>u('icon',v)} placeholder="💻"/>
          <Field label="Category" value={d.category} onChange={v=>u('category',v)} placeholder="Web & E-commerce"/>
          <Field label="Starting Price" value={d.startingPrice} onChange={v=>u('startingPrice',v)} placeholder="From PKR 25,000"/>
        </div>
        <Field label="Short Description (for cards)" value={d.shortDescription} onChange={v=>u('shortDescription',v)} type="textarea" rows={2}/>
      </div>
      <div style={cardS}>
        <h3 style={secH}>🏠 Service Hero</h3>
        <Field label="Hero Title" value={d.heroTitle} onChange={v=>u('heroTitle',v)}/>
        <Field label="Hero Description" value={d.heroDescription} onChange={v=>u('heroDescription',v)} type="textarea" rows={3}/>
      </div>
      <div style={cardS}>
        <h3 style={secH}>✅ Benefits</h3>
        <StringList label="Benefit Items" items={d.benefits||[]}
          onAdd={()=>u('benefits',[...(d.benefits||[]),''])}
          onUpdate={(idx,val)=>{const a=[...(d.benefits||[])];a[idx]=val;u('benefits',a);}}
          onRemove={idx=>u('benefits',(d.benefits||[]).filter((_,i)=>i!==idx))}
        />
      </div>
      <div style={cardS}>
        <h3 style={secH}>🔳 Features</h3>
        <Repeater label="Feature Items" items={d.features||[]}
          fields={[{key:'name',label:'Feature Name'},{key:'icon',label:'Icon (Emoji)',placeholder:'⚡'}]}
          onAdd={()=>u('features',[...(d.features||[]),{name:'',icon:''}])}
          onUpdate={(idx,k,v)=>arrUpd('features','features',idx,k,v)}
          onRemove={idx=>u('features',(d.features||[]).filter((_,i)=>i!==idx))}
          onMove={(idx,dir)=>arrMove('features',idx,dir)}
        />
      </div>
      <div style={cardS}>
        <h3 style={secH}>🔄 Process Steps</h3>
        <StringList label="Process Steps" items={d.process||[]}
          onAdd={()=>u('process',[...(d.process||[]),''])}
          onUpdate={(idx,val)=>{const a=[...(d.process||[])];a[idx]=val;u('process',a);}}
          onRemove={idx=>u('process',(d.process||[]).filter((_,i)=>i!==idx))}
        />
      </div>
      <div style={cardS}>
        <h3 style={secH}>📦 Deliverables</h3>
        <StringList label="Deliverable Items" items={d.deliverables||[]}
          onAdd={()=>u('deliverables',[...(d.deliverables||[]),''])}
          onUpdate={(idx,val)=>{const a=[...(d.deliverables||[])];a[idx]=val;u('deliverables',a);}}
          onRemove={idx=>u('deliverables',(d.deliverables||[]).filter((_,i)=>i!==idx))}
        />
      </div>
      <div style={cardS}>
        <h3 style={secH}>⚙️ Technologies</h3>
        <StringList label="Technology Stack" items={d.technologies||[]}
          onAdd={()=>u('technologies',[...(d.technologies||[]),''])}
          onUpdate={(idx,val)=>{const a=[...(d.technologies||[])];a[idx]=val;u('technologies',a);}}
          onRemove={idx=>u('technologies',(d.technologies||[]).filter((_,i)=>i!==idx))}
        />
      </div>
      <div style={cardS}>
        <h3 style={secH}>💰 Pricing Packages</h3>
        <Repeater label="Packages" items={d.pricing||[]}
          fields={[
            {key:'name',label:'Package Name'},
            {key:'price',label:'Price (e.g. PKR 25,000-40,000)'},
            {key:'currency',label:'Currency'},
            {key:'billingPeriod',label:'Billing Period (one-time/month)'},
            {key:'description',label:'Short Description',type:'textarea',rows:2},
            {key:'features',label:'Features (comma-separated)',type:'textarea',rows:2},
            {key:'badge',label:'Badge Text (e.g. Most Popular)'},
            {key:'ctaText',label:'Button CTA Text'},
          ]}
          onAdd={()=>u('pricing',[...(d.pricing||[]),{name:'',price:'',currency:'PKR/USD',billingPeriod:'one-time',description:'',features:'',popular:false,ctaText:'Get Started',badge:''}])}
          onUpdate={(idx,k,v)=>arrUpd('pricing','pricing',idx,k,v)}
          onRemove={idx=>u('pricing',(d.pricing||[]).filter((_,i)=>i!==idx))}
          onMove={(idx,dir)=>arrMove('pricing',idx,dir)}
        />
      </div>
      <div style={cardS}>
        <h3 style={secH}>❓ FAQs</h3>
        <Repeater label="FAQ Items" items={d.faqs||[]}
          fields={[{key:'question',label:'Question'},{key:'answer',label:'Answer',type:'textarea',rows:3}]}
          onAdd={()=>u('faqs',[...(d.faqs||[]),{question:'',answer:''}])}
          onUpdate={(idx,k,v)=>arrUpd('faqs','faqs',idx,k,v)}
          onRemove={idx=>u('faqs',(d.faqs||[]).filter((_,i)=>i!==idx))}
          onMove={(idx,dir)=>arrMove('faqs',idx,dir)}
        />
      </div>
      <div style={cardS}>
        <h3 style={secH}>🔍 SEO Metadata</h3>
        <div style={g2}>
          <Field label="SEO Page Title" value={d.seoTitle} onChange={v=>u('seoTitle',v)}/>
          <Field label="OG Title" value={d.ogTitle} onChange={v=>u('ogTitle',v)}/>
        </div>
        <Field label="Meta Description" value={d.seoDescription} onChange={v=>u('seoDescription',v)} type="textarea" rows={2}/>
        <Field label="OG Description" value={d.ogDescription} onChange={v=>u('ogDescription',v)} type="textarea" rows={2}/>
        <Field label="OG Image URL" value={d.ogImage} onChange={v=>u('ogImage',v)}/>
      </div>
    </div>
  );
}

function NavEditor({nav,setNav}) {
  if(!nav) return <p style={{color:'#6b7280',padding:'1rem'}}>Loading navigation...</p>;
  const updLink=(id,f,v)=>setNav(p=>({...p,links:p.links.map(l=>l.id===id?{...l,[f]:v}:l)}));
  const addLink=()=>setNav(p=>({...p,links:[...p.links,{id:`nl_${Date.now()}`,name:'New Link',path:'/new',visible:true,order:p.links.length+1}]}));
  const rmLink=id=>setNav(p=>({...p,links:p.links.filter(l=>l.id!==id)}));
  return(
    <div style={cardS}>
      <h3 style={secH}>🔗 Navigation Links</h3>
      {(nav.links||[]).sort((a,b)=>(a.order||0)-(b.order||0)).map(link=>(
        <div key={link.id} style={{display:'grid',gridTemplateColumns:'1fr 1fr 80px 44px',gap:'0.5rem',marginBottom:'0.6rem',alignItems:'center'}}>
          <input style={inp} value={link.name} onChange={e=>updLink(link.id,'name',e.target.value)} placeholder="Link Name"/>
          <input style={inp} value={link.path} onChange={e=>updLink(link.id,'path',e.target.value)} placeholder="/path"/>
          <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',color:'#9ca3af',fontSize:'0.83rem'}}>
            <input type="checkbox" checked={!!link.visible} onChange={e=>updLink(link.id,'visible',e.target.checked)}/> Visible
          </label>
          <button onClick={()=>rmLink(link.id)} style={btnDanger}>✕</button>
        </div>
      ))}
      <button onClick={addLink} style={{...btnGhost,marginTop:'0.75rem',width:'100%',textAlign:'center'}}>+ Add Navigation Link</button>
      <div style={{marginTop:'1.5rem'}}>
        <h4 style={{...secH,fontSize:'0.95rem',marginBottom:'1rem'}}>CTA Button</h4>
        <div style={g2}>
          <Field label="Button Text" value={nav.ctaText} onChange={v=>setNav(p=>({...p,ctaText:v}))}/>
          <Field label="Button URL" value={nav.ctaUrl} onChange={v=>setNav(p=>({...p,ctaUrl:v}))}/>
        </div>
      </div>
    </div>
  );
}

function FooterEditor({footer,setFooter}) {
  if(!footer) return <p style={{color:'#6b7280',padding:'1rem'}}>Loading footer...</p>;
  const u=(k,v)=>setFooter(p=>({...p,[k]:v}));
  const updLink=(idx,f,v)=>{const ls=[...(footer.companyLinks||[])];ls[idx]={...ls[idx],[f]:v};u('companyLinks',ls);};
  return(
    <div>
      <div style={cardS}>
        <h3 style={secH}>📌 Footer CTA Banner</h3>
        <div style={g2}>
          <Field label="CTA Heading" value={footer.ctaHeading} onChange={v=>u('ctaHeading',v)}/>
          <Field label="CTA Subheading" value={footer.ctaSub} onChange={v=>u('ctaSub',v)}/>
          <Field label="WhatsApp Button Text" value={footer.ctaPrimaryText} onChange={v=>u('ctaPrimaryText',v)}/>
          <Field label="Booking Button Text" value={footer.ctaSecondaryText} onChange={v=>u('ctaSecondaryText',v)}/>
        </div>
      </div>
      <div style={cardS}>
        <h3 style={secH}>🏢 Brand Info</h3>
        <Field label="Tagline / Description" value={footer.tagline} onChange={v=>u('tagline',v)} type="textarea" rows={2}/>
        <Field label="Copyright Text" value={footer.copyright} onChange={v=>u('copyright',v)} placeholder="© 2026 Heritage Studios"/>
      </div>
      <div style={cardS}>
        <h3 style={secH}>🔗 Company Links Column</h3>
        <Field label="Column Title" value={footer.companyLinksTitle} onChange={v=>u('companyLinksTitle',v)}/>
        {(footer.companyLinks||[]).map((link,i)=>(
          <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 40px',gap:'0.5rem',marginBottom:'0.5rem'}}>
            <input style={inp} value={link.name||''} onChange={e=>updLink(i,'name',e.target.value)} placeholder="Label"/>
            <input style={inp} value={link.path||''} onChange={e=>updLink(i,'path',e.target.value)} placeholder="/path"/>
            <button onClick={()=>u('companyLinks',(footer.companyLinks||[]).filter((_,j)=>j!==i))} style={btnDanger}>✕</button>
          </div>
        ))}
        <button onClick={()=>u('companyLinks',[...(footer.companyLinks||[]),{name:'New Link',path:'/'}])} style={{...btnGhost,marginTop:'0.5rem',width:'100%',textAlign:'center'}}>+ Add Link</button>
      </div>
      <div style={cardS}>
        <h3 style={secH}>📱 Social Links</h3>
        <div style={g2}>
          <Field label="WhatsApp Number" value={footer.whatsappNumber} onChange={v=>u('whatsappNumber',v)}/>
          <Field label="Instagram URL" value={footer.instagramUrl} onChange={v=>u('instagramUrl',v)}/>
          <Field label="Facebook URL" value={footer.facebookUrl} onChange={v=>u('facebookUrl',v)}/>
          <Field label="YouTube URL" value={footer.youtubeUrl} onChange={v=>u('youtubeUrl',v)}/>
          <Field label="TikTok URL" value={footer.tiktokUrl} onChange={v=>u('tiktokUrl',v)}/>
          <Field label="LinkedIn URL" value={footer.linkedinUrl} onChange={v=>u('linkedinUrl',v)}/>
        </div>
      </div>
    </div>
  );
}

function SettingsEditor({settings,setSettings}) {
  const u=(k,v)=>setSettings(p=>({...p,[k]:v}));
  return(
    <div>
      <div style={cardS}>
        <h3 style={secH}>⚙️ Company Details</h3>
        <div style={g2}>
          <Field label="Company Name" value={settings.companyName} onChange={v=>u('companyName',v)}/>
          <Field label="Logo Text" value={settings.logoText} onChange={v=>u('logoText',v)}/>
          <Field label="Email" value={settings.email} onChange={v=>u('email',v)} type="email"/>
          <Field label="Phone" value={settings.phone} onChange={v=>u('phone',v)}/>
          <Field label="WhatsApp Number" value={settings.whatsappNumber} onChange={v=>u('whatsappNumber',v)}/>
          <Field label="Booking URL" value={settings.bookingUrl} onChange={v=>u('bookingUrl',v)}/>
        </div>
        <Field label="WhatsApp Default Message" value={settings.whatsappMessage} onChange={v=>u('whatsappMessage',v)} type="textarea" rows={2}/>
      </div>
      <div style={cardS}>
        <h3 style={secH}>🔍 Global SEO Defaults</h3>
        <Field label="Default SEO Title" value={settings.defaultSeoTitle} onChange={v=>u('defaultSeoTitle',v)}/>
        <Field label="Default Meta Description" value={settings.defaultSeoDescription} onChange={v=>u('defaultSeoDescription',v)} type="textarea" rows={3}/>
      </div>
      <div style={cardS}>
        <h3 style={secH}>📱 Social Media URLs</h3>
        <div style={g2}>
          <Field label="Instagram" value={settings.instagramUrl} onChange={v=>u('instagramUrl',v)}/>
          <Field label="Facebook" value={settings.facebookUrl} onChange={v=>u('facebookUrl',v)}/>
          <Field label="YouTube" value={settings.youtubeUrl} onChange={v=>u('youtubeUrl',v)}/>
          <Field label="TikTok" value={settings.tiktokUrl} onChange={v=>u('tiktokUrl',v)}/>
          <Field label="LinkedIn" value={settings.linkedinUrl} onChange={v=>u('linkedinUrl',v)}/>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CMSPage() {
  const [activeTab,setActiveTab]=useState('homepage');
  const [activeServiceId,setActiveServiceId]=useState(null);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);

  const [homepageData,setHomepageData]=useState({});
  const [homepageDirty,setHomepageDirty]=useState(false);
  const [aboutData,setAboutData]=useState({});
  const [aboutDirty,setAboutDirty]=useState(false);
  const [servicesPageData,setServicesPageData]=useState({});
  const [servicesPageDirty,setServicesPageDirty]=useState(false);
  const [contactPageData,setContactPageData]=useState({});
  const [contactPageDirty,setContactPageDirty]=useState(false);

  const [servicesList,setServicesList]=useState([]);
  const [serviceEdits,setServiceEdits]=useState({});
  const [serviceDirty,setServiceDirty]=useState({});

  const [nav,setNav]=useState(null);
  const [navDirty,setNavDirty]=useState(false);
  const [footer,setFooter]=useState(null);
  const [footerDirty,setFooterDirty]=useState(false);
  const [settings,setSettings]=useState({});
  const [settingsDirty,setSettingsDirty]=useState(false);

  const [deleteTarget,setDeleteTarget]=useState(null);
  const [searchQuery,setSearchQuery]=useState('');

  useEffect(()=>{
    async function loadAll() {
      setLoading(true);
      try {
        const t = Date.now();
        const [cmsRes,svcRes,navRes,footerRes,settingsRes]=await Promise.all([
          fetch(`/api/admin/cms-data?t=${t}`).then(r=>r.ok?r.json():{}),
          fetch(`/api/admin/services?t=${t}`).then(r=>r.ok?r.json():{services:[]}),
          fetch(`/api/admin/navigation?t=${t}`).then(r=>r.ok?r.json():{}),
          fetch(`/api/admin/footer?t=${t}`).then(r=>r.ok?r.json():{}),
          fetch(`/api/admin/settings?t=${t}`).then(r=>r.ok?r.json():{}),
        ]);
        const comps=cmsRes.components||{};
        setHomepageData(comps);
        setAboutData(comps.aboutPage||{});
        setServicesPageData(comps.servicesPage||{});
        setContactPageData(comps.contactPage||{});
        setServicesList(svcRes.services||[]);
        setNav(navRes);
        setFooter(footerRes);
        setSettings(settingsRes.settings||settingsRes||{});
      } catch {
        showToast('Failed to load CMS data','error');
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  },[]);

  const updateHomepage=useCallback(v=>{setHomepageData(v);setHomepageDirty(true);},[]);
  const updateAbout=useCallback(v=>{setAboutData(v);setAboutDirty(true);},[]);
  const updateServicesPage=useCallback(v=>{setServicesPageData(v);setServicesPageDirty(true);},[]);
  const updateContactPage=useCallback(v=>{setContactPageData(v);setContactPageDirty(true);},[]);
  const updateNav=useCallback(v=>{setNav(v);setNavDirty(true);},[]);
  const updateFooter=useCallback(v=>{setFooter(v);setFooterDirty(true);},[]);
  const updateSettings=useCallback(v=>{setSettings(v);setSettingsDirty(true);},[]);
  const updateServiceEdit=(id,v)=>{setServiceEdits(p=>({...p,[id]:v}));setServiceDirty(p=>({...p,[id]:true}));};

  const saveComponent=async(sectionId,data)=>{
    const r=await fetch('/api/admin/cms',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'updateComponent',sectionId,componentData:data})});
    const json=await r.json();
    if(!r.ok||!json.success) throw new Error(json.error||'Save failed');
  };

  const saveHomepage=async()=>{
    setSaving(true);
    try {
      const sections=['hero','capabilities','servicesSection','process','cta','reviewsSection','contactSection'];
      for(const sid of sections) {
        if(homepageData[sid]!==undefined) await saveComponent(sid,homepageData[sid]);
      }
      await saveComponent('aboutPage',aboutData);
      await saveComponent('servicesPage',servicesPageData);
      await saveComponent('contactPage',contactPageData);
      // Re-fetch from server to confirm persistence
      const t=Date.now();
      const verified=await fetch(`/api/admin/cms-data?t=${t}`).then(r=>r.ok?r.json():{});
      const verifiedComps=verified.components||{};
      setHomepageData(verifiedComps);
      setAboutData(verifiedComps.aboutPage||{});
      setServicesPageData(verifiedComps.servicesPage||{});
      setContactPageData(verifiedComps.contactPage||{});
      setHomepageDirty(false);setAboutDirty(false);setServicesPageDirty(false);setContactPageDirty(false);
      showToast('✅ Saved & verified from server!');
    } catch(e) { showToast('Save failed: '+e.message,'error'); }
    finally { setSaving(false); }
  };

  const saveAbout=async()=>{
    setSaving(true);
    try { await saveComponent('aboutPage',aboutData);setAboutDirty(false);showToast('✅ About page saved!'); }
    catch { showToast('Save failed','error'); }
    finally { setSaving(false); }
  };

  const saveServicesPage=async()=>{
    setSaving(true);
    try { await saveComponent('servicesPage',servicesPageData);setServicesPageDirty(false);showToast('✅ Services page saved!'); }
    catch { showToast('Save failed','error'); }
    finally { setSaving(false); }
  };

  const saveContactPage=async()=>{
    setSaving(true);
    try { await saveComponent('contactPage',contactPageData);setContactPageDirty(false);showToast('✅ Contact page saved!'); }
    catch { showToast('Save failed','error'); }
    finally { setSaving(false); }
  };

  const saveService=async(serviceId)=>{
    const updated=serviceEdits[serviceId];
    if(!updated) return;
    setSaving(true);
    try {
      const r=await fetch('/api/admin/services',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(updated)});
      if(r.ok) {
        const{service}=await r.json();
        setServicesList(p=>p.map(s=>s.id===serviceId?service:s));
        setServiceEdits(p=>({...p,[serviceId]:service}));
        setServiceDirty(p=>({...p,[serviceId]:false}));
        showToast('✅ Service saved!');
      } else { const e=await r.json();showToast(e.error||'Save failed','error'); }
    } catch { showToast('Save failed','error'); }
    finally { setSaving(false); }
  };

  const deleteService=async(serviceId)=>{
    setSaving(true);
    try {
      const r=await fetch('/api/admin/services',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:serviceId})});
      if(r.ok) {
        setServicesList(p=>p.filter(s=>s.id!==serviceId));
        setDeleteTarget(null);
        if(activeServiceId===serviceId){setActiveServiceId(null);setActiveTab('services');}
        showToast('Service deleted');
      } else showToast('Delete failed','error');
    } catch { showToast('Error deleting','error'); }
    finally { setSaving(false); }
  };

  const saveNav=async()=>{
    setSaving(true);
    try { const r=await fetch('/api/admin/navigation',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(nav)});if(r.ok){setNavDirty(false);showToast('✅ Navigation saved!');}else showToast('Save failed','error'); }
    catch { showToast('Error','error'); }
    finally { setSaving(false); }
  };

  const saveFooter=async()=>{
    setSaving(true);
    try { const r=await fetch('/api/admin/footer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(footer)});if(r.ok){setFooterDirty(false);showToast('✅ Footer saved!');}else showToast('Save failed','error'); }
    catch { showToast('Error','error'); }
    finally { setSaving(false); }
  };

  const saveSettings=async()=>{
    setSaving(true);
    try { const r=await fetch('/api/admin/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(settings)});if(r.ok){setSettingsDirty(false);showToast('✅ Settings saved!');}else showToast('Save failed','error'); }
    catch { showToast('Error','error'); }
    finally { setSaving(false); }
  };

  const openService=(id)=>{
    const svc=servicesList.find(s=>s.id===id);
    if(svc&&!serviceEdits[id]) setServiceEdits(p=>({...p,[id]:{...svc}}));
    setActiveServiceId(id);setActiveTab('service-detail');
  };

  const filteredServices=searchQuery
    ?servicesList.filter(s=>s.name.toLowerCase().includes(searchQuery.toLowerCase())||(s.slug||'').toLowerCase().includes(searchQuery.toLowerCase())||(s.category||'').toLowerCase().includes(searchQuery.toLowerCase()))
    :servicesList;

  const getServiceData=(id)=>serviceEdits[id]??servicesList.find(s=>s.id===id)??{};
  const activeServiceData=activeServiceId?getServiceData(activeServiceId):null;
  const activeService=activeServiceId?servicesList.find(s=>s.id===activeServiceId):null;

  const TABS=[
    {id:'homepage',label:'🏠 Homepage'},
    {id:'about',label:'📖 About'},
    {id:'services',label:'🛠️ Services'},
    {id:'services-page',label:'📋 Services Page'},
    {id:'contact',label:'✉️ Contact'},
    {id:'navigation',label:'🔗 Navigation'},
    {id:'footer',label:'📌 Footer'},
    {id:'settings',label:'⚙️ Settings'},
  ];

  if(loading) return(
    <AdminLayoutWrapper>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh',color:'#6b7280',flexDirection:'column',gap:'1rem'}}>
        <div style={{fontSize:'2rem'}}>⚙️</div>
        <p style={{fontFamily:'Outfit,sans-serif',fontSize:'1rem'}}>Loading CMS data...</p>
      </div>
    </AdminLayoutWrapper>
  );

  return(
    <AdminLayoutWrapper>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
        input:focus,textarea:focus,select:focus{border-color:rgba(5,150,105,0.5)!important;outline:none!important}
        .cms-tab:hover{background:rgba(255,255,255,0.06)!important;color:#e5e7eb!important}
        .svc-row:hover{background:rgba(255,255,255,0.04)!important}
      `}</style>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'2rem',flexWrap:'wrap',gap:'1rem'}}>
        <div>
          <h1 style={{fontSize:'1.7rem',fontWeight:900,color:'#fff',margin:0,fontFamily:'Outfit,sans-serif'}}>♦ Heritage Studios CMS</h1>
          <p style={{color:'#6b7280',margin:'0.3rem 0 0',fontSize:'0.9rem'}}>Edit all website content — pages, services, navigation, footer, settings &amp; SEO.</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" style={{...btnGhost,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'0.4rem'}}>🌐 Preview Site</a>
      </div>

      <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap',marginBottom:'2rem',borderBottom:'1px solid rgba(255,255,255,0.06)',paddingBottom:'1rem'}}>
        {TABS.map(t=>(
          <button key={t.id} className="cms-tab" onClick={()=>{setActiveTab(t.id);setActiveServiceId(null);}}
            style={{background:activeTab===t.id&&!activeServiceId?'rgba(5,150,105,0.2)':'rgba(255,255,255,0.04)',border:`1px solid ${activeTab===t.id&&!activeServiceId?'rgba(5,150,105,0.4)':'rgba(255,255,255,0.07)'}`,borderRadius:10,color:activeTab===t.id&&!activeServiceId?'#34d399':'#9ca3af',padding:'0.55rem 1rem',fontFamily:'Outfit,sans-serif',fontWeight:600,fontSize:'0.85rem',cursor:'pointer',transition:'all 0.2s'}}>
            {t.label}
          </button>
        ))}
        {activeServiceId&&(
          <button className="cms-tab" style={{background:'rgba(5,150,105,0.2)',border:'1px solid rgba(5,150,105,0.4)',borderRadius:10,color:'#34d399',padding:'0.55rem 1rem',fontFamily:'Outfit,sans-serif',fontWeight:600,fontSize:'0.85rem',cursor:'pointer'}}>
            {activeService?.icon||'✦'} {activeService?.name||'Service'}
          </button>
        )}
      </div>

      {activeTab==='homepage'&&!activeServiceId&&(
        <div style={{animation:'fadeIn 0.3s ease'}}>
          <HomepageEditor data={homepageData} onChange={updateHomepage}/>
          <SaveBar saving={saving} dirty={homepageDirty} onSave={saveHomepage} label="Save Homepage"/>
        </div>
      )}

      {activeTab==='about'&&!activeServiceId&&(
        <div style={{maxWidth:800,animation:'fadeIn 0.3s ease'}}>
          <AboutEditor data={aboutData} onChange={updateAbout}/>
          <SaveBar saving={saving} dirty={aboutDirty} onSave={saveAbout} label="Save About Page"/>
        </div>
      )}

      {activeTab==='services-page'&&!activeServiceId&&(
        <div style={{maxWidth:800,animation:'fadeIn 0.3s ease'}}>
          <ServicesPageEditor data={servicesPageData} onChange={updateServicesPage}/>
          <SaveBar saving={saving} dirty={servicesPageDirty} onSave={saveServicesPage} label="Save Services Page"/>
        </div>
      )}

      {activeTab==='contact'&&!activeServiceId&&(
        <div style={{maxWidth:800,animation:'fadeIn 0.3s ease'}}>
          <ContactPageEditor data={contactPageData} onChange={updateContactPage}/>
          <SaveBar saving={saving} dirty={contactPageDirty} onSave={saveContactPage} label="Save Contact Page"/>
        </div>
      )}

      {activeTab==='navigation'&&!activeServiceId&&(
        <div style={{maxWidth:800,animation:'fadeIn 0.3s ease'}}>
          <NavEditor nav={nav} setNav={updateNav}/>
          <SaveBar saving={saving} dirty={navDirty} onSave={saveNav} label="Save Navigation"/>
        </div>
      )}

      {activeTab==='footer'&&!activeServiceId&&(
        <div style={{animation:'fadeIn 0.3s ease'}}>
          <FooterEditor footer={footer} setFooter={updateFooter}/>
          <SaveBar saving={saving} dirty={footerDirty} onSave={saveFooter} label="Save Footer"/>
        </div>
      )}

      {activeTab==='settings'&&!activeServiceId&&(
        <div style={{animation:'fadeIn 0.3s ease'}}>
          <SettingsEditor settings={settings} setSettings={updateSettings}/>
          <SaveBar saving={saving} dirty={settingsDirty} onSave={saveSettings} label="Save Settings"/>
        </div>
      )}

      {activeTab==='services'&&!activeServiceId&&(
        <div style={{animation:'fadeIn 0.3s ease'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'0.75rem'}}>
            <h2 style={{...secH,margin:0}}>All Services ({servicesList.length})</h2>
            <div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
              <input style={{...inp,width:220}} placeholder="🔍 Search services..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
              <a href="/admin/services" style={{...btn,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'0.4rem'}}>+ Add Service</a>
            </div>
          </div>

          <div style={{marginBottom:'2rem'}}>
            <p style={{...lbl,fontSize:'0.78rem',color:'#9ca3af',borderBottom:'1px solid rgba(255,255,255,0.06)',paddingBottom:'0.5rem',marginBottom:'0.75rem'}}>Primary Services ({filteredServices.filter(s=>!s.parentService).length})</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'0.75rem'}}>
              {filteredServices.filter(s=>!s.parentService).map(svc=>(
                <div key={svc.id} className="svc-row" style={{background:'#0e1420',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'1.1rem 1.25rem',display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',transition:'all 0.2s'}}>
                  <div onClick={()=>openService(svc.id)} style={{flex:1}}>
                    <p style={{margin:0,fontWeight:700,color:'#fff',fontSize:'0.92rem'}}>{svc.icon||'✦'} {svc.name}{serviceDirty[svc.id]&&<span style={{color:'#fbbf24',fontSize:'0.7rem',marginLeft:'0.5rem'}}>● Unsaved</span>}</p>
                    <p style={{margin:'0.2rem 0 0',color:'#6b7280',fontSize:'0.77rem'}}>/services/{svc.slug} · {svc.category}</p>
                  </div>
                  <div style={{display:'flex',gap:'0.4rem',flexShrink:0}}>
                    <button onClick={()=>openService(svc.id)} style={{...btn,padding:'0.35rem 0.75rem',fontSize:'0.78rem'}}>Edit</button>
                    <button onClick={()=>setDeleteTarget(svc)} style={btnDanger}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredServices.filter(s=>s.parentService).length>0&&(
            <div>
              <p style={{...lbl,fontSize:'0.78rem',color:'#9ca3af',borderBottom:'1px solid rgba(255,255,255,0.06)',paddingBottom:'0.5rem',marginBottom:'0.75rem'}}>Sub-Services & Tiers ({filteredServices.filter(s=>s.parentService).length})</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'0.75rem'}}>
                {filteredServices.filter(s=>s.parentService).map(svc=>{
                  const parent=servicesList.find(p=>p.id===svc.parentService);
                  return(
                    <div key={svc.id} className="svc-row" style={{background:'#0e1420',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'1rem 1.25rem',display:'flex',justifyContent:'space-between',alignItems:'center',transition:'all 0.2s'}}>
                      <div onClick={()=>openService(svc.id)} style={{flex:1,cursor:'pointer'}}>
                        <p style={{margin:0,fontWeight:700,color:'#e5e7eb',fontSize:'0.88rem'}}>{svc.icon||'⚡'} {svc.name}{serviceDirty[svc.id]&&<span style={{color:'#fbbf24',fontSize:'0.7rem',marginLeft:'0.5rem'}}>● Unsaved</span>}</p>
                        <p style={{margin:'0.2rem 0 0',color:'#6b7280',fontSize:'0.75rem'}}>↳ {parent?.name||svc.parentService}</p>
                      </div>
                      <div style={{display:'flex',gap:'0.4rem',flexShrink:0}}>
                        <button onClick={()=>openService(svc.id)} style={{...btn,padding:'0.35rem 0.75rem',fontSize:'0.78rem'}}>Edit</button>
                        <button onClick={()=>setDeleteTarget(svc)} style={btnDanger}>✕</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {filteredServices.length===0&&(
            <div style={{textAlign:'center',padding:'3rem',color:'#4b5563'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'0.75rem'}}>🔍</div>
              <p style={{fontFamily:'Outfit,sans-serif'}}>No services match your search.</p>
            </div>
          )}
        </div>
      )}

      {activeTab==='service-detail'&&activeServiceId&&(
        <div style={{animation:'fadeIn 0.3s ease'}}>
          <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.75rem',flexWrap:'wrap'}}>
            <button onClick={()=>{setActiveServiceId(null);setActiveTab('services');}} style={{...btnGhost,padding:'0.4rem 0.85rem',fontSize:'0.82rem'}}>← Back to Services</button>
            <h2 style={{...secH,margin:0,fontSize:'1.25rem'}}>{activeServiceData?.icon||'✦'} {activeServiceData?.name||'Service Editor'}</h2>
            {serviceDirty[activeServiceId]&&<span style={{color:'#fbbf24',fontSize:'0.82rem',fontWeight:600}}>● Unsaved changes</span>}
          </div>
          <ServiceDetailEditor service={activeServiceData} onChange={val=>updateServiceEdit(activeServiceId,val)}/>
          <SaveBar saving={saving} dirty={serviceDirty[activeServiceId]||false} onSave={()=>saveService(activeServiceId)} label={`Save ${activeServiceData?.name||'Service'}`}/>
        </div>
      )}

      {deleteTarget&&(
        <ConfirmDialog
          message={`Delete "${deleteTarget.name}"? This will permanently remove this service from the website.`}
          onConfirm={()=>deleteService(deleteTarget.id)}
          onCancel={()=>setDeleteTarget(null)}
        />
      )}
    </AdminLayoutWrapper>
  );
}
