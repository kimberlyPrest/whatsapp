-- Update existing client profiles to replace 'Skip' with 'skip - basic'
UPDATE public.client_profiles
SET tipos = array_replace(tipos, 'Skip', 'skip - basic')
WHERE 'Skip' = ANY(tipos);

-- Also update any lowercase 'skip' to 'skip - basic' just in case
UPDATE public.client_profiles
SET tipos = array_replace(tipos, 'skip', 'skip - basic')
WHERE 'skip' = ANY(tipos);
