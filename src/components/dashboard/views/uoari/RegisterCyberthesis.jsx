import React, { useState } from 'react';
import Wizard from "@cloudscape-design/components/wizard";
import Credencial from '../uoari/Formpasos/Credencial';
import Datos from '../uoari/Formpasos/Datos';
import Notas from '../uoari/Formpasos/Notas';
import Asesor from '../uoari/Formpasos/Asesor';
import Submission from '../uoari/Formpasos/Submission';
import { i18nConfig } from '../uoari/Formconfig/Wizardconfig'; // Configuración i18n para el Wizard
import uoariService from "../../../../services/uoariService";

const RegisterCyberthesis = ({ solicitudId, handleBackStep }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0); // Estado para el paso activo del Wizard

  console.log("Esta vista es de RegisterCyberthesis", solicitudId);

  return (
    <div className="form-container">
      <Wizard
        i18nStrings={i18nConfig} // Configuración del idioma y textos
        onNavigate={({ detail }) => setActiveStepIndex(detail.requestedStepIndex)} // Control del cambio de pasos
        activeStepIndex={activeStepIndex} // Paso activo del Wizard
        onCancel={handleBackStep} // Al presionar "Cancelar", ejecuta la función handleBackStep
        steps={[
          {
            title: "Elección de credenciales",
            content: <Credencial />,
          },
          {
            title: "Información",
            content: <Datos />,
          },
          {
            title: "Notas",
            content: <Notas />,
          },
          {
            title: "Participantes",
            content: <Asesor />,
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
