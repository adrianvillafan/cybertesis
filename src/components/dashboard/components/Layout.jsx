import React, { useContext } from 'react';
import {
  AppLayout,
  BreadcrumbGroup,
  ContentLayout,
  Header,
  SideNavigation,
  Badge,
  Icon,
  TopNavigation
} from '@cloudscape-design/components';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.es';
import UserContext from '../contexts/UserContext';

const LOCALE = 'es';

const Layout = ({ breadcrumbs, navigationItems, contentHeader, children, onNavigation, onLogoutClick }) => {
  const [activeHref, setActiveHref] = React.useState("/");
  const { user } = useContext(UserContext);

  console.log('User:', user);
  
  const updatedNavigationItems = [
    { type: "link", text: <a onClick={() => onNavigation('inicio')}> <Icon name="user-profile" /> Inicio</a>, href: '#inicio' },
    ...navigationItems, // Opciones específicas del usuario
    { type: "divider" },
    { type: "link", text: <a onClick={() => onNavigation('notifications')}> <Icon name="notification" />  Notificaciones</a>, href: '#notificacion', info: <Badge color="red">23</Badge> },
    { type: "link", text: <a onClick={onLogoutClick}> <Icon name="redo" /> Cerrar Sesión</a>, href: '#' } // Botón de Cerrar Sesión al final
  ];

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <div>
        <TopNavigation
          identity={{
            href: "#",
            title: "Recepción de Documentos de Grados y Títulos en CYBERTESIS",
            logo: {
              src: "src/components/dashboard/components/logo-pa-vrip1.png",  // Actualiza con la ruta correcta del logo
              alt: "VRIP Logo"
            }
          }}
          utilities={[
            {
              type: "menu-dropdown",
              text: user.name,
              description: user.email,
              iconName: "user-profile",
              items: [
                { id: "profile", text: "Profile" },
                { id: "preferences", text: "Preferences" },
                { id: "security", text: "Security" },
                {
                  id: "support-group",
                  text: "Support",
                  items: [
                    {
                      id: "documentation",
                      text: "Documentation",
                      href: "#",
                      external: true,
                      externalIconAriaLabel:
                        " (opens in new tab)"
                    },
                    { id: "support", text: "Support" },
                    {
                      id: "feedback",
                      text: "Feedback",
                      href: "#",
                      external: true,
                      externalIconAriaLabel:
                        " (opens in new tab)"
                    }
                  ]
                },
                { id: "signout", text: "Sign out", onClick: onLogoutClick }
              ]
            }
          ]}
        />
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
              onFollow={event => {
                if (!event.detail.external) {
                  event.preventDefault();
                  setActiveHref(event.detail.href);
                }
              }}
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
