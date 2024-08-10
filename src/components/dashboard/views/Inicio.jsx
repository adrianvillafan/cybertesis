import { useContext, useState, useEffect } from 'react';
import UserContext from '../contexts/UserContext';
import { Container, ColumnLayout, Box, SpaceBetween } from '@cloudscape-design/components';

const Inicio = () => {
  const { user } = useContext(UserContext);
  const [imageError, setImageError] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleImageError = () => {
    setImageError(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Limpia el intervalo cuando el componente se desmonte
  }, []);

  return (
    <Container>
      <ColumnLayout columns={3} variant="text-grid">
        <SpaceBetween direction="vertical" size="s">
          <Container>
            <Box>
              <Box variant="h1">{user.name}</Box>
              <img
                src={
                  imageError
                    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/640px-User_icon_2.svg.png"
                    : user.foto || `https://sisbib.unmsm.edu.pe/fotos/3/${user.identificacion_id}.jpg`
                }
                alt="User Photo"
                style={{ width: '70%', margin: '30px 0 0 0', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}
                onError={handleImageError}
              />
              <Box>
                <p><strong>Tipo:</strong> {user.guard_name}</p>
                <p><strong>Facultad:</strong> {user.nombre_facultad}</p>
                <p><strong>Categoria:</strong> {user.nombre_grado}</p>
                <p><strong>Correo electrónico:</strong> {user.email}</p>
                <p><strong>Correo electrónico:</strong> {user.email}</p>
              </Box>
            </Box>
          </Container>
          <Container header={<Box variant="h3">Contactos de Soporte</Box>}>
            <p><strong>Soporte Técnico:</strong> soporte@unmsm.edu.pe</p>
            <p><strong>Teléfono:</strong> +51 912102577</p>
            <p><strong>Horario de Atención:</strong> Lun - Vie, 9:00 AM - 5:00 PM</p>
          </Container>
        </SpaceBetween>
        <SpaceBetween direction="vertical" size="s">
          <Container header={<Box variant="h2">Presentación de Plataforma</Box>}>
            <p>En la era digital, la eficiencia y la organización son clave para el éxito académico. Nuestra plataforma de gestión académica ha sido diseñada pensando en tus necesidades, brindándote herramientas innovadoras y fáciles de usar para gestionar todas tus actividades educativas de manera eficaz.</p>

            <h3>¿Qué Ofrecemos?</h3>
            <ul>
              <li><strong>Gestión Integral de Tesis y Documentación:</strong> Facilita el envío, recepción y seguimiento de tesis y trabajos de investigación, asegurando que todos los documentos necesarios estén organizados y accesibles.</li>
              <li><strong>Recursos Descargables:</strong> Accede a una amplia gama de guías, formatos y ejemplos que te ayudarán en cada paso de tu proceso académico. Desde la creación de perfiles ORCID hasta certificados de similitud, tenemos todo lo que necesitas.</li>
            </ul>
          </Container>
          <Container
            header={<Box variant="p"><strong>Dr. José Segundo Niño Montero</strong> | Vicerrector de Investigación y Posgrado</Box>}
            media={{
              content: (
                <img
                  src="https://unmsm.edu.pe/img/universidad/autoridades/dr-jose-ni%C3%B1o-montero-vicerrectorado-investigacion-posgrado-unmsm.png"
                  alt="Vicerrectorado de Investigación y Posgrado"
                />
              ),
              position: "side",
              width: "33%"
            }}
          >
            <Box variant="p">Médico cirujano, especialista en Oftalmología y Glaucoma. Magíster y doctor en Medicina, con estudios en Gestión Pública. Más de 30 publicaciones académicas y más de 25 años de experiencia como médico oftalmólogo</Box>
          </Container>
        </SpaceBetween>

        <SpaceBetween direction="vertical" size="s">

          {/* Sección de Fecha y Hora */}
          <Container header={<Box variant="h2">Fecha y Hora</Box>}>
            <p><strong>Fecha Actual:</strong> {currentTime.toLocaleDateString()}</p>
            <p><strong>Hora Actual:</strong> {currentTime.toLocaleTimeString()}</p>
            <p>Es importante estar al tanto de las fechas y horas para cumplir con todos los plazos establecidos en tu proceso académico.</p>
          </Container>

          {/* Sección de Preguntas Frecuentes */}
          <Container header={<Box variant="h2">Preguntas Frecuentes</Box>}>
            <Box variant="h4">¿Cómo puedo cargar mis documentos?</Box>
            <Box variant="p">Para cargar tus documentos, dirígete a la sección "Ingresar Documentos" en el menú de la izquierda y sigue las instrucciones.</Box>

            <Box variant="h4">¿Dónde puedo revisar el estado de mi tesis?</Box>
            <Box variant="p">Puedes revisar el estado de tu tesis en la sección "Solicitudes" en el menú de la izquierda. Ahí verás el progreso y el estado actual de tu solicitud.</Box>

            <Box variant="h4">¿A quién puedo contactar si tengo problemas?</Box>
            <Box variant="p">Si experimentas algún problema, por favor contacta al soporte técnico a través de soporte@unmsm.edu.pe.</Box>

            <Box variant="h4">¿Cómo solicito una prórroga para la entrega de mi tesis?</Box>
            <Box variant="p">Para solicitar una prórroga, debes dirigirte a la sección "Solicitudes" en el menú y elegir la opción "Solicitar Prórroga". Asegúrate de cumplir con los requisitos antes de enviar tu solicitud.</Box>
          </Container>
        </SpaceBetween>
      </ColumnLayout>
    </Container>
  );
};

export default Inicio;
