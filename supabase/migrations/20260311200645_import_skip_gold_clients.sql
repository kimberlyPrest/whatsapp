-- Migration to bulk import and update 11 specific 'Skip - Gold' clients

WITH data (phone_number, contact_name, email, tipo, tag) AS (
  VALUES
    ('5511996330400', 'Mariangela Guazelli', 'mariangela.guazelli@gmail.com', 'skip - gold', 'Não está na pipe'),
    ('5554996237380', 'Julio - Jv Sassi Confecções Ltda', 'julio@dicorpo.com.br', 'skip - gold', 'Não está na pipe'),
    ('5516981522222', 'Rafael Tavares Gonçalves', 'rafa_guara@hotmail.com', 'skip - gold', 'Não está na pipe'),
    ('5544991212248', 'Oswaldo Custódio De Oliveira Neto', 'ocustodion@gmail.com', 'skip - gold', 'Não está na pipe'),
    ('5524999840651', 'Wendell Lemos', 'wendell.lemos@hotmail.com', 'skip - gold', 'Não está na pipe'),
    ('5598991905407', 'Renato Maia Gama', 'renato.m.gama@gmail.com', 'skip - gold', 'Não está na pipe'),
    ('5531991920102', 'Igor Rosa', 'igormr13@gmail.com', 'skip - gold', 'Não está na pipe'),
    ('5561983134256', 'Jonathan Medeiros', 'jonathanmc00@gmail.com', 'skip - gold', 'Não está na pipe'),
    ('5561996459871', 'Fernando César De Oliveira Alves', 'scr.fernando@gmail.com', 'skip - gold', 'Não está na pipe'),
    ('5521981212021', 'Simone Chalub', 'simone@primepisos.com.br', 'skip - gold', 'Não está na pipe'),
    ('5511996639556', 'Marcelo - Tspro Fabricação Distr. E Repr. De Equipamentos Industriais Ltda', 'arthur@tspro.com.br', 'skip - gold', 'Não está na pipe')
),
upserted_clients AS (
  INSERT INTO public.client_profiles (phone_number, contact_name, email, tipos, tags, propriedade)
  SELECT 
    phone_number, 
    contact_name, 
    email, 
    ARRAY[tipo], 
    ARRAY[tag],
    TRUE
  FROM data
  ON CONFLICT (phone_number) DO UPDATE SET
    contact_name = EXCLUDED.contact_name,
    email = EXCLUDED.email,
    propriedade = TRUE,
    tipos = CASE 
      WHEN EXCLUDED.tipos[1] = ANY(COALESCE(public.client_profiles.tipos, '{}'::text[])) 
      THEN public.client_profiles.tipos 
      ELSE array_append(COALESCE(public.client_profiles.tipos, '{}'::text[]), EXCLUDED.tipos[1]) 
    END,
    tags = CASE 
      WHEN EXCLUDED.tags[1] = ANY(COALESCE(public.client_profiles.tags, '{}'::text[])) 
      THEN public.client_profiles.tags 
      ELSE array_append(COALESCE(public.client_profiles.tags, '{}'::text[]), EXCLUDED.tags[1]) 
    END,
    updated_at = NOW()
  RETURNING id
)
INSERT INTO public.meus_clientes (client_id)
SELECT id FROM upserted_clients
ON CONFLICT (client_id) DO NOTHING;
