import React from 'react';
import {
  AppLayout,
  BreadcrumbGroup,
  Container,
  ContentLayout,
  Header,
  Link,
  SideNavigation,
  Badge
} from '@cloudscape-design/components';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.es';
import { applyTheme } from '@cloudscape-design/components/theming';
import theme from './theme.js';

const LOCALE = 'es';

const Layout = ({ breadcrumbs, navigationItems, contentHeader, children, onNavigation, onLogoutClick }) => {
  const [activeHref, setActiveHref] = React.useState("/");
  
  // Aplicar el tema
  React.useEffect(() => {
    const { reset } = applyTheme({ theme });
    return () => {
      reset();
    };
  }, []);
  
  const updatedNavigationItems = [
    { type: "link", text: <a onClick={() => onNavigation('inicio')}>Inicio</a>, href: '#inicio' },
    { type: "link", text: <a onClick={() => onNavigation('notifications')}>Notificaciones</a>, href: '#notificacion', info: <Badge color="red">23</Badge> },
    ...navigationItems, // Opciones específicas del usuario
    { type: "link", text: <a onClick={onLogoutClick}>Cerrar Sesión</a>, href: '#' } // Botón de Cerrar Sesión al final
  ];

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <AppLayout
        headerVariant="high-contrast"
        toolsHide={true}
        breadcrumbs={
          <BreadcrumbGroup
            items={breadcrumbs}
          />
        }
        navigation={
          <SideNavigation
            activeHref={activeHref}
            header={{
              href: '#', 
              text: 'Service name',
            }}
            items={updatedNavigationItems}
          />
        }
        content={
          <ContentLayout
            headerVariant="high-contrast"
            header={<Header variant="h1">{contentHeader}</Header>}>
              {children}
          </ContentLayout>
        }
      />
    </I18nProvider>
  );
};

export default Layout;
