import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async () => {
  return new Response(
    JSON.stringify({ message: 'Placeholder edge function to satisfy entrypoint requirement' }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
