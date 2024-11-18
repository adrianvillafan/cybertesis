//src/components/dashboard/views/Inicio.jsx

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
                    : (() => {
                      switch (user.current_team_id) {
                        case 2:
                          return `https://sisbib.unmsm.edu.pe/fotos/3/${user.identificacion_id}.jpg`;
                        case 3:
                          return "https://luiscavibotsample.s3-sa-east-1.amazonaws.com/assets/estudiarensm/facultades/sistemas.webp";
                        case 4:
                          return "http://websecgen.unmsm.edu.pe/carne/imagenes-UNMSM/2/401/0010021027266.jpg";
                        default:
                          return "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/640px-User_icon_2.svg.png";
                      }
                    })()
                }
                alt="User Photo"
                style={{
                  width: '150px', // Ancho fijo para la imagen, similar al tamaño carnet
                  height: '200px', // Alto fijo para la imagen, similar al tamaño carnet
                  margin: '30px auto', // Margen arriba y centrado horizontalmente
                  display: 'block', // Asegura que esté centrado
                  objectFit: 'cover', // Recorta la imagen para llenar el contenedor sin distorsión
                  borderRadius: '5px', // Opcional: bordes redondeados
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Sombra opcional para mejorar el estilo
                }}
                onError={handleImageError}
              />


              <Box>

                
                <p><strong>Categoria:</strong> {user.nombre_grado}</p>
                <p><strong>Correo electrónico:</strong> {user.email}</p>
                {
                  user.current_team_id === 2 && (
                    <>
                      <p><strong>Código Estudiante:</strong> {user.codigo_estudiante}</p>
                      {user.grado_academico_id === 1 ? (
                        <div>
                        <p><strong>Escuela:</strong> {user.nombre_escuela}</p>
                        <p><strong>Facultad:</strong> {user.nombre_facultad}</p>
                        </div>
                      ) : (
                        <p><strong>Programa:</strong> {user.nombre_programa}</p>
                      )}
                      <p><strong>Fecha de Registro:</strong> {new Date(user.fecha_registro).toLocaleDateString()}</p>
                    </>
                  )
                }
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

          

          {/* Sección de Preguntas Frecuentes */}
          <Container header={<Box variant="h2">Preguntas Frecuentes</Box>}>
            {user.current_team_id === 2 ? (
              <>
                <Box variant="h4">¿Dónde puedo revisar el estado de mi tesis?</Box>
                <Box variant="p">Puedes revisar el estado de tu tesis en la sección "Solicitudes" en el menú de la izquierda. Ahí verás el progreso y el estado actual de tu solicitud.</Box>

                <Box variant="h4">¿Cómo solicito una prórroga para la entrega de mi tesis?</Box>
                <Box variant="p">Para solicitar una prórroga, debes dirigirte a la sección "Mis Solicitudes" en el menú y elegir la opción "Solicitar Prórroga". Asegúrate de cumplir con los requisitos antes de enviar tu solicitud.</Box>

                <Box variant="h4">¿Qué debo tener en cuenta al revisar mis documentos?</Box>
                <Box variant="p">Asegúrate de que todos tus documentos estén completos y correctos antes de enviarlos. Puedes revisarlos en la sección "Solicitudes" para evitar errores.</Box>

                <Box variant="h4">¿Cómo realizo una solicitud?</Box>
                <Box variant="p">Para realizar una solicitud, ve a la sección "Realizar Solicitud" en el menú principal y sigue las instrucciones para completar el proceso.</Box>

                <Box variant="h4">Visita nuestro GPT - Turnitin</Box>
                <Box variant="p">Puedes ver las las directivas del VRIP relacionadas a Turnitin en el sigueinte enlace: <br /> <a style={{ color: 'blue' }} target='_blank' href='https://chatgpt.com/g/g-xFXk0r2Cq-turnitin-vrip-unmsm'>Turnitin VRIP UNMSM</a>.</Box>

              </>
            ) : (
              <>
                <Box variant="h4">¿Cómo gestionar las solicitudes de los estudiantes?</Box>
                <Box variant="p">Las solicitudes de los estudiantes se pueden gestionar en la sección correspondiente del panel de control. Asegúrate de revisar todas las solicitudes pendientes regularmente.</Box>

                <Box variant="h4">¿Cómo puedo actualizar la información de la escuela o UPG?</Box>
                <Box variant="p">Para actualizar la información, dirígete a la sección de "Configuración" y selecciona la opción "Actualizar Información de Escuela/UPG".</Box>

                <Box variant="h4">¿Dónde puedo ver las estadísticas de los estudiantes?</Box>
                <Box variant="p">Puedes ver las estadísticas en el apartado de "Reportes", donde encontrarás información detallada sobre el rendimiento académico y otros indicadores clave.</Box>

                <Box variant="h4">Visita nuestro GPT - Turnitin</Box>
                <Box variant="p">Puedes ver las las directivas del VRIP relacionadas a Turnitin en el sigueinte enlace: <br /> <a style={{ color: 'blue' }} target='_blank' href='https://chatgpt.com/g/g-xFXk0r2Cq-turnitin-vrip-unmsm'>Turnitin VRIP UNMSM</a>.</Box>
              </>
            )}
          </Container>

          {/* Sección de Fecha y Hora */}
          <Container>
            <p><strong>Fecha Actual:</strong> {currentTime.toLocaleDateString()}</p>
            <p><strong>Hora Actual:</strong> {currentTime.toLocaleTimeString()}</p>
            <p>Es importante estar al tanto de las fechas y horas para cumplir con todos los plazos establecidos en tu proceso académico.</p>
          </Container>
        </SpaceBetween>
      </ColumnLayout>
    </Container>
  );
};

export default Inicio;
