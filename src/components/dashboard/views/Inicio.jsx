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
          <Container header={<Box variant="h2">Sección Adicional 1</Box>}>
            <p>Contenido de la sección adicional 1</p>
          </Container>
          <Container header={<Box variant="h2">Sección Adicional 2</Box>}>
            <p>Contenido de la sección adicional 2</p>
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
