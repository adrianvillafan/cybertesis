// En /src/components/dashboard/views/uoari/RegisterCyberthesis.jsx
import React from 'react';
import FormTesis from './Formtesis/Formtesis';

const RegisterCyberthesis = ({solicitudId , handleBackStep}) => {

  console.log("esta vista es de RegisterCyberthesis",solicitudId)
  return (
    <div className="form-container">
      <FormTesis/>
    </div>
  );
};

export default RegisterCyberthesis;
