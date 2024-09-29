import { ROUTE_CONFIG } from '@/configs/route';
import { redirect } from 'next/navigation'

export default function Home() {
  
  redirect(ROUTE_CONFIG.TOPIC)
  
  return (
    <></>
  );
}
