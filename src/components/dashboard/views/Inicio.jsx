import { useContext, useState } from 'react';
import UserContext from '../contexts/UserContext';
import { Container, ColumnLayout, Box, SpaceBetween } from '@cloudscape-design/components';

const Inicio = () => {
  const { user } = useContext(UserContext);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Container>
      <ColumnLayout columns={3} variant="text-grid">
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
              <p><strong>Correo electrónico:</strong> {user.email}</p>
              <p><strong>Correo electrónico:</strong> {user.email}</p>
              <p><strong>Correo electrónico:</strong> {user.email}</p>
            </Box>
          </Box>
        </Container>
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
            //header={<Box variant="h2">Gestión</Box>}
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
            <p><strong>Dr. José Segundo Niño Montero</strong> | Vicerrector de Investigación y Posgrado</p>
            <p>Médico cirujano, especialista en Oftalmología y Glaucoma.</p>
            <p>Magíster y doctor en Medicina, con estudios en Gestión Pública. Más de 30 publicaciones académicas y más de 25 años de experiencia como médico oftalmólogo</p>

          </Container>
        </SpaceBetween>
        <SpaceBetween direction="vertical" size="s">
          <Container header={<Box variant="h2">Sección Adicional 3</Box>}>
            <p>Contenido de la sección adicional 3</p>
          </Container>
          <Container header={<Box variant="h2">Sección Adicional 4</Box>}>
            <p>Contenido de la sección adicional 4</p>
          </Container>
        </SpaceBetween>
      </ColumnLayout>
    </Container>
  );
};

export default Inicio;
