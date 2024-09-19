import React, { useState, useEffect, useRef } from 'react';
import { Modal, FileUpload, Box, SpaceBetween, ColumnLayout, Icon, Spinner } from '@cloudscape-design/components';
import { Document, Page, pdfjs } from 'react-pdf';
import 'pdfjs-dist/web/pdf_viewer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ModalTwoCol = ({ onClose, headerText, footerButtons, file, setFile, fileUrl, setFileUrl, showForm, setShowForm, formContent, mode }) => {
    const [numPages, setNumPages] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Inicia en true para mostrar el spinner
    const [isDataLoading, setIsDataLoading] = useState(mode === 'view'); // Estado para manejar la carga de datos en modo view
    const [isPopoverVisible, setIsPopoverVisible] = useState(true); // Popover visible por defecto
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);
    const popoverRef = useRef(null); // Ref para el popover
    const iconRef = useRef(null); // Ref para el ícono
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            setWidth(containerRef.current.offsetWidth);
        }
        if (fileUrl || (formContent && mode === 'view') || (mode === 'upload')) {
            setIsLoading(false); // Desactiva el spinner cuando el contenido está listo
        }
    }, [fileUrl, formContent, mode]);

    useEffect(() => {
        if (mode === 'view' && isDataLoading) {
            // Simulación de la carga de datos
            setTimeout(() => {
                setIsDataLoading(false); // Desactiva el spinner cuando los datos se hayan cargado
            }, 2000); // Puedes ajustar este tiempo según sea necesario
        }
    }, [mode, isDataLoading]);

    // Cierra el popover si se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popoverRef.current && 
                !popoverRef.current.contains(event.target) &&
                iconRef.current && 
                !iconRef.current.contains(event.target)
            ) {
                setIsPopoverVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popoverRef, iconRef]);

    const handleFileChange = ({ detail }) => {
        const selectedFile = detail.value[0];
        if (selectedFile.size > 20000000) {
            alert("El tamaño del archivo excede los 20MB.");
        } else {
            setFile(selectedFile);
            setShowForm(!!selectedFile);
            if (selectedFile) {
                setIsLoading(true); // Activa el spinner al seleccionar un archivo
                const reader = new FileReader();
                reader.onload = (event) => {
                    const fileContent = event.target.result;
                    setFileUrl(fileContent);
                    setIsLoading(false); // Desactiva el spinner cuando el archivo está listo
                };
                reader.readAsDataURL(selectedFile);
            }
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const selectedFile = event.dataTransfer.files[0];
        if (selectedFile.size > 20000000) {
            alert("El tamaño del archivo excede los 20MB.");
        } else {
            setFile(selectedFile);
            setShowForm(!!selectedFile);
            if (selectedFile) {
                setIsLoading(true); // Activa el spinner al arrastrar y soltar un archivo
                const reader = new FileReader();
                reader.onload = (event) => {
                    const fileContent = event.target.result;
                    setFileUrl(fileContent);
                    setIsLoading(false); // Desactiva el spinner cuando el archivo está listo
                };
                reader.readAsDataURL(selectedFile);
            }
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleClick = () => {
        fileInputRef.current.querySelector('input[type="file"]').click();
    };

    const handleButtonClick = (event) => {
        event.stopPropagation();
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setTimeout(() => setWidth(containerRef.current.offsetWidth), 0);
    };

    const onDocumentLoadError = () => {
        console.log('Error al cargar el archivo');
    };

    // Alterna la visibilidad del popover al hacer clic en el ícono
    const togglePopover = () => {
        setIsPopoverVisible(!isPopoverVisible);
    };

    return (
        <Modal
            onDismiss={onClose}
            visible={true}
            closeAriaLabel="Cerrar modal"
            header={headerText}
            size={(isLoading || isDataLoading) ? 'medium' : (showForm || fileUrl) ? 'max' : 'medium'}
            footer={
                <Box float='right'>
                    <SpaceBetween direction="horizontal" size="m">
                        {footerButtons}
                    </SpaceBetween>
                </Box>
            }
        >
            <SpaceBetween direction="vertical" size="xl" content="div">
                {isLoading || isDataLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
                        <Spinner size="large" />
                    </div>
                ) : mode === 'upload' && !showForm && !fileUrl ? (
                    <div
                        style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', height: '30vh', border: '2px dashed #aaa', borderRadius: '10px', padding: '20px', backgroundColor: '#ffffff', cursor: 'pointer' }}
                        onClick={handleClick}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <div ref={fileInputRef} onClick={handleButtonClick}>
                            <FileUpload
                                accept="application/pdf"
                                value={file ? [file] : []}
                                onChange={handleFileChange}
                                constraintText="El tamaño máximo del archivo es de 15MB."
                                i18nStrings={{
                                    dropzoneText: () => 'Arrastra los archivos aquí o haz clic para seleccionar',
                                    uploadButtonText: () => 'Seleccionar archivo',
                                    removeFileAriaLabel: (fileIndex) => `Eliminar archivo ${fileIndex}`,
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <ColumnLayout columns={2} variant="default">
                        <div ref={containerRef} style={{ height: 'calc(75vh)', overflowY: 'auto', position: 'relative', border: '1px solid #ccc', borderRadius: '10px', padding: '5px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                            {fileUrl && (
                                <Document
                                    file={fileUrl}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onLoadError={onDocumentLoadError}
                                    width={width}
                                >
                                    {Array.from(new Array(Math.min(numPages, 15)), (el, index) => (
                                        <Page key={`page_${index + 1}`} pageNumber={index + 1} width={width - 60} />
                                    ))}
                                </Document>
                            )}
                            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                {isPopoverVisible && (
                                    <div ref={popoverRef} style={popoverStyle}>
                                        <div style={popoverArrowStyle}></div>
                                        <div>
                                            Se están mostrando {Math.min(numPages, 15)} páginas de un total de {numPages}.
                                        </div>
                                    </div>
                                )}
                                <div ref={iconRef} onClick={togglePopover} style={{ cursor: 'pointer' }}>
                                    <Icon name="status-info" size="medium" variant="link" />
                                </div>
                            </div>
                        </div>
                        <div style={{ height: 'calc(75vh)', overflowY: 'auto', padding: '5px 15px 5px 5px', borderRadius: '10px' }}>
                            <SpaceBetween direction="vertical" size="l">
                                {formContent}
                            </SpaceBetween>
                        </div>
                    </ColumnLayout>
                )}
            </SpaceBetween>
        </Modal>
    );
};

export default ModalTwoCol;

// Estilos para el popover simulado
const popoverStyle = {
    position: 'absolute',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    padding: '10px',
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    width:'180px',
    maxWidth: '550px',
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#374151',
    zIndex: 10,
    top: '30px',
    right: '0',
};

const popoverArrowStyle = {
    position: 'absolute',
    top: '-6px',
    right: '20px',
    width: '0',
    height: '0',
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderBottom: '6px solid #d1d5db',
    content: '""',
};
