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

const RegisterCyberthesis = ({ solicitudId, handleBackStep }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [flashItems, setFlashItems] = useState([]);
  const [uoariDetails, setUoariDetails] = useState({
    solicitud_id: solicitudId,
    estado: null,
    fecha_publicacion: null,
    editorial: null,
    cita: null,
    identificador: null,
    enlace: null,
    tipo_publicacion: null,
    formato: null,
    idioma: "Español",
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
  });

  const validateStep = useRef(() => true); // Referencia para la validación del paso actual

  const updateUoariDetails = (field, value) => {
    setUoariDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleNavigate = ({ detail }) => {
    if (detail.requestedStepIndex > activeStepIndex && !validateStep.current()) {
      setFlashItems([
        {
          type: "error",
          dismissible: true,
          dismissLabel: "Cerrar mensaje",
          onDismiss: () => setFlashItems([]),
          content: "Por favor, completa los campos obligatorios antes de continuar.",
          id: "validation_error",
        },
      ]);
      return; // Evitar avanzar si la validación falla
    }
    setActiveStepIndex(detail.requestedStepIndex);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setFlashItems([]); // Limpiar mensajes previos

    try {
      const response = await uoariService.Insert_Uoari_Datos(uoariDetails);
      console.log('Registro insertado exitosamente:', response);

      // Agregar mensaje de éxito
      setFlashItems([
        {
          type: "success",
          dismissible: true,
          dismissLabel: "Cerrar mensaje",
          onDismiss: () => setFlashItems([]), // Ocultar mensaje al cerrar
          content: "Datos guardados exitosamente.",
          id: "success_message",
        },
      ]);
    } catch (error) {
      console.error('Error al insertar datos:', error);

      // Agregar mensaje de error
      setFlashItems([
        {
          type: "error",
          dismissible: true,
          dismissLabel: "Cerrar mensaje",
          onDismiss: () => setFlashItems([]), // Ocultar mensaje al cerrar
          content: "Hubo un error al guardar los datos. Inténtalo nuevamente.",
          id: "error_message",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      {/* Mostrar Flashbar si hay mensajes */}
      {flashItems.length > 0 && <Flashbar items={flashItems} />}

      <Wizard
        i18nStrings={{
          ...i18nConfig,
          submitButton: loading ? "Guardando..." : "Guardar datos",
        }}
        onNavigate={handleNavigate}
        activeStepIndex={activeStepIndex}
        onCancel={handleBackStep}
        onSubmit={handleSubmit}
        steps={[
          {
            title: "Elección de credenciales",
            content: <Credencial />,
          },
          {
            title: "Información",
            content: (
              <Datos
                uoariDetails={uoariDetails}
                updateUoariDetails={updateUoariDetails}
                validateStep={validateStep}
              />
            ),
          },
          {
            title: "Notas",
            content: (
              <Notas
                uoariDetails={uoariDetails}
                updateUoariDetails={updateUoariDetails}
                validateStep={validateStep}
              />
            ),
          },
          {
            title: "Participantes",
            content: (
              <Asesor
                uoariDetails={uoariDetails}
                updateUoariDetails={updateUoariDetails}
                validateStep={validateStep}
              />
            ),
          },
          {
            title: "Submision_section",
            content: <Submission />,
          },
        ]}
      />
    </div>
  );
};

export default RegisterCyberthesis;
