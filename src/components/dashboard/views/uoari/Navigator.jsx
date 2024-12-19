import React, { useEffect, useState } from 'react';
import MyReports from "./MyReports"
import RegisterCyberthesis from "./RegisterCyberthesis"



const Navigator = () => {
    const [step, setStep] = useState(1);
    const [solicitudId , setSolicitudId] = useState(null)

    const handleNextStep = (id) => {
        setStep(2);
        setSolicitudId(id);
    };

    const handleBackStep = () => setStep(1);


    return(
        <div>

        {step === 1 && <MyReports handleNextStep={handleNextStep} />}

        {step === 2 && <RegisterCyberthesis handleBackStep={handleBackStep} solicitudId={solicitudId}/>}

        </div>
    );
    
};
export default Navigator