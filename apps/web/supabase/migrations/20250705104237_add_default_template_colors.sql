-- Add default color values to existing templates
-- This ensures backward compatibility and provides complete color palettes

-- Update existing templates with comprehensive color palettes
-- Wedding templates
UPDATE invitation_templates 
SET design_config = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            design_config,
            '{backgroundColor}', 
            to_jsonb(COALESCE(design_config->>'backgroundColor', '#fdf2f8'))
          ),
          '{surfaceColor}', 
          to_jsonb(COALESCE(design_config->>'surfaceColor', '#ffffff'))
        ),
        '{textColor}', 
        to_jsonb(COALESCE(design_config->>'textColor', '#1f2937'))
      ),
      '{textSecondaryColor}', 
      to_jsonb(COALESCE(design_config->>'textSecondaryColor', '#6b7280'))
    ),
    '{borderColor}', 
    to_jsonb(COALESCE(design_config->>'borderColor', '#e5e7eb'))
  ),
  '{overlayColor}', 
  to_jsonb(COALESCE(design_config->>'overlayColor', 'rgba(0, 0, 0, 0.5)'))
)
WHERE category = 'wedding';

-- Birthday templates
UPDATE invitation_templates 
SET design_config = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            design_config,
            '{backgroundColor}', 
            to_jsonb(COALESCE(design_config->>'backgroundColor', '#fef3c7'))
          ),
          '{surfaceColor}', 
          to_jsonb(COALESCE(design_config->>'surfaceColor', '#ffffff'))
        ),
        '{textColor}', 
        to_jsonb(COALESCE(design_config->>'textColor', '#1f2937'))
      ),
      '{textSecondaryColor}', 
      to_jsonb(COALESCE(design_config->>'textSecondaryColor', '#6b7280'))
    ),
    '{borderColor}', 
    to_jsonb(COALESCE(design_config->>'borderColor', '#e5e7eb'))
  ),
  '{overlayColor}', 
  to_jsonb(COALESCE(design_config->>'overlayColor', 'rgba(0, 0, 0, 0.5)'))
)
WHERE category = 'birthday';

-- Corporate templates
UPDATE invitation_templates 
SET design_config = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            design_config,
            '{backgroundColor}', 
            to_jsonb(COALESCE(design_config->>'backgroundColor', '#f1f5f9'))
          ),
          '{surfaceColor}', 
          to_jsonb(COALESCE(design_config->>'surfaceColor', '#ffffff'))
        ),
        '{textColor}', 
        to_jsonb(COALESCE(design_config->>'textColor', '#1f2937'))
      ),
      '{textSecondaryColor}', 
      to_jsonb(COALESCE(design_config->>'textSecondaryColor', '#6b7280'))
    ),
    '{borderColor}', 
    to_jsonb(COALESCE(design_config->>'borderColor', '#e5e7eb'))
  ),
  '{overlayColor}', 
  to_jsonb(COALESCE(design_config->>'overlayColor', 'rgba(0, 0, 0, 0.5)'))
)
WHERE category = 'corporate';

-- Anniversary templates
UPDATE invitation_templates 
SET design_config = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            design_config,
            '{backgroundColor}', 
            to_jsonb(COALESCE(design_config->>'backgroundColor', '#fffbeb'))
          ),
          '{surfaceColor}', 
          to_jsonb(COALESCE(design_config->>'surfaceColor', '#ffffff'))
        ),
        '{textColor}', 
        to_jsonb(COALESCE(design_config->>'textColor', '#1f2937'))
      ),
      '{textSecondaryColor}', 
      to_jsonb(COALESCE(design_config->>'textSecondaryColor', '#6b7280'))
    ),
    '{borderColor}', 
    to_jsonb(COALESCE(design_config->>'borderColor', '#e5e7eb'))
  ),
  '{overlayColor}', 
  to_jsonb(COALESCE(design_config->>'overlayColor', 'rgba(0, 0, 0, 0.5)'))
)
WHERE category = 'anniversary';

-- Baby shower templates
UPDATE invitation_templates 
SET design_config = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            design_config,
            '{backgroundColor}', 
            to_jsonb(COALESCE(design_config->>'backgroundColor', '#ecfdf5'))
          ),
          '{surfaceColor}', 
          to_jsonb(COALESCE(design_config->>'surfaceColor', '#ffffff'))
        ),
        '{textColor}', 
        to_jsonb(COALESCE(design_config->>'textColor', '#1f2937'))
      ),
      '{textSecondaryColor}', 
      to_jsonb(COALESCE(design_config->>'textSecondaryColor', '#6b7280'))
    ),
    '{borderColor}', 
    to_jsonb(COALESCE(design_config->>'borderColor', '#e5e7eb'))
  ),
  '{overlayColor}', 
  to_jsonb(COALESCE(design_config->>'overlayColor', 'rgba(0, 0, 0, 0.5)'))
)
WHERE category = 'baby_shower';

-- Graduation templates
UPDATE invitation_templates 
SET design_config = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            design_config,
            '{backgroundColor}', 
            to_jsonb(COALESCE(design_config->>'backgroundColor', '#dbeafe'))
          ),
          '{surfaceColor}', 
          to_jsonb(COALESCE(design_config->>'surfaceColor', '#ffffff'))
        ),
        '{textColor}', 
        to_jsonb(COALESCE(design_config->>'textColor', '#1f2937'))
      ),
      '{textSecondaryColor}', 
      to_jsonb(COALESCE(design_config->>'textSecondaryColor', '#6b7280'))
    ),
    '{borderColor}', 
    to_jsonb(COALESCE(design_config->>'borderColor', '#e5e7eb'))
  ),
  '{overlayColor}', 
  to_jsonb(COALESCE(design_config->>'overlayColor', 'rgba(0, 0, 0, 0.5)'))
)
WHERE category = 'graduation';

-- Holiday templates
UPDATE invitation_templates 
SET design_config = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            design_config,
            '{backgroundColor}', 
            to_jsonb(COALESCE(design_config->>'backgroundColor', '#f0fdf4'))
          ),
          '{surfaceColor}', 
          to_jsonb(COALESCE(design_config->>'surfaceColor', '#ffffff'))
        ),
        '{textColor}', 
        to_jsonb(COALESCE(design_config->>'textColor', '#1f2937'))
      ),
      '{textSecondaryColor}', 
      to_jsonb(COALESCE(design_config->>'textSecondaryColor', '#6b7280'))
    ),
    '{borderColor}', 
    to_jsonb(COALESCE(design_config->>'borderColor', '#e5e7eb'))
  ),
  '{overlayColor}', 
  to_jsonb(COALESCE(design_config->>'overlayColor', 'rgba(0, 0, 0, 0.5)'))
)
WHERE category = 'holiday';

-- Other templates
UPDATE invitation_templates 
SET design_config = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            design_config,
            '{backgroundColor}', 
            to_jsonb(COALESCE(design_config->>'backgroundColor', '#f8fafc'))
          ),
          '{surfaceColor}', 
          to_jsonb(COALESCE(design_config->>'surfaceColor', '#ffffff'))
        ),
        '{textColor}', 
        to_jsonb(COALESCE(design_config->>'textColor', '#1f2937'))
      ),
      '{textSecondaryColor}', 
      to_jsonb(COALESCE(design_config->>'textSecondaryColor', '#6b7280'))
    ),
    '{borderColor}', 
    to_jsonb(COALESCE(design_config->>'borderColor', '#e5e7eb'))
  ),
  '{overlayColor}', 
  to_jsonb(COALESCE(design_config->>'overlayColor', 'rgba(0, 0, 0, 0.5)'))
)
WHERE category = 'other';