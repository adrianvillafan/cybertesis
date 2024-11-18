// src/components/dashboard/Navigation.jsx

export const navigationItems = (user) => {
  if (!user) return [];

  switch (user.current_team_id) {
    case 1: // Admin
      return [
        { type: 'link', text: 'Gestión de Usuarios', href: '/manage-users' },
      ];
    case 2: // Estudiante
      return [
        { type: 'link', text: 'Mis Solicitudes', href: '/my-requests' },
      ];
    case 3: // Escuela UPG
      return [
        { type: 'link', text: 'Ingresar Documentos', href: '/ingreso-docs' },
        { type: 'link', text: 'Expedientes', href: '/solicitudes' },
        { type: 'link', text: 'Reportes', href: '/reports' },
      ];
    case 4: // RecepDocs
      return [
        { type: 'link', text: 'Expedientes', href: '/expedientes' },
        {
          type: 'expandable-link-group',
          text: 'Reporte',
          href: '#/reporte',  // Agregar una URL para el grupo expandible si es necesario
          items: [
            { type: 'link', text: 'Expediente', href: '/expedient-reports' },
            { type: 'link', text: 'Resultado', href: '/result-reports' },
          ],
        },
      ];
    case 5: // UOARI
      return [
        { type: 'link', text: 'Registrar CYBERTESIS', href: '/register-cyberthesis' },
        { type: 'link', text: 'Mis Reportes', href: '/my-reports' },
      ];
    default:
      return [];
  }
};

export const contentHeader = (activeView) => {
  const headers = {
    'manage-users': 'Gestión de Usuarios',
    'my-requests': 'Mis Solicitudes',
    'ingreso-docs': 'Ingresar Documentos',
    'solicitudes': 'Expedientes',
    'reports': 'Reportes',
    'expedient-reports': 'Reporte de Expedientes',
    'result-reports': 'Reporte de Resultados',
    'register-cyberthesis': 'Registrar CYBERTESIS',
    'my-reports': 'Mis Reportes',
    'inicio': 'Inicio',
  };
  return headers[activeView] || 'Inicio';
};
