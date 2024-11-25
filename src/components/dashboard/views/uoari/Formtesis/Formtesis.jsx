// src/componentes/Formtesis.js
import React from 'react';
import Wizard from "@cloudscape-design/components/wizard";
import { i18nConfig } from '../Formconfig/Wizardconfig';
import Credencial from '../Formpasos/Credencial';
import Datos from '../Formpasos/Datos';
import Extra from '../Formpasos/Extra';

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
            title: "Pasos adicionales",
            content: <Extra />,
            isOptional: true,
          },
        ]}
      />
    </div>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default FormTesis;
