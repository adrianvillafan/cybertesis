import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Icon, Input, Box, FormField, FileUpload, SpaceBetween } from '@cloudscape-design/components';

const EditarModal = ({ solicitudId, onSave, onClose }) => {
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocumentos = async () => {
            try {
                //const response = await fetch(`/api/documentos/${solicitudId}`); // Asume una API que devuelve documentos
                //const data = await response.json();
                const data = [
                    {
                        "id": 1,
                        "tipo": "Tesis",
                        "nombre": "Tesis_de_Grado.pdf",
                        "url": "/documentos/tesis_de_grado.pdf"
                    },
                    {
                        "id": 2,
                        "tipo": "Acta de Sustentacion",
                        "nombre": "Acta_Sustentacion_2024.pdf",
                        "url": "/documentos/acta_sustentacion_2024.pdf"
                    },
                    {
                        "id": 3,
                        "tipo": "Certificado de Similitud",
                        "nombre": "Certificado_Similitud_2024.pdf",
                        "url": "/documentos/certificado_similitud_2024.pdf"
                    }
                ]

                setDocumentos(data);
            } catch (error) {
                console.error("Error al cargar los documentos:", error);
                // Manejar errores, por ejemplo, mostrar un mensaje al usuario
            }
            setLoading(false);
        };

        fetchDocumentos();
    }, [solicitudId]);

    const handleFileChange = (event, id) => {
        const file = event.target.files[0];
        const nuevosDocumentos = documentos.map(doc => {
            if (doc.id === id) {
                return { ...doc, file }; // Actualiza el archivo
            }
            return doc;
        });
        setDocumentos(nuevosDocumentos);
    };

    const handleDelete = (id) => {
        const nuevosDocumentos = documentos.filter(doc => doc.id !== id);
        setDocumentos(nuevosDocumentos);
    };

    const handleSave = async () => {
        // Lógica para guardar los cambios en el servidor
        onSave(documentos);
        onClose();
    };

    if (loading) return <div>Cargando documentos...</div>;

    return (
        <Modal
            header="Editar Documentos"
            visible={true}
            size="large"
            onDismiss={onClose}
            footer={
                <Box float="right">
                    <SpaceBetween direction="horizontal" size='xs' ><Button onClick={handleSave}>Guardar Cambios</Button>
                    <Button onClick={onClose}>Cerrar</Button></SpaceBetween>
                    
                </Box>
            }
        >
            <Table
                items={documentos}
                columnDefinitions={[
                    { header: 'Tipo de Documento', cell: item => item.tipo },
                    { header: 'Nombre del Documento', cell: item => item.nombre },
                    {
                        header: 'Acciones',
                        cell: item => (
                            <React.Fragment>
                                
                                    <FormField>
                                    <SpaceBetween direction="horizontal" size='xs' >
                                        <FileUpload
                                            onChange={e => handleFileChange(e, item.id)}
                                            value={item.file ? [item.file] : []}
                                            i18nStrings={{
                                                uploadButtonText: () => "Reemplazar",
                                                dropzoneText: "Arrastra un archivo aquí o clic para subir",
                                                removeFileAriaLabel: (e) => `Eliminar archivo ${e + 1}`
                                            }}
                                        />
                                        <Button onClick={() => handleDelete(item.id)}>Eliminar</Button>
                                        </SpaceBetween>
                                    </FormField>
                                    
                                
                            </React.Fragment>

                        )
                    }
                ]}
            />
        </Modal>
    );
};

export default EditarModal;
