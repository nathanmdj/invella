-- Template Seeding Data
-- This file seeds the database with initial template data

-- Insert sample templates
INSERT INTO public.invitation_templates (id, name, description, design_config, category, is_public, preview_image, created_at, updated_at)
VALUES
  (
    'a0b1c2d3-e4f5-6789-abcd-ef0123456789',
    'Elegant Wedding',
    'Beautiful floral design perfect for weddings',
    '{"primaryColor": "#f8fafc", "accentColor": "#e11d48", "fontFamily": "serif", "layout": "classic"}',
    'wedding',
    true,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400',
    now(),
    now()
  ),
  (
    'b1c2d3e4-f5a6-789b-cdef-012345678901',
    'Modern Birthday',
    'Vibrant and fun design for birthday celebrations',
    '{"primaryColor": "#fbbf24", "accentColor": "#7c3aed", "fontFamily": "sans-serif", "layout": "modern"}',
    'birthday',
    true,
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    now(),
    now()
  ),
  (
    'c2d3e4f5-a6b7-89cd-ef01-23456789abcd',
    'Corporate Event',
    'Professional and clean design for business events',
    '{"primaryColor": "#1f2937", "accentColor": "#3b82f6", "fontFamily": "sans-serif", "layout": "minimal"}',
    'corporate',
    true,
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
    now(),
    now()
  ),
  (
    'd3e4f5a6-b789-cdef-0123-456789abcdef',
    'Garden Party',
    'Natural and fresh design with botanical elements',
    '{"primaryColor": "#ecfdf5", "accentColor": "#059669", "fontFamily": "serif", "layout": "garden"}',
    'birthday',
    true,
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    now(),
    now()
  ),
  (
    'e4f5a6b7-89cd-ef01-2345-6789abcdef01',
    'Golden Anniversary',
    'Luxurious gold-themed design for special anniversaries',
    '{"primaryColor": "#fffbeb", "accentColor": "#d97706", "fontFamily": "serif", "layout": "luxury"}',
    'anniversary',
    true,
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400',
    now(),
    now()
  ),
  (
    'f5a6b789-cdef-0123-4567-89abcdef0123',
    'Minimalist',
    'Clean and simple design that works for any event',
    '{"primaryColor": "#ffffff", "accentColor": "#1f2937", "fontFamily": "sans-serif", "layout": "minimal"}',
    'corporate',
    true,
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    now(),
    now()
  ),
  (
    'a6b7c8d9-e0f1-2345-6789-abcdef012345',
    'Baby Shower Bliss',
    'Soft and gentle design perfect for baby showers',
    '{"primaryColor": "#fef3c7", "accentColor": "#f59e0b", "fontFamily": "sans-serif", "layout": "soft"}',
    'baby_shower',
    true,
    'https://images.unsplash.com/photo-1520809599-e9da2db8e4f8?w=400',
    now(),
    now()
  ),
  (
    'b7c8d9e0-f1a2-3456-789a-bcdef0123456',
    'Graduation Celebration',
    'Proud and inspiring design for graduation ceremonies',
    '{"primaryColor": "#dbeafe", "accentColor": "#2563eb", "fontFamily": "serif", "layout": "academic"}',
    'graduation',
    true,
    'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400',
    now(),
    now()
  ),
  (
    'c8d9e0f1-a2b3-4567-89ab-cdef01234567',
    'Holiday Magic',
    'Festive and warm design for holiday celebrations',
    '{"primaryColor": "#fef2f2", "accentColor": "#dc2626", "fontFamily": "serif", "layout": "festive"}',
    'holiday',
    true,
    'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400',
    now(),
    now()
  ),
  (
    'd9e0f1a2-b3c4-5678-9abc-def012345678',
    'Vintage Romance',
    'Classic vintage style with romantic touches',
    '{"primaryColor": "#fdf2f8", "accentColor": "#be185d", "fontFamily": "serif", "layout": "vintage"}',
    'wedding',
    true,
    'https://images.unsplash.com/photo-1544531586-fbb6c08c2d79?w=400',
    now(),
    now()
  ),
  (
    'e0f1a2b3-c4d5-6789-abcd-ef0123456789',
    'Tech Conference',
    'Modern and sleek design for technology events',
    '{"primaryColor": "#f1f5f9", "accentColor": "#0ea5e9", "fontFamily": "sans-serif", "layout": "tech"}',
    'corporate',
    true,
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    now(),
    now()
  ),
  (
    'f1a2b3c4-d5e6-789a-bcde-f01234567890',
    'Tropical Paradise',
    'Bright and tropical design for summer events',
    '{"primaryColor": "#f0fdf4", "accentColor": "#16a34a", "fontFamily": "sans-serif", "layout": "tropical"}',
    'other',
    true,
    'https://images.unsplash.com/photo-1527015175922-36a3297687d5?w=400',
    now(),
    now()
  );

-- Note: Since we're using UUIDs, no sequence update is needed
-- The templates above provide a good starting collection for users