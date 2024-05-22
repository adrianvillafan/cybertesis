import React, { useState } from 'react';
import { Modal, FileUpload, Button, Box } from '@cloudscape-design/components';

const CertificadoSimilitudModal = ({ onClose }) => {
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
            header="Certificado de Similitud"
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
                    dropzoneText: (multiple) => "Debe contener los datos completos, firma y huella digital del asesor del trabajo (tesis, trabajo de investigación, trabajo de suficiencia profesional, trabajo académico u otros). La firma, así como la huella dactilar debe tener el fondo blanco. La longitud de las cadenas excluidas no debe superar las 15 palabras, es decir, la Universidad considera como original todo documento de grado o título, que no exceda el 20% de similitud con textos de otros autores.",
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

export default CertificadoSimilitudModal;
