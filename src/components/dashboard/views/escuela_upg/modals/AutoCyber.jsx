import React, { useState } from 'react';
import { Modal, FileUpload, Button, Box } from '@cloudscape-design/components';

const AutoCyberModal = ({ onClose }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = ({ detail }) => {
        const selectedFile = detail.value[0];
        setFile(selectedFile);
    };

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = () => {
        // Lógica para guardar el archivo
        onClose();
    };

    return (
        <Modal
            onDismiss={handleClose}
            visible={true}
            closeAriaLabel="Cerrar modal"
            header="AutoCyber"
            footer={
                <Box float='right'>
                    <Button onClick={handleClose} variant="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={!file} style={{ marginLeft: '8px' }}>
                        Guardar
                    </Button>
                </Box>
            }
        >
            <FileUpload
                value={file ? [file] : []}
                onChange={handleFileChange}
                errorText="Debe seleccionar un archivo"
                constraintText="Suba un archivo válido"
                i18nStrings={{
                    dropzoneText: (multiple) => "Debe contener toda la información solicitada de manera obligatoria y la firma del autor, la cual debe estar en fondo blanco. El formato puede ser llenado de forma digitada o manuscrita con letra imprenta.",
                    uploadButtonText: (multiple) => 'Seleccionar archivo',
                    removeFileAriaLabel: (fileIndex) => `Eliminar archivo ${fileIndex}`,
                    limitShowFewer: 'Mostrar menos',
                    limitShowMore: 'Mostrar más',
                }}
            />
            {file && (
                <iframe src={URL.createObjectURL(file)} title="Visualizador de PDF" width="100%" height="600px" />
            )}
        </Modal>
    );
};

export default AutoCyberModal;
