import React, { useState } from 'react';
import { Modal, FileUpload, Button, Box } from '@cloudscape-design/components';

const RepTurnitinModal = ({ onClose }) => {
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);

    const handleFileChange = ({ detail }) => {
        const selectedFile = detail.value[0];
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileContent = event.target.result;
                localStorage.setItem('uploadedFile', fileContent);
                setFileUrl(fileContent);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = () => {
        // Lógica para guardar los datos y archivos en el caché
        localStorage.removeItem('uploadedFile');
        onClose();
    };

    const handleClose = () => {
        localStorage.removeItem('uploadedFile');
        setFile(null);
        onClose();
    };

    return (
        <Modal
            onDismiss={handleClose}
            visible={true}
            closeAriaLabel="Cerrar modal"
            header="Subir Reporte de Turnitin"
            footer={
                <Box float='right'>
                    <Button onClick={handleClose} variant="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={!file} style={{ marginLeft: '8px' }}>
                        Guardar
                    </Button>
                </Box>}
        >
            <FileUpload
                value={file ? [file] : []}
                onChange={handleFileChange}
                errorText="Debe seleccionar un archivo"
                constraintText="Suba un archivo válido"
                i18nStrings={{
                    dropzoneText: (multiple) => "Debe seleccionar un archivo PDF",
                    uploadButtonText: (multiple) => 'Seleccionar archivo',
                    removeFileAriaLabel: (fileIndex) => `Eliminar archivo ${fileIndex}`,
                    limitShowFewer: 'Mostrar menos',
                    limitShowMore: 'Mostrar más',
                }}
            />
            {fileUrl && (
                <Box marginY="m">
                    <iframe src={fileUrl} width="100%" height="600px" title="Visualizador de PDF"></iframe>
                </Box>
            )}
        </Modal>
    );
};

export default RepTurnitinModal;
