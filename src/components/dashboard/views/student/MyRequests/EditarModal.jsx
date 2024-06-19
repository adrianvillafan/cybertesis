import React, { useEffect, useState } from 'react';
import { Modal, Table, Button, Box, SpaceBetween, Spinner, TextContent, FileUpload, FormField } from '@cloudscape-design/components';
//import { fetchDocumentosBySolicitudId, getDownloadUrlFromMinIO } from '../../../../../../api';

const EditarModal = ({ solicitud, onClose }) => {
    const [documentos, setDocumentos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
    const [documentoActual, setDocumentoActual] = useState(null);
    const [documentoActual2, setDocumentoActual2] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        // Simular la obtención de documentos por solicitudId
        console.log(solicitud);
        fetchDocumentosBySolicitudId(solicitud.id)
            .then(data => {
                setDocumentos(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Error al cargar documentos:', err);
                setError('Error al cargar documentos');
                setIsLoading(false);
            });
    }, [solicitud]);

    const handleFileChange = (index, newFile) => {
        const nuevosDocumentos = [...documentos];
        nuevosDocumentos[index].file = newFile;
        setDocumentos(nuevosDocumentos);
        // Aquí puedes realizar otras acciones, como la subida del archivo
        // Mostrar el archivo en un iframe
        if (newFile) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const fileUrl = event.target.result;
                setDocumentoActual2(fileUrl); // Actualizar el estado con la URL del archivo
            };
            reader.readAsDataURL(newFile);
        } else {
            setDocumentoActual2(null); // Limpiar el estado si no hay archivo seleccionado
        }
    };

    const handleSave = () => {
        setMensaje('Se ha enviado la solicitud de modificación de documentos. El proceso será revisado y comenzará desde el inicio.');
        // Aquí puedes realizar la lógica para enviar la solicitud de modificación al backend
        setTimeout(() => {
            setMensaje('');
            onClose();
        }, 3000);
    };

    const verDocumento = async (documento) => {
        if (!documento) {
            console.error('Documento no definido');
            return;
        }
        try {
            const viewUrl = await getDownloadUrlFromMinIO(documento.url_documento);
            setDocumentoActual(viewUrl);
        } catch (error) {
            console.error('Error al ver el documento:', error);
            // Maneja el error de manera adecuada
        }
    };


    return (
        <Modal
            header="Editar Documentos"
            visible={true}
            size="large"
            onDismiss={onClose}
            footer={
                <Box float="right">
                    <SpaceBetween direction="horizontal" size='xs' >
                        {documentoActual2 && <Button onClick={handleSave}>Solicitar cambios</Button>}
                        <Button onClick={() => (onClose, setDocumentoActual(null), setDocumentoActual2(null), setDocumentoSeleccionado(null))}>Cerrar</Button>
                    </SpaceBetween>
                </Box>
            }
        >
            {mensaje && <TextContent>{mensaje}</TextContent>}
            {isLoading && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <Spinner size="large" />
                </div>
            )}
            {!isLoading && !error && (
                <>
                    {documentoSeleccionado ? (
                        <>
                            <SpaceBetween direction="vertical" size="s">
                                <TextContent><h3>{documentoSeleccionado.id} - {documentoSeleccionado.tipo_documento}</h3></TextContent>
                                <iframe id="documentoIframe" width="100%" height="600" src={documentoActual}></iframe>
                                <Button onClick={() => (setDocumentoSeleccionado(null), setDocumentoActual2(null))}>Volver</Button>
                            </SpaceBetween>
                        </>
                    ) : (
                        <Table
                            items={documentos}
                            resizableColumns
                            columnDefinitions={[
                                { header: 'ID', cell: item => item.id, minWidth: 40, width: 50, maxWidth: 60 },
                                { header: 'Documento', cell: item => <span style={{ display: 'flex', alignItems: 'left' }}>{item.tipo_documento}</span>, width: 200, minWidth: 160, maxWidth: 250 },
                                {
                                    header: 'Fecha de Carga',
                                    cell: item => {
                                        const date = new Date(item.fecha_carga);
                                        return `${date.toLocaleDateString('es-ES')} ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
                                    },
                                    width: 150,
                                    minWidth: 120,
                                    maxWidth: 180
                                },
                                { header: 'Estado', cell: item => "Activo", minWidth: 60, width: 90, maxWidth: 120 },
                                {
                                    header: 'Acciones',
                                    cell: item => (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {item.tipo} {item.url_documento}
                                            <Button onClick={() => { setDocumentoSeleccionado(item); verDocumento(item); }}>Editar</Button>
                                        </div>
                                    ),
                                    minWidth: 235,
                                    width: 240,
                                    maxWidth: 300
                                }
                            ]}
                        />
                    )}
                </>
            )}
            {documentoSeleccionado && (
                <>
                    <FormField>
                        <FileUpload
                            onChange={({ detail }) => { handleFileChange(documentoSeleccionado.tipo, detail.value[0]) }}
                            value={documentoSeleccionado.file ? [documentoSeleccionado.file] : []}
                            accept="application/pdf"
                            multiple={false}
                            tokenLimit={1}
                            i18nStrings={{
                                uploadButtonText: () => "Reemplazar",
                                dropzoneText: () => "Arrastra un archivo aquí o haz clic para subirlo",
                                removeFileAriaLabel: (e) => `Eliminar archivo ${e + 1}`,
                                formatFileSize: (sizeInBytes) => {
                                    // Formatear el tamaño del archivo en MB
                                    const fileSizeInMB = sizeInBytes / (1024 * 1024);
                                    return `${fileSizeInMB.toFixed(2)} MB`;
                                },
                            }}
                            showFileSize={true}
                            showFileThumbnail={false}
                        />
                    </FormField>
                </>
            )}
            {documentoSeleccionado && documentoActual2 && <div>
                <TextContent><h3>Archivo cargado</h3></TextContent>
                <iframe id="documentoIframe2" width="100%" height="600" src={documentoActual2}></iframe>
            </div>}
            {error && <p>Error al cargar documentos: {error}</p>}
        </Modal>
    );
};

export default EditarModal;
