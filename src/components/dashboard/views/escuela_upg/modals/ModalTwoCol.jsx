import React, { useState, useEffect, useRef } from 'react';
import { Modal, FileUpload, Button, Box, SpaceBetween, Container, Header, ColumnLayout, Popover, Icon } from '@cloudscape-design/components';
import { Document, Page, pdfjs } from 'react-pdf';
import 'pdfjs-dist/web/pdf_viewer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ModalTwoCol = ({ onClose, headerText, footerButtons, file, setFile, fileUrl, setFileUrl, showForm, setShowForm, formContent, isFormComplete }) => {
    const [numPages, setNumPages] = useState(null);
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);
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
    }, [showForm]);

    const handleFileChange = ({ detail }) => {
        const selectedFile = detail.value[0];
        if (selectedFile.size > 20000000) {
            alert("El tamaño del archivo excede los 20MB.");
        } else {
            setFile(selectedFile);
            setShowForm(!!selectedFile);
            if (selectedFile) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const fileContent = event.target.result;
                    setFileUrl(fileContent
                    );
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
                const reader = new FileReader();
                reader.onload = (event) => {
                    const fileContent = event.target.result;
                    setFileUrl(fileContent);
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

    return (
        <Modal
            onDismiss={onClose}
            visible={true}
            closeAriaLabel="Cerrar modal"
            header={headerText}
            size={showForm || fileUrl ? 'max' : 'medium'}
            footer={
                <Box float='right'>
                    <SpaceBetween direction="horizontal" size="m">
                        {footerButtons}
                    </SpaceBetween>
                </Box>
            }
        >
            <SpaceBetween direction="vertical" size="xl" content="div">
                {!showForm && !fileUrl ? (
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
                                <Popover
                                    dismissButton={false}
                                    position="top"
                                    size="small"
                                    triggerType="click"
                                    content={<div>Se están mostrando {Math.min(numPages, 15)} páginas de un total de {numPages}.</div>}
                                >
                                    <Icon name="status-info" size="medium" variant="link" />
                                </Popover>
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