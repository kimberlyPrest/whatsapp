import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { suggestion_id, final_text, phone_number } = await req.json()

    // Validação básica
    if (!final_text || !phone_number) {
      throw new Error('Missing final_text or phone_number')
    }

    // 1. Configuração do n8n
    // Você deve colocar essas variáveis no .env do Supabase (Edge Functions Secrets)
    const N8N_WEBHOOK_URL = Deno.env.get('N8N_WEBHOOK_URL') // URL do Webhook do Workflow 3
    const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET_TOKEN') // O token esperado pelo node "Validate Input"

    if (!N8N_WEBHOOK_URL) {
      throw new Error('Server misconfiguration: Missing N8N_WEBHOOK_URL')
    }

    // 2. Dispara o Workflow 3 do n8n
    // O n8n vai cuidar de: Salvar no banco, Enviar no WhatsApp e Calcular nota da IA
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WEBHOOK_SECRET}`,
      },
      body: JSON.stringify({
        suggestion_id,
        final_text,
        phone_number,
      }),
    })

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      throw new Error(`n8n Error: ${errorText}`)
    }

    const result = await n8nResponse.json()

    // 3. Retorna o resultado do n8n para o Frontend
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
