import { createClient } from '@supabase/supabase-js';
const supa=()=>createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
export default async function handler(req,res){
  try{
    const db=supa(); const q=String(req.query.q||'').trim(); const category=String(req.query.category||'').trim(); const city=String(req.query.city||'').trim();
    let query=db.from('businesses').select('id,slug,name,category,city,state,cover_image,verified,about,views,leads,created_at,reviews(rating)').eq('published',true).order('verified',{ascending:false}).order('created_at',{ascending:false}).limit(60);
    if(q) query=query.or(`name.ilike.%${q}%,city.ilike.%${q}%,state.ilike.%${q}%,about.ilike.%${q}%`);
    if(category) query=query.eq('category',category); if(city) query=query.ilike('city',`%${city}%`);
    const {data,error}=await query; if(error) throw error;
    const items=(data||[]).map(b=>{const rs=b.reviews||[]; const avg=rs.length?rs.reduce((a,r)=>a+r.rating,0)/rs.length:0; return {...b,rating:Number(avg.toFixed(1)),reviewCount:rs.length};});
    res.setHeader('Cache-Control','s-maxage=60, stale-while-revalidate=300'); res.status(200).json({items});
  }catch(e){res.status(500).json({error:'Unable to load businesses'});}
}
