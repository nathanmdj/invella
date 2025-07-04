import { Home, User, Plus, Settings } from 'lucide-react';
import { z } from 'zod';

import { NavigationConfigSchema } from '@kit/ui/navigation-schema';

import pathsConfig from '~/config/paths.config';

const iconClasses = 'w-4';

const routes = [
  {
    label: 'common:routes.application',
    children: [
      {
        label: 'Dashboard',
        path: '/home',
        Icon: <Home className={iconClasses} />,
        end: true,
      },
      {
        label: 'Create Invitation',
        path: '/home/create',
        Icon: <Plus className={iconClasses} />,
      },
    ],
  },
  {
    label: 'Admin',
    children: [
      {
        label: 'Template Management',
        path: '/home/admin/templates',
        Icon: <Settings className={iconClasses} />,
      },
    ],
  },
  {
    label: 'common:routes.settings',
    children: [
      {
        label: 'common:routes.profile',
        path: pathsConfig.app.profileSettings,
        Icon: <User className={iconClasses} />,
      },
    ],
  },
] satisfies z.infer<typeof NavigationConfigSchema>['routes'];

export const navigationConfig = NavigationConfigSchema.parse({
  routes,
  style: process.env.NEXT_PUBLIC_NAVIGATION_STYLE,
  sidebarCollapsed: process.env.NEXT_PUBLIC_HOME_SIDEBAR_COLLAPSED,
});
