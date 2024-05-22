import React, { useState } from 'react';
import { Modal, FormField, Input, FileUpload, Button, Box, Select, Checkbox, DatePicker, SpaceBetween, ColumnLayout } from '@cloudscape-design/components';

const MetadatosModal = ({ onClose }) => {
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        // Datos de autor 1
        autor1Nombres: '',
        autor1Apellidos: '',
        autor1TipoDocumento: '',
        autor1NumeroDocumento: '',
        autor1ORCID: '',
        // Datos de autor 2
        autor2Nombres: '',
        autor2Apellidos: '',
        autor2TipoDocumento: '',
        autor2NumeroDocumento: '',
        autor2ORCID: '',
        // Datos del asesor
        asesorNombres: '',
        asesorApellidos: '',
        asesorTipoDocumento: '',
        asesorNumeroDocumento: '',
        asesorORCID: '',
        // Datos del coasesor
        coasesorNombres: '',
        coasesorApellidos: '',
        coasesorTipoDocumento: '',
        coasesorNumeroDocumento: '',
        coasesorORCID: '',
        // Datos del jurado
        presidenteNombres: '',
        presidenteApellidos: '',
        presidenteTipoDocumento: '',
        presidenteNumeroDocumento: '',
        miembroJurado1Nombres: '',
        miembroJurado1Apellidos: '',
        miembroJurado1TipoDocumento: '',
        miembroJurado1NumeroDocumento: '',
        miembroJurado2Nombres: '',
        miembroJurado2Apellidos: '',
        miembroJurado2TipoDocumento: '',
        miembroJurado2NumeroDocumento: '',
        miembroJurado3Nombres: '',
        miembroJurado3Apellidos: '',
        miembroJurado3TipoDocumento: '',
        miembroJurado3NumeroDocumento: '',
        // Datos de investigación
        lineaInvestigacion: '',
        grupoInvestigacion: '',
        agenciaFinanciamiento: '',
        ubicacionGeografica: {
            pais: '',
            departamento: '',
            provincia: '',
            distrito: '',
            centroPoblado: '',
            urbanizacion: '',
            manzanaLote: '',
            calle: '',
            latitud: '',
            longitud: ''
        },
        anioInicio: '',
        anioFin: '',
        disciplinasOCDE: []
    });

    const handleFileChange = ({ detail }) => {
        const selectedFile = detail.value[0];
        setFile(selectedFile);
        setShowForm(!!selectedFile);
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

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        // Lógica para guardar los datos
        localStorage.removeItem('uploadedFile');
        onClose();
    };

    const handleClose = () => {
        localStorage.removeItem('uploadedFile');
        setFile(null);
        setShowForm(false);
        onClose();
    };

    return (
        <Modal
            onDismiss={handleClose}
            visible={true}
            closeAriaLabel="Cerrar modal"
            header="Subir Metadatos"
            size='max'
            footer={
                <Box float='right'>
                    <SpaceBetween direction="horizontal" size="m">
                        <Button onClick={handleClose} variant="secondary">
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={!file || !showForm} style={{ marginLeft: '8px' }}>
                            Guardar
                        </Button>
                    </SpaceBetween>
                </Box>}
        >
            <SpaceBetween direction="vertical" size="xl" content={"div"}>
                {!showForm ? (
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
                ) : (
                    <ColumnLayout columns={2} variant="default">
                        <Box width="100%">
                            <iframe src={fileUrl} width="100%" height="600px" title="Visualizador de PDF"></iframe>
                        </Box>
                        <Box width="100%">
                            {/* Formulario de metadatos */}
                            <FormField label="Datos de autor 1">
                                <Input value={formData.autor1Nombres} onChange={({ detail }) => handleChange('autor1Nombres', detail.value)} />
                                {/* Otros campos de datos de autor 1 */}
                            </FormField>
                            {/* Otros form fields para los datos de autor 2, asesor, coasesor, jurado, y datos de investigación */}
                        </Box>
                    </ColumnLayout>
                )}
            </SpaceBetween>
        </Modal>
    );
};

export default MetadatosModal;
