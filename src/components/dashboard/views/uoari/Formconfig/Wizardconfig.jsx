// src/Formconfig/Wizardconfig.jsx
export const i18nConfig = {
    stepNumberLabel: stepNumber => `Paso ${stepNumber}`,
    collapsedStepsLabel: (stepNumber, stepsCount) => `Paso ${stepNumber} de ${stepsCount}`,
    skipToButtonLabel: (step, stepNumber) => `Saltar a ${step.title}`,
    navigationAriaLabel: "Pasos",
    cancelButton: "Cancelar",
    previousButton: "Anterior",
    nextButton: "Siguiente",
    submitButton: "Lanzar instancia",
  };