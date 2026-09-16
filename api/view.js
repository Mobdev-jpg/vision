import { createClient } from '@supabase/supabase-js';
const db=()=>createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
export default async function handler(req,res){if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'}); try{const {business_id}=req.body||{};if(!business_id) return res.status(400).json({error:'business_id required'}); await db().from('business_views').insert({business_id}); await db().rpc('increment_business_views',{business_id_param:business_id}).catch(()=>{}); res.status(204).end();}catch(e){res.status(204).end();}}
