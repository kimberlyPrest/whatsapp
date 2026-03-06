-- show_up: operador marca se o cliente compareceu à reunião
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS show_up BOOLEAN DEFAULT NULL;

-- reschedule_link: extraído automaticamente da descrição do evento HubSpot
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS reschedule_link TEXT;
