import React, { useState, useEffect } from 'react';
import { Modal, FormField, Input, FileUpload, Button, Box, Select, Checkbox, SpaceBetween, ColumnLayout } from '@cloudscape-design/components';

const TesisModal = ({ onClose, onSubmit, alumnoData }) => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    facultad: alumnoData?.facultad || '',
    escuela: '',
    titulo: '',
    tipo: 'Tesis',
    autores: [{ nombre: alumnoData?.nombre || '', apellido: alumnoData?.apellidos || '' }],
    asesores: [{ dni: '', nombre: '', apellido: '', titulo: 'Magister', coasesor: false }],
    year: '',
  });

  const handleFileChange = ({ detail }) => {
    const selectedFile = detail.value[0];
    if (selectedFile.size > 5000000) {
      alert("El tamaño del archivo excede los 5MB.");
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

  const handleChange = (key, value, index, type = 'asesores') => {
    const newEntries = [...formData[type]];
    newEntries[index][key] = value;
    setFormData(prev => ({ ...prev, [type]: newEntries }));
  };

  const handleSubmit = () => {
    if (Object.values(formData).some(value => value === '') || formData.asesores.some(asesor => Object.values(asesor).some(value => value === ''))) {
      alert("Todos los campos deben estar completos.");
    } else {
      onSubmit({ file, formData });
      onClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setShowForm(false);
    onClose();
  };

  const handleBuscarAsesor = (index) => {
    const dni = formData.asesores[index].dni;
    // Simular búsqueda del asesor por DNI (Reemplazar con llamada a API)
    const asesorData = { nombre: 'Nombre Asesor', apellido: 'Apellido Asesor' };
    handleChange('nombre', asesorData.nombre, index);
    handleChange('apellido', asesorData.apellido, index);
  };

  const agregarAutor = () => {
    if (formData.autores.length < 2) {
      setFormData(prev => ({
        ...prev,
        autores: [...prev.autores, { nombre: '', apellido: '' }]
      }));
    }
  };

  const eliminarAutor = () => {
    if (formData.autores.length > 1) {
      setFormData(prev => ({
        ...prev,
        autores: prev.autores.slice(0, -1)
      }));
    }
  };

  const agregarAsesor = () => {
    if (formData.asesores.length < 2) {
      setFormData(prev => ({
        ...prev,
        asesores: [...prev.asesores, { dni: '', nombre: '', apellido: '', titulo: 'Magister', coasesor: false }]
      }));
    }
  };

  const eliminarAsesor = () => {
    if (formData.asesores.length > 1) {
      setFormData(prev => ({
        ...prev,
        asesores: prev.asesores.slice(0, -1)
      }));
    }
  };

  return (
    <Modal
      onDismiss={handleClose}
      visible={true}
      closeAriaLabel="Cerrar modal"
      header="Subir Tesis"
      size={!showForm ? 's' : 'max'}
      footer={
        <Box float='right'>
          <SpaceBetween direction="horizontal" size="m">
            <Button onClick={handleClose} variant="secondary">Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!file || !formData.facultad || !formData.escuela || !formData.titulo || !formData.year} style={{ marginLeft: '8px' }}>Guardar</Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween direction="vertical" size="xl" content="div">
        {!showForm ? (
          <FileUpload
            value={file ? [file] : []}
            onChange={handleFileChange}
            accept="application/pdf"
            errorText="El tamaño del archivo excede los 5MB."
            constraintText="El tamaño máximo del archivo es de 5MB."
            i18nStrings={{
              dropzoneText: (multiple) => 'Arrastra los archivos aquí o haz clic para seleccionar',
              uploadButtonText: (multiple) => 'Seleccionar archivo',
              removeFileAriaLabel: (fileIndex) => `Eliminar archivo ${fileIndex}`,
              limitShowFewer: 'Mostrar menos',
              limitShowMore: 'Mostrar más',
            }}
          />
        ) : (
          <ColumnLayout columns={2} variant="default">
            <Box width="100%">
              <iframe src={fileUrl} title="Visualizador de PDF" width="100%" height="600px" />
            </Box>
            <Box width="100%">
              <FormField label="Facultad">
                <Input value={formData.facultad} readOnly />
              </FormField>
              <FormField label="Escuela">
                <Input value={formData.escuela} onChange={({ detail }) => setFormData(prev => ({ ...prev, escuela: detail.value }))} />
              </FormField>
              <FormField label="Título">
                <Input value={formData.titulo} onChange={({ detail }) => setFormData(prev => ({ ...prev, titulo: detail.value }))} />
              </FormField>
              <FormField label="Tipo">
                <Select
                  selectedOption={{ label: formData.tipo, value: formData.tipo }}
                  options={[
                    { label: 'Tesis', value: 'Tesis' },
                    { label: 'Trabajo de investigación', value: 'Trabajo de investigación' }
                  ]}
                  onChange={({ detail }) => setFormData(prev => ({ ...prev, tipo: detail.selectedOption.value }))}
                />
              </FormField>
              {formData.autores.map((autor, index) => (
                <div key={index}>
                  <FormField label={`Nombre del Autor ${index + 1}`}>
                    <Input
                      value={autor.nombre}
                      onChange={({ detail }) => handleChange('nombre', detail.value, index, 'autores')}
                      readOnly={index === 0}
                    />
                  </FormField>
                  <FormField label={`Apellido del Autor ${index + 1}`}>
                    <Input
                      value={autor.apellido}
                      onChange={({ detail }) => handleChange('apellido', detail.value, index, 'autores')}
                      readOnly={index === 0}
                    />
                  </FormField>
                </div>
              ))}
              <Button onClick={agregarAutor} disabled={formData.autores.length >= 2}>Agregar Autor</Button>
              {formData.autores.length > 1 && (
                <Button onClick={eliminarAutor}>Eliminar Autor Extra</Button>
              )}
              {formData.asesores.map((asesor, index) => (
                <div key={index}>
                  <FormField label={`DNI del Asesor ${index + 1}`}>
                    <Input
                      value={asesor.dni}
                      onChange={({ detail }) => handleChange('dni', detail.value, index, 'asesores')}
                      afterContent={<Button onClick={() => handleBuscarAsesor(index)}>Buscar</Button>}
                    />
                  </FormField>
                  <FormField label="Nombre del Asesor">
                    <Input value={asesor.nombre} readOnly />
                  </FormField>
                  <FormField label="Apellido del Asesor">
                    <Input value={asesor.apellido} readOnly />
                  </FormField>
                  <FormField label="Título del Asesor">
                    <Select
                      selectedOption={{ label: asesor.titulo, value: asesor.titulo }}
                      options={[
                        { label: 'Magister', value: 'Magister' },
                        { label: 'Doctor', value: 'Doctor' }
                      ]}
                      onChange={({ detail }) => handleChange('titulo', detail.selectedOption.value, index, 'asesores')}
                    />
                  </FormField>
                  <FormField label="Coasesor">
                    <Checkbox
                      checked={asesor.coasesor}
                      onChange={({ detail }) => handleChange('coasesor', detail.checked, index, 'asesores')}
                    />
                  </FormField>
                </div>
              ))}
              <Button onClick={agregarAsesor} disabled={formData.asesores.length >= 2}>Agregar Asesor</Button>
              {formData.asesores.length > 1 && (
                <Button onClick={eliminarAsesor}>Eliminar Asesor Extra</Button>
              )}
              <FormField label="Año">
                <Input value={formData.year} onChange={({ detail }) => setFormData(prev => ({ ...prev, year: detail.value }))} />
              </FormField>
            </Box>
          </ColumnLayout>
        )}
      </SpaceBetween>
    </Modal>
  );
};

export default TesisModal;
