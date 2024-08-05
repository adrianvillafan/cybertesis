import React, { useContext } from 'react';
import {
  AppLayout,
  BreadcrumbGroup,
  ContentLayout,
  Header,
  SideNavigation,
  Badge
} from '@cloudscape-design/components';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.es';
import UserContext from '../contexts/UserContext';
import TopBar from './TopBar'; // Importar el nuevo componente

const LOCALE = 'es';

const Layout = ({ breadcrumbs, navigationItems, contentHeader, children, onNavigation, onLogoutClick }) => {
  const [activeHref, setActiveHref] = React.useState("/");
  const { user } = useContext(UserContext);

  console.log('User:', user);
  
  const updatedNavigationItems = [
    { type: "link", text: <a onClick={() => onNavigation('inicio')}>Inicio</a>, href: '#inicio' },
    { type: "link", text: <a onClick={() => onNavigation('notifications')}>Notificaciones</a>, href: '#notificacion', info: <Badge color="red">23</Badge> },
    ...navigationItems, // Opciones específicas del usuario
    { type: "link", text: <a onClick={onLogoutClick}>Cerrar Sesión</a>, href: '#' } // Botón de Cerrar Sesión al final
  ];

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <div>
        <TopBar /> {/* Agregar el componente de la barra superior */}
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
                text: (
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      {user.guard_name}
                    </div>
                    <div style={{ fontWeight: 'lighter', fontSize: '12px' }}>
                      {user.name}
                    </div>
                  </div>
                ),
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
      </div>
    </I18nProvider>
  );
};

export default Layout;
