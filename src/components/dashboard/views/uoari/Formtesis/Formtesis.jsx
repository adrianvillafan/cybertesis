// src/componentes/Formtesis.js
import React from 'react';
import Wizard from "@cloudscape-design/components/wizard";
import { i18nConfig } from '../Formconfig/Wizardconfig';
import Credencial from '../Formpasos/Credencial';
import Datos from '../Formpasos/Datos';
import Notas from '../Formpasos/Notas';
import Asesor from '../Formpasos/Asesor';
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
}

// eslint-disable-next-line import/no-anonymous-default-export
export default FormTesis;
