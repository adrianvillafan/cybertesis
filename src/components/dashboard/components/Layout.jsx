import React, { useContext } from 'react';
import {
  AppLayout,
  BreadcrumbGroup,
  ContentLayout,
  Header,
  SideNavigation,
  Badge,
  Icon,
  TopNavigation,
  Box,
} from '@cloudscape-design/components';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.es';
import UserContext from '../contexts/UserContext';
import Notificaciones from './Notificaciones'; 


const LOCALE = 'es';

const Layout = ({ navigationItems, contentHeader, children, onNavigation, onLogoutClick }) => {
  const [activeHref, setActiveHref] = React.useState("/");
  const { user } = useContext(UserContext);

  const updatedNavigationItems = [
    {
      type: "link",
      text: (
        <Box
          onClick={() => onNavigation('inicio')}
          display="flex"
          alignItems="center"
          cursor="pointer"
        >
          <Icon name="user-profile" /> Inicio
        </Box>
      ),
      href: '#inicio'
    },
    ...navigationItems,
    { type: "divider" },
    {
      type: "link",
      text: (
        <Box
          onClick={() => onNavigation('notifications')}
          display="flex"
          alignItems="center"
          cursor="pointer"
        >
          <Icon name="notification" /> Notificaciones <Badge color="red">23</Badge>
        </Box>
      ),
      href: '#notificacion'
    }
  ];

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <div>
        <TopNavigation
          identity={{
            href: "#",
            title: "Recepción de Documentos de Grados y Títulos en CYBERTESIS",
            logo: {
              src: "src/components/dashboard/components/logo-pa-vrip1.png",  
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
                { id: "profile", text: "Configuración" },
                { id: "preferences", text: "Privacidad y Seguridad" },
                {
                  id: "support-group",
                  text: "Ayuda y Soporte",
                  items: [
                    {
                      id: "documentation",
                      text: "Reportar Problema",
                      href: "#",
                      external: true,
                      externalIconAriaLabel: " (opens in new tab)"
                    },
                    {
                      id: "feedback",
                      text: "Términos Políticos",
                      href: "#",
                      external: true,
                      externalIconAriaLabel: " (opens in new tab)"
                    }
                  ]
                },
                { id: "signout", text: <a onClick={onLogoutClick}> <Icon name="redo" /> Cerrar Sesión</a> }
              ]
            }
          ]}
        />
        <AppLayout
          headerVariant="high-contrast"
          toolsHide={true}
          breadcrumbs={<BreadcrumbGroup />}
          navigation={
            <div>
              <SideNavigation
                activeHref={activeHref}
                header={{
                  href: '#', 
                  text: (
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{user.guard_name}</div>
                      <div style={{ fontWeight: 'lighter', fontSize: '12px' }}>{user.name}</div>
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

              <Notificaciones/>
 
                <div style={{
                  height: '1px',              
                  backgroundColor: '#ccc',    
                  width: '88%',                
                  margin: '10px auto',        
                }} />
              
                <Box padding={{ vertical: 's', horizontal: 'l' }} display="flex" alignItems="center">
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      onLogoutClick(); 
                    }}
                    className="awsui_link awsui_link_size-small awsui_link_variant-normal" 
                      style={{
                        textDecoration: 'none',        
                        color: '#424650',              
                        display: 'flex',               
                        alignItems: 'center',          
                        cursor: 'pointer',             
                        width: 'fit-content',          
                        padding: '5px',               
                        transition: 'color 0.3s ease', 
                      }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = '#0073e6'; 
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = '#424650'; 
                    }}
                  >
                    <Icon 
                      name="redo" 
                      style={{
                        fill: '#424650', 
                        transition: 'fill 0.3s ease' 
                      }} 
                    />
                    <span style={{ marginLeft: '8px' }}>Cerrar Sesión</span>
                  </a>
                </Box>               
              </div>
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
