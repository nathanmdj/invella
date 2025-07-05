-- Template Seeding Data
-- This file seeds the database with initial template data

-- Insert sample templates with viral-worthy designs
INSERT INTO public.invitation_templates (id, name, description, design_config, category, is_public, preview_image, created_at, updated_at)
VALUES
  (
    'a0b1c2d3-e4f5-6789-abcd-ef0123456789',
    'Luxury Gradient Wedding',
    'Stunning gradient design with floating elements - perfect for viral sharing',
    '{"primaryColor": "#667eea", "accentColor": "#764ba2", "backgroundColor": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "surfaceColor": "rgba(255, 255, 255, 0.95)", "textColor": "#1f2937", "textSecondaryColor": "#6b7280", "borderColor": "rgba(255, 255, 255, 0.3)", "overlayColor": "rgba(0, 0, 0, 0.5)", "fontFamily": "serif", "layout": "luxury"}',
    'wedding',
    true,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400',
    now(),
    now()
  ),
  (
    'b1c2d3e4-f5a6-789b-cdef-012345678901',
    'Neon Birthday Blast',
    'Electric neon design that lights up social media - viral-ready party vibes',
    '{"primaryColor": "#ff006e", "accentColor": "#8338ec", "backgroundColor": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", "surfaceColor": "rgba(255, 255, 255, 0.1)", "textColor": "#ffffff", "textSecondaryColor": "#e0e7ff", "borderColor": "rgba(255, 255, 255, 0.2)", "overlayColor": "rgba(0, 0, 0, 0.3)", "fontFamily": "sans-serif", "layout": "neon"}',
    'birthday',
    true,
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    now(),
    now()
  ),
  (
    'c2d3e4f5-a6b7-89cd-ef01-23456789abcd',
    'Glassmorphism Corporate',
    'Ultra-modern glassmorphism design that commands attention and shares beautifully',
    '{"primaryColor": "#4facfe", "accentColor": "#00f2fe", "backgroundColor": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", "surfaceColor": "rgba(255, 255, 255, 0.12)", "textColor": "#1f2937", "textSecondaryColor": "#6b7280", "borderColor": "rgba(255, 255, 255, 0.2)", "overlayColor": "rgba(0, 0, 0, 0.1)", "fontFamily": "sans-serif", "layout": "glassmorphism"}',
    'corporate',
    true,
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
    now(),
    now()
  ),
  (
    'd3e4f5a6-b789-cdef-0123-456789abcdef',
    'Botanical Luxury',
    'Instagram-worthy botanical design with premium gradients and floating elements',
    '{"primaryColor": "#43e97b", "accentColor": "#38f9d7", "backgroundColor": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", "surfaceColor": "rgba(255, 255, 255, 0.9)", "textColor": "#1f2937", "textSecondaryColor": "#6b7280", "borderColor": "rgba(255, 255, 255, 0.3)", "overlayColor": "rgba(0, 0, 0, 0.2)", "fontFamily": "serif", "layout": "botanical"}',
    'birthday',
    true,
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    now(),
    now()
  ),
  (
    'e4f5a6b7-89cd-ef01-2345-6789abcdef01',
    'Sunset Romance Anniversary',
    'Breathtaking sunset gradients with luxury typography - made for sharing special moments',
    '{"primaryColor": "#fa709a", "accentColor": "#fee140", "backgroundColor": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", "surfaceColor": "rgba(255, 255, 255, 0.85)", "textColor": "#1f2937", "textSecondaryColor": "#6b7280", "borderColor": "rgba(255, 255, 255, 0.4)", "overlayColor": "rgba(0, 0, 0, 0.3)", "fontFamily": "serif", "layout": "romantic"}',
    'anniversary',
    true,
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400',
    now(),
    now()
  ),
  (
    'f5a6b789-cdef-0123-4567-89abcdef0123',
    'Retro Futurism',
    'Cyberpunk-inspired design with neon grids and 80s vibes - guaranteed to go viral',
    '{"primaryColor": "#ff0080", "accentColor": "#00ffff", "backgroundColor": "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", "surfaceColor": "rgba(255, 255, 255, 0.05)", "textColor": "#ffffff", "textSecondaryColor": "#c7d2fe", "borderColor": "rgba(255, 0, 128, 0.3)", "overlayColor": "rgba(0, 0, 0, 0.7)", "fontFamily": "sans-serif", "layout": "retro"}',
    'corporate',
    true,
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    now(),
    now()
  ),
  (
    'a6b7c8d9-e0f1-2345-6789-abcdef012345',
    'Dreamy Clouds Baby Shower',
    'Heavenly pastel clouds with ethereal gradients - perfect for social media moments',
    '{"primaryColor": "#a8edea", "accentColor": "#fed6e3", "backgroundColor": "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", "surfaceColor": "rgba(255, 255, 255, 0.8)", "textColor": "#1f2937", "textSecondaryColor": "#6b7280", "borderColor": "rgba(255, 255, 255, 0.5)", "overlayColor": "rgba(0, 0, 0, 0.1)", "fontFamily": "sans-serif", "layout": "dreamy"}',
    'baby_shower',
    true,
    'https://images.unsplash.com/photo-1520809599-e9da2db8e4f8?w=400',
    now(),
    now()
  ),
  (
    'b7c8d9e0-f1a2-3456-789a-bcdef0123456',
    'Achievement Glow',
    'Dynamic holographic design with achievement badges - perfect for LinkedIn sharing',
    '{"primaryColor": "#8b5cf6", "accentColor": "#06b6d4", "backgroundColor": "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)", "surfaceColor": "rgba(255, 255, 255, 0.15)", "textColor": "#ffffff", "textSecondaryColor": "#e0e7ff", "borderColor": "rgba(255, 255, 255, 0.3)", "overlayColor": "rgba(0, 0, 0, 0.2)", "fontFamily": "sans-serif", "layout": "holographic"}',
    'graduation',
    true,
    'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400',
    now(),
    now()
  ),
  (
    'c8d9e0f1-a2b3-4567-89ab-cdef01234567',
    'Winter Aurora',
    'Magical aurora-inspired gradients with crystalline effects - Instagram-ready holiday vibes',
    '{"primaryColor": "#10b981", "accentColor": "#3b82f6", "backgroundColor": "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)", "surfaceColor": "rgba(255, 255, 255, 0.9)", "textColor": "#1f2937", "textSecondaryColor": "#6b7280", "borderColor": "rgba(255, 255, 255, 0.6)", "overlayColor": "rgba(0, 0, 0, 0.1)", "fontFamily": "serif", "layout": "aurora"}',
    'holiday',
    true,
    'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400',
    now(),
    now()
  ),
  (
    'd9e0f1a2-b3c4-5678-9abc-def012345678',
    'Rose Gold Elegance',
    'Luxury rose gold with silk textures and floating petals - viral wedding inspiration',
    '{"primaryColor": "#f472b6", "accentColor": "#fb7185", "backgroundColor": "linear-gradient(135deg, #fce7f3 0%, #fed7e2 50%, #fecaca 100%)", "surfaceColor": "rgba(255, 255, 255, 0.95)", "textColor": "#be185d", "textSecondaryColor": "#9f1239", "borderColor": "rgba(244, 114, 182, 0.3)", "overlayColor": "rgba(0, 0, 0, 0.05)", "fontFamily": "serif", "layout": "rosegold"}',
    'wedding',
    true,
    'https://images.unsplash.com/photo-1544531586-fbb6c08c2d79?w=400',
    now(),
    now()
  ),
  (
    'e0f1a2b3-c4d5-6789-abcd-ef0123456789',
    'Neon Matrix',
    'Cyberpunk matrix design with data streams and holographic UI - TikTok viral potential',
    '{"primaryColor": "#00ff41", "accentColor": "#ff0080", "backgroundColor": "linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)", "surfaceColor": "rgba(0, 255, 65, 0.1)", "textColor": "#00ff41", "textSecondaryColor": "#00cc33", "borderColor": "rgba(0, 255, 65, 0.3)", "overlayColor": "rgba(0, 0, 0, 0.8)", "fontFamily": "monospace", "layout": "matrix"}',
    'corporate',
    true,
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    now(),
    now()
  ),
  (
    'f1a2b3c4-d5e6-789a-bcde-f01234567890',
    'Ocean Vibes',
    'Flowing water gradients with wave animations - perfect for beach event shares',
    '{"primaryColor": "#0891b2", "accentColor": "#06b6d4", "backgroundColor": "linear-gradient(135deg, #67e8f9 0%, #0891b2 50%, #0e7490 100%)", "surfaceColor": "rgba(255, 255, 255, 0.85)", "textColor": "#0c4a6e", "textSecondaryColor": "#0e7490", "borderColor": "rgba(255, 255, 255, 0.4)", "overlayColor": "rgba(0, 0, 0, 0.1)", "fontFamily": "sans-serif", "layout": "ocean"}',
    'other',
    true,
    'https://images.unsplash.com/photo-1527015175922-36a3297687d5?w=400',
    now(),
    now()
  );

-- Note: Since we're using UUIDs, no sequence update is needed
-- The templates above provide a good starting collection for users

-- Insert test user
-- First insert into auth.users (using INSERT ... ON CONFLICT DO NOTHING)
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'test@example.com',
  '$2a$10$NaMVRrI7NyfwP.AfAVWt6O/abulGnf9BBqwa6DqdMwXMvOCGpAnVO', -- password: "password123"
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Test User", "email": "test@example.com"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Insert corresponding account record (using INSERT ... ON CONFLICT DO NOTHING)
INSERT INTO public.accounts (
  id,
  name,
  email,
  picture_url,
  created_at,
  updated_at,
  created_by,
  updated_by,
  public_data
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Test User',
  'test@example.com',
  null,
  now(),
  now(),
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '{}'::jsonb
) ON CONFLICT (id) DO NOTHING;