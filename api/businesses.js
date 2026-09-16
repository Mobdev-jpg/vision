import { createClient } from '@supabase/supabase-js';
const supa=()=>createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
const real=[
 {id:'real-sawaaden',slug:'sawaaden-tours-and-travels',name:'Sawaaden Tours and Travels (Silk Route Tourism)',category:'Tour Operator',city:'Gangtok',state:'Sikkim',cover_image:'',verified:false,about:'Gangtok-based tour operator offering Sikkim sightseeing, Silk Route trips, homestays, cab services and hotel bookings.',phone:'+91977552239',views:0,leads:0,created_at:'2026-01-01T00:00:00Z',rating:4.7,reviewCount:160,website:'https://sawaadentours.in/',address:'Near Titanic Park, MG Road, Gangtok, Sikkim 737101',sourceUrl:'https://www.justdial.com/Gangtok/Sawaaden-Tours-and-Travels-Mg-Marg-Near-Titanic-Park-Gangtok-Bazar/9999P3592-3592-180303155155-Z5T6_BZDET'},
 {id:'real-khangri',slug:'khangri-tours-treks',name:'Khangri Tours, Treks & Expeditions',category:'Adventure',city:'Gangtok',state:'Sikkim',cover_image:'https://khangrii.com/SliderImage/image?sliderImageId=2',verified:false,about:'Sikkim-based Himalayan adventure operator founded in 1994, offering treks, tours and expeditions across the Eastern Himalayas.',phone:'+918116762251',views:0,leads:0,created_at:'2026-01-02T00:00:00Z',rating:0,reviewCount:0,website:'https://khangrii.com/',address:'Khangri Building, Behind Axis Bank, M.G. Marg, Gangtok, Sikkim 737101',sourceUrl:'https://khangrii.com/'},
 {id:'real-footprint',slug:'footprint-holidays',name:'Footprint Holidays',category:'Tour Operator',city:'Gangtok',state:'Sikkim',cover_image:'https://www.footprintholiday.com/uploads/web_package/iStock-2233575052.jpg',verified:false,about:'Himalayan travel company offering Sikkim, Darjeeling and Bhutan tours with transport and local trip support.',phone:'+919593888555',views:0,leads:0,created_at:'2026-01-03T00:00:00Z',rating:0,reviewCount:0,website:'https://www.footprintholiday.com/',address:'Gangtok, Sikkim, India',sourceUrl:'https://www.footprintholiday.com/'},
 {id:'real-nbt',slug:'north-bengal-tourism',name:'North Bengal Tourism',category:'Travel Agency',city:'Siliguri',state:'West Bengal',cover_image:'https://explorenorthbengal.com/images/places/hero_darjeeling.webp',verified:false,about:'Domestic tour operator and travel agency serving Darjeeling, Sikkim, Dooars, Kalimpong, Bhutan and wider destinations.',phone:'+918145584286',views:0,leads:0,created_at:'2026-01-04T00:00:00Z',rating:4.5,reviewCount:668,website:'https://explorenorthbengal.com/',address:'Siliguri, West Bengal, India',sourceUrl:'https://explorenorthbengal.com/'},
 {id:'real-travelzone',slug:'travelzone-tours-and-travels',name:'Travelzone Tours and Travels',category:'Tour Operator',city:'Gangtok',state:'Sikkim',cover_image:'',verified:false,about:'Tour operator established in 1996 offering planned and customized travel across Sikkim, Darjeeling, Northeast India, Nepal and Bhutan.',phone:'+919832013211',views:0,leads:0,created_at:'2026-01-05T00:00:00Z',rating:0,reviewCount:0,website:'https://www.sikkimtravelzone.com/',address:'Church Road, Below Police Headquarters, Arithang, Gangtok, Sikkim 737101',sourceUrl:'https://www.sikkimtravelzone.com/about-us'}
];
export default async function handler(req,res){
  try{
    const q=String(req.query.q||'').trim().toLowerCase(); const category=String(req.query.category||'').trim(); const city=String(req.query.city||'').trim().toLowerCase();
    let dbItems=[];
    if(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY){
      const db=supa(); let query=db.from('businesses').select('id,slug,name,category,city,state,cover_image,verified,about,views,leads,created_at,phone,reviews(rating)').eq('published',true).order('verified',{ascending:false}).order('created_at',{ascending:false}).limit(60);
      if(q) query=query.or(`name.ilike.%${q}%,city.ilike.%${q}%,state.ilike.%${q}%,about.ilike.%${q}%`);
      if(category) query=query.eq('category',category); if(city) query=query.ilike('city',`%${city}%`);
      const {data,error}=await query; if(error) throw error;
      dbItems=(data||[]).map(b=>{const rs=b.reviews||[]; const avg=rs.length?rs.reduce((a,r)=>a+r.rating,0)/rs.length:0; return {...b,rating:Number(avg.toFixed(1)),reviewCount:rs.length};});
    }
    const pub=real.filter(b=>(!q||`${b.name} ${b.category} ${b.city} ${b.state} ${b.about}`.toLowerCase().includes(q))&&(!category||b.category===category)&&(!city||b.city.toLowerCase().includes(city)));
    const items=[...dbItems,...pub.filter(p=>!dbItems.some(d=>d.slug===p.slug))].slice(0,60);
    res.setHeader('Cache-Control','s-maxage=60, stale-while-revalidate=300'); res.status(200).json({items});
  }catch(e){res.status(500).json({error:'Unable to load businesses'});}
}
