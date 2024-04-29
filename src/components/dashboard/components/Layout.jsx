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

const LOCALE = 'es';

const Layout = ({ breadcrumbs, navigationItems, contentHeader, children, onNavigation, onLogoutClick }) => {


  const updatedNavigationItems = [
    { type: "link",text: <a onClick={() => onNavigation('inicio')}>Inicio</a>, href: '#inicio' },
    { type: "link", text: <a onClick={() => onNavigation('notifications')}>Notificaciones</a>, href: '#notificacion', info: <Badge color="red">23</Badge> },
    ...navigationItems, // Opciones específicas del usuario
    { type: "link", text: <a onClick={onLogoutClick}>Cerrar Sesión</a>, href: '#' } // Botón de Cerrar Sesión al final
  ];

  const [activeHref, setActiveHref] = React.useState(
    "/"
  );

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <AppLayout
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
          <ContentLayout header={<Header variant="h1">{contentHeader}</Header>}>
              {children}
          </ContentLayout>
        }
      />
    </I18nProvider>
  );
};

export default Layout;
