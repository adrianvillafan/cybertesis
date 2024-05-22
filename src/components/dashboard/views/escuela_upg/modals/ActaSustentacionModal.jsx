import React, { useState } from 'react';
import { Modal, FormField, Input, FileUpload, Button, Box, Select, Checkbox, DatePicker, SpaceBetween, ColumnLayout } from '@cloudscape-design/components';

const ActaSustentacionModal = ({ onClose }) => {
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        presidente: '',
        miembro1: '',
        miembro2: '',
        magisterDoctor: { label: '', value: '' },
        firmaPresidente: false,
        firmaMiembro1: false,
        firmaMiembro2: false,
        fechaEvaluacion: '',
        notaEvaluacion: '',
    });

    const options = [
        { label: 'Magister', value: 'magister' },
        { label: 'Doctor', value: 'doctor' }
    ];

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

    const handleAddMember = () => {
        // Lógica para agregar miembro del jurado
    };

    const handleRemoveMember = () => {
        // Lógica para eliminar miembro del jurado
    };

    const handleSubmit = () => {
        // Lógica para manejar el submit del modal
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
            closeAriaLabel="Close modal"
            header="Subir Acta de Sustentación"
            size='max'
            footer={
                <Box float='right'>
                    <SpaceBetween direction="horizontal" size="m">
                        <Button onClick={handleClose} variant="secondary">
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={!file || !formData.presidente || !formData.miembro1 || !formData.fechaEvaluacion || !formData.notaEvaluacion} style={{ marginLeft: '8px' }}>
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
                            dropzoneText: (multiple) => "No debe contener errores ortográficos ni gramaticales. Debe contener con exactitud la misma información referida en la Resolución Rectoral y debe estar firmada por el Presidente y/o el Jurado Evaluador Calificador, y escaneada en fondo blanco. El documento debe contener necesariamente todos los nombres del Jurado Evaluador Calificador incluso cuando no exista la firma expresa.",
                            uploadButtonText: (multiple) => 'Seleccionar archivo',
                            removeFileAriaLabel: (fileIndex) => `Eliminar archivo ${fileIndex}`,
                            limitShowFewer: 'Mostrar menos',
                            limitShowMore: 'Mostrar más',
                        }}
                    />
                ) : (
                    <ColumnLayout columns={2} variant="default">
                        <Box width="100%">
                            <iframe src={fileUrl} width="100%" height="600px" title="Acta de Sustentación"></iframe>
                        </Box>
                        <Box width="100%">
                            <FormField label="Presidente del Jurado">
                                <Input value={formData.presidente} onChange={({ detail }) => handleChange('presidente', detail.value)} />
                            </FormField>
                            <FormField label="Miembro 1 del Jurado">
                                <Input value={formData.miembro1} onChange={({ detail }) => handleChange('miembro1', detail.value)} />
                            </FormField>
                            <FormField label="Miembro 2 del Jurado">
                                <Input value={formData.miembro2} onChange={({ detail }) => handleChange('miembro2', detail.value)} />
                            </FormField>
                            <FormField label="Magister o Doctor">
                                <Select selectedOption={formData.magisterDoctor} options={options} onChange={({ detail }) => handleChange('magisterDoctor', detail.selectedOption)} />
                            </FormField>
                            <FormField label="Firma del Presidente">
                                <Checkbox checked={formData.firmaPresidente} onChange={({ detail }) => handleChange('firmaPresidente', detail.checked)} />
                            </FormField>
                            <FormField label="Firma del Miembro 1">
                                <Checkbox checked={formData.firmaMiembro1} onChange={({ detail }) => handleChange('firmaMiembro1', detail.checked)} />
                            </FormField>
                            <FormField label="Firma del Miembro 2">
                                <Checkbox checked={formData.firmaMiembro2} onChange={({ detail }) => handleChange('firmaMiembro2', detail.checked)} />
                            </FormField>
                            <FormField label="Fecha de Evaluación" constraintText="Use YYYY/MM/DD format.">
                                <DatePicker
                                    value={formData.fechaEvaluacion}
                                    onChange={({ detail }) => handleChange('fechaEvaluacion', detail.value)}
                                    openCalendarAriaLabel={(selectedDate) =>
                                        "Choose date" + (selectedDate ? `, selected date is ${selectedDate}` : [])
                                    }
                                    placeholder="YYYY/MM/DD"
                                />
                            </FormField>
                            <FormField label="Nota de Evaluación">
                                <Input value={formData.notaEvaluacion} onChange={({ detail }) => handleChange('notaEvaluacion', detail.value)} />
                            </FormField>
                            <Box direction="row" justifyContent="flex-end">
                                <Button onClick={handleAddMember} variant="secondary">
                                    Agregar Miembro
                                </Button>
                                {formData.miembro2 && (
                                    <Button onClick={handleRemoveMember} variant="secondary" style={{ marginLeft: '8px' }}>
                                        Eliminar Miembro 2
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </ColumnLayout>
                )}
            </SpaceBetween>
        </Modal>
    );
};

export default ActaSustentacionModal;
