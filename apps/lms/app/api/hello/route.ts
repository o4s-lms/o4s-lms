import { NextRequest } from 'next/server'
import cors from '@/lib/cors'

export async function GET(request: NextRequest) {
  // `cors` also takes care of handling OPTIONS requests
  return cors(
    request,
    new Response(JSON.stringify({ message: 'Hello World!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  )
}