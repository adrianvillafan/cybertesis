import { useContext } from 'react';
import UserContext from '../contexts/UserContext';
import { Container } from '@cloudscape-design/components';
const Inicio = () => {
  const { user } = useContext(UserContext);
  return (
    <Container>
      <h1>Perfil de usuario</h1>
      <p>Nombre: {user.nombre_usuario}</p>
      <p>Correo electrónico: {user.email}</p>
    </Container>
  );
};

export default Inicio;