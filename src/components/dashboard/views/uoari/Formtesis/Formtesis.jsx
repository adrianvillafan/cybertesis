// src/componentes/Formtesis.js
import React from 'react';
import Wizard from "@cloudscape-design/components/wizard";
import { i18nConfig } from '../Formconfig/Wizardconfig';
import Credencial from '../Formpasos/Credencial';
import Datos from '../Formpasos/Datos';
import Notas from '../Formpasos/Notas';
import Acesor from '../Formpasos/Asesor';
import Submission from '../Formpasos/Submission';

// Declaración de la función nombrada
function FormTesis() {
  const [activeStepIndex, setActiveStepIndex] = React.useState(0);

  return (
    <div >
      <Wizard
        i18nStrings={i18nConfig}
        onNavigate={({ detail }) => setActiveStepIndex(detail.requestedStepIndex)}
        activeStepIndex={activeStepIndex}
        steps={[
          {
            title: "Elección de credenciales",
            content: <Credencial />,
          },
          {
            title: "Información tesista",
            content: <Datos />, // <div className="custom-form-container"><Datos /></div>
            isOptional: true,
          },
          {
            title: "Notas",
            content: <Notas />,
            isOptional: true,
          },
          {
            title: "Asesor",
            content: <Acesor />,
            isOptional: true,
          },
          {
            title: "Submision_section",
            content: <Submission />,
            isOptional: true,
          },
        ]}
      />
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default FormTesis;
