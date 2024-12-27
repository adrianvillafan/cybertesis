import React, { useState, useRef } from 'react';
import Wizard from "@cloudscape-design/components/wizard";
import Flashbar from "@cloudscape-design/components/flashbar";
import Credencial from '../uoari/Formpasos/Credencial';
import Datos from '../uoari/Formpasos/Datos';
import Notas from '../uoari/Formpasos/Notas';
import Asesor from '../uoari/Formpasos/Asesor';
import Submission from '../uoari/Formpasos/Submission';
import { i18nConfig } from '../uoari/Formconfig/Wizardconfig';
import uoariService from "../../../../services/uoariService";

// Componente principal para el registro de datos de Cyberthesis
const RegisterCyberthesis = ({ solicitudId, handleBackStep }) => {
  // Estados para manejar la navegación, carga y mensajes
  const [activeStepIndex, setActiveStepIndex] = useState(0); // Índice del paso activo en el wizard
  const [loading, setLoading] = useState(false); // Estado de carga para indicar guardado
  const [flashItems, setFlashItems] = useState([]); // Mensajes de error o éxito
  const [uoariDetails, setUoariDetails] = useState({
    solicitud_id: solicitudId, // ID de la solicitud inicial
    estado: null,
    fecha_publicacion: null,
    editorial: null,
    cita: null,
    identificador: null,
    enlace: null,
    tipo_publicacion: null,
    formato: null,
    idioma: "Español", // Valor predeterminado
    palabra_clave: null,
    conocimiento: null,
    resumen: null,
    patrocinio: null,
    notas: null,
    tipo_investigacion: null,
    nombre_grado: null,
    titulo_profesional: null,
    programa: null,
    codigo_programa: null,
    institucion_otorgante: null,
    codigo_pais: "PE",
    licencia: null, // Valor predeterminado
  });

  // Referencia para la validación del paso actual
  const validateStep = useRef(() => true);

  // Función para actualizar los detalles de Uoari
  const updateUoariDetails = (field, value) => {
    setUoariDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  // Manejo de la navegación entre pasos
  const handleNavigate = ({ detail }) => {
    // Verifica si la validación del paso actual falla al intentar avanzar
    if (detail.requestedStepIndex > activeStepIndex && !validateStep.current()) {
      setFlashItems([
        {
          type: "error", // Tipo de mensaje
          dismissible: true, // Permite cerrar el mensaje
          dismissLabel: "Cerrar mensaje",
          onDismiss: () => setFlashItems([]), // Borra el mensaje al cerrarlo
          content: "Por favor, completa los campos obligatorios antes de continuar.",
          id: "validation_error", // ID único del mensaje
        },
      ]);
      return; // Evita avanzar si la validación falla
    }
    setActiveStepIndex(detail.requestedStepIndex); // Actualiza el paso activo
  };

  // Manejo de la acción de "Guardar datos"
  const handleSubmit = async () => {
    setLoading(true); // Activa el estado de carga
    setFlashItems([]); // Limpia los mensajes previos

    try {
      const response = await uoariService.Insert_Uoari_Datos(uoariDetails); // Inserta los datos en la base
      console.log('Registro insertado exitosamente:', response);

      // Muestra un mensaje de éxito
      setFlashItems([
        {
          type: "success",
          dismissible: true,
          dismissLabel: "Cerrar mensaje",
          onDismiss: () => setFlashItems([]), // Borra el mensaje al cerrarlo
          content: "Datos guardados exitosamente.",
          id: "success_message",
        },
      ]);
    } catch (error) {
      console.error('Error al insertar datos:', error);

      // Muestra un mensaje de error
      setFlashItems([
        {
          type: "error",
          dismissible: true,
          dismissLabel: "Cerrar mensaje",
          onDismiss: () => setFlashItems([]), // Borra el mensaje al cerrarlo
          content: "Hubo un error al guardar los datos. Inténtalo nuevamente.",
          id: "error_message",
        },
      ]);
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  return (
    <div className="form-container">
      {/* Muestra mensajes si hay elementos en el Flashbar */}
      {flashItems.length > 0 && <Flashbar items={flashItems} />}

      <Wizard
        i18nStrings={{
          ...i18nConfig,
          submitButton: loading ? "Guardando..." : "Guardar datos", // Cambia el texto del botón según el estado
        }}
        onNavigate={handleNavigate} // Maneja la navegación entre pasos
        activeStepIndex={activeStepIndex} // Índice del paso activo
        onCancel={handleBackStep} // Maneja la cancelación del formulario
        onSubmit={handleSubmit} // Maneja la acción de "Guardar datos"
        steps={[
          {
            title: "Elección de credenciales", // Título del paso
            content: (
              <Credencial 
                uoariDetails={uoariDetails} // Pasa los detalles actuales
                updateUoariDetails={updateUoariDetails} // Función para actualizar datos
                validateStep={validateStep} // Referencia para la validación
              />), // Componente del contenido
          },
          {
            title: "Información", // Título del paso
            content: (
              <Datos
                uoariDetails={uoariDetails} // Pasa los detalles actuales
                updateUoariDetails={updateUoariDetails} // Función para actualizar datos
                validateStep={validateStep} // Referencia para la validación
              />
            ),
          },
          {
            title: "Notas", // Título del paso
            content: (
              <Notas
                uoariDetails={uoariDetails} // Pasa los detalles actuales
                updateUoariDetails={updateUoariDetails} // Función para actualizar datos
                validateStep={validateStep} // Referencia para la validación
              />
            ),
          },
          {
            title: "Participantes", // Título del paso
            content: (
              <Asesor
                uoariDetails={uoariDetails} // Pasa los detalles actuales
                updateUoariDetails={updateUoariDetails} // Función para actualizar datos
                validateStep={validateStep} // Referencia para la validación
              />
            ),
          },
          {
            title: "Submision_section", // Título del paso
            content: <Submission />, // Componente del contenido
          },
        ]}
      />
    </div>
  );
};

export default RegisterCyberthesis;
