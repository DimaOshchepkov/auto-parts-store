import { http } from '@/lib/http';

export async function initHttp() {
  await http.get('/sanctum/csrf-cookie');
}
