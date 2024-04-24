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

const Layout = ({ breadcrumbs, navigationItems, contentHeader, children, onNavigation }) => {


  const updatedNavigationItems = [
    { type: "link",text: 'Inicio', href: '#' },
    { type: "link",text: 'Notificaciones', href: '#notifications', info: <Badge color="red">23</Badge> },
    ...navigationItems, // Opciones específicas del usuario
    { type: "link",text: 'Cerrar Sesión', href: '#logout' } // Botón de Cerrar Sesión al final
  ];

  console.log(updatedNavigationItems);
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
            items={updatedNavigationItems.map(item => ({
              ...item,
              onClick: () => onNavigation(item.href)}))}
            
          />
        }
        content={
          <ContentLayout header={contentHeader}>
            <Container header={<Header variant="h2">Container header</Header>}>
              {children}
            </Container>
          </ContentLayout>
        }
      />
    </I18nProvider>
  );
};

export default Layout;
