import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';

const AgregarLugar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    direccion: '',
    telefono: '',
    categoria: 'yoga',
    etiquetas: [],
    precio: '',
    horario: '',
    lat: '',
    lng: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [geocoding, setGeocoding] = useState(false);

  const categorias = [
    { id: 'yoga', label: '🧘 Yoga', color: '#6C63FF' },
    { id: 'psicologia', label: '🧠 Psicología', color: '#8b5cf6' },
    { id: 'deportes', label: '🏃 Deportes', color: '#f97316' },
    { id: 'meditacion', label: '🪷 Meditación', color: '#6bcb77' },
    { id: 'espiritual', label: '✨ Espiritual', color: '#6C63FF' },
    { id: 'otros', label: '📌 Otros', color: '#6c757d' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoriaClick = (categoriaId) => {
    setFormData({ ...formData, categoria: categoriaId });
  };

  const handleEtiquetas = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, etiquetas: value.split(',').map(tag => tag.trim()).filter(tag => tag) });
  };

  // Geocodificar dirección usando Nominatim (OpenStreetMap)
  const geocodeAddress = async (address) => {
    setGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setFormData((prev) => ({
          ...prev,
          lat: lat,
          lng: lon,
        }));
        setGeocoding(false);
        return true;
      } else {
        setError('No se pudo encontrar la dirección. Intenta con una dirección más específica (ej. calle, número, ciudad).');
        setGeocoding(false);
        return false;
      }
    } catch (err) {
      console.error('Error al geocodificar:', err);
      setError('Error al buscar la dirección. Intenta de nuevo.');
      setGeocoding(false);
      return false;
    }
  };

  const handleDireccionChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, direccion: value, lat: '', lng: '' });
  };

  const handleBuscarDireccion = async () => {
    if (!formData.direccion.trim()) {
      setError('Escribe una dirección para buscar.');
      return;
    }
    await geocodeAddress(formData.direccion);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar campos obligatorios
    if (!formData.nombre || !formData.direccion) {
      setError('Nombre y dirección son obligatorios.');
      setLoading(false);
      return;
    }

    // Si no tiene coordenadas, intentar geocodificar
    if (!formData.lat || !formData.lng) {
      const success = await geocodeAddress(formData.direccion);
      if (!success) {
        setLoading(false);
        return;
      }
    }

    // Validar que las coordenadas sean números válidos
    const lat = parseFloat(formData.lat);
    const lng = parseFloat(formData.lng);
    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
      setError('No se pudieron obtener coordenadas válidas. Verifica la dirección e intenta de nuevo.');
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'lugares'), {
        ...formData,
        lat: lat,
        lng: lng,
        creadoPor: currentUser.uid,
        creadoEn: new Date().toISOString(),
      });
      navigate('/mapa');
    } catch (err) {
      console.error(err);
      setError('Error al guardar el lugar. Intenta de nuevo.');
      setLoading(false);
    }
  };

  const buttonStyle = {
    padding: '8px 16px',
    border: '2px solid #ddd',
    borderRadius: '20px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
  };

  const selectedButtonStyle = {
    ...buttonStyle,
    border: '2px solid #6C63FF',
    background: '#f0eeff',
    color: '#6C63FF',
    fontWeight: '600',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 30px rgba(108, 99, 255, 0.12)' }}>
        <h2 style={{ color: '#2d3748', fontSize: '24px', marginBottom: '4px' }}>📍 Agregar lugar</h2>
        <p style={{ color: '#718096', fontSize: '14px', marginBottom: '24px' }}>Comparte un espacio con la comunidad</p>

        {error && (
          <div style={{ background: '#fff5f5', color: '#e53e3e', padding: '12px 16px', borderRadius: '10px', borderLeft: '4px solid #e53e3e', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', fontSize: '14px', marginBottom: '5px' }}>
              Nombre del lugar <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <input
              name="nombre"
              placeholder="Ej. Centro de Yoga Paz"
              value={formData.nombre}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px 16px', border: '2px solid #edf2f7', borderRadius: '12px', fontSize: '15px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', fontSize: '14px', marginBottom: '5px' }}>
              Descripción
            </label>
            <textarea
              name="descripcion"
              placeholder="Breve descripción del lugar..."
              value={formData.descripcion}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px 16px', border: '2px solid #edf2f7', borderRadius: '12px', fontSize: '15px', minHeight: '80px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', fontSize: '14px', marginBottom: '5px' }}>
              Dirección <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                name="direccion"
                placeholder="Calle y número, ciudad (ej. Av. Providencia 123, Santiago)"
                value={formData.direccion}
                onChange={handleDireccionChange}
                required
                style={{ flex: 1, padding: '12px 16px', border: '2px solid #edf2f7', borderRadius: '12px', fontSize: '15px' }}
              />
              <button
                type="button"
                onClick={handleBuscarDireccion}
                disabled={geocoding || !formData.direccion.trim()}
                style={{
                  padding: '12px 20px',
                  background: '#6C63FF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: geocoding || !formData.direccion.trim() ? 'not-allowed' : 'pointer',
                  opacity: geocoding || !formData.direccion.trim() ? 0.5 : 1,
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                }}
              >
                {geocoding ? 'Buscando...' : '🔍 Buscar'}
              </button>
            </div>
            {formData.lat && formData.lng && !isNaN(parseFloat(formData.lat)) && !isNaN(parseFloat(formData.lng)) && (
              <div style={{ marginTop: '4px', fontSize: '12px', color: '#6bcb77' }}>
                ✅ Ubicación encontrada
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', fontSize: '14px', marginBottom: '5px' }}>
              Teléfono
            </label>
            <input
              name="telefono"
              placeholder="+56 9 1234 5678"
              value={formData.telefono}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px 16px', border: '2px solid #edf2f7', borderRadius: '12px', fontSize: '15px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', fontSize: '14px', marginBottom: '5px' }}>
              Categoría
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoriaClick(cat.id)}
                  style={formData.categoria === cat.id ? selectedButtonStyle : buttonStyle}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', fontSize: '14px', marginBottom: '5px' }}>
              Etiquetas
            </label>
            <input
              name="etiquetas"
              placeholder="Ej. Hatha, Vinyasa, BJJ, Natación (separadas por coma)"
              value={formData.etiquetas.join(', ')}
              onChange={handleEtiquetas}
              style={{ width: '100%', padding: '12px 16px', border: '2px solid #edf2f7', borderRadius: '12px', fontSize: '15px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', fontSize: '14px', marginBottom: '5px' }}>
                💰 Precio
              </label>
              <input
                name="precio"
                placeholder="Ej. $10.000 por clase"
                value={formData.precio}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #edf2f7', borderRadius: '12px', fontSize: '15px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', fontSize: '14px', marginBottom: '5px' }}>
                🕐 Horario
              </label>
              <input
                name="horario"
                placeholder="Ej. Lunes a Viernes 10-20hs"
                value={formData.horario}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #edf2f7', borderRadius: '12px', fontSize: '15px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '14px',
                background: '#6C63FF',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Guardando...' : '✅ Agregar lugar'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/mapa')}
              style={{
                padding: '14px 24px',
                background: 'transparent',
                color: '#6C63FF',
                border: '2px solid #6C63FF',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarLugar;