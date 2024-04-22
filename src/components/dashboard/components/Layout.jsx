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
import { handleLogout } from '../../../../api'; // Importa la función handleLogout

const LOCALE = 'es';

const Layout = ({ breadcrumbs, navigationItems, contentHeader, children }) => {

  const handleNavigation = (e, href) => {
    e.preventDefault();
    if (href === '#logout') {
      handleLogout();}}

  const updatedNavigationItems = [
    { type: "link",text: 'Inicio', href: '/' },
    { type: "link",text: 'Notificaciones', href: '/notifications', info: <Badge color="red">23</Badge> },
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
        breadcrumbs={breadcrumbs}
        navigation={
          <SideNavigation
            activeHref={activeHref}
            header={{
              href: '#',
              text: 'Service name',
            }}
            onFollow={event => {
              if (!event.detail.external) {
                event.preventDefault();
                setActiveHref(event.detail.href);
              }
            }}
            items={updatedNavigationItems.map(item => ({
              ...item,
              onClick: (e) => handleNavigation(e, item.href)
            }))}
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
