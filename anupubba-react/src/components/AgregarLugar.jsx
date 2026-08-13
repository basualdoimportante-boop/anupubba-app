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

  const categorias = ['yoga', 'psicologia', 'deportes', 'meditacion', 'espiritual'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEtiquetas = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, etiquetas: value.split(',').map(tag => tag.trim()).filter(tag => tag) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.nombre || !formData.direccion || !formData.lat || !formData.lng) {
      setError('Nombre, dirección, latitud y longitud son obligatorios.');
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'lugares'), {
        ...formData,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        creadoPor: currentUser.uid,
        creadoEn: new Date().toISOString(),
      });
      navigate('/mapa');
    } catch (err) {
      console.error(err);
      setError('Error al guardar el lugar. Intenta de nuevo.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>Agregar lugar</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre del lugar *" value={formData.nombre} onChange={handleChange} required style={{ display: 'block', width: '100%', margin: '8px 0', padding: '8px' }} />
        <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} style={{ display: 'block', width: '100%', margin: '8px 0', padding: '8px' }} />
        <input name="direccion" placeholder="Dirección *" value={formData.direccion} onChange={handleChange} required style={{ display: 'block', width: '100%', margin: '8px 0', padding: '8px' }} />
        <input name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} style={{ display: 'block', width: '100%', margin: '8px 0', padding: '8px' }} />
        <select name="categoria" value={formData.categoria} onChange={handleChange} style={{ display: 'block', width: '100%', margin: '8px 0', padding: '8px' }}>
          {categorias.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
        </select>
        <input name="etiquetas" placeholder="Etiquetas (separadas por coma)" value={formData.etiquetas.join(', ')} onChange={handleEtiquetas} style={{ display: 'block', width: '100%', margin: '8px 0', padding: '8px' }} />
        <input name="precio" placeholder="Precio (ej. $10.000)" value={formData.precio} onChange={handleChange} style={{ display: 'block', width: '100%', margin: '8px 0', padding: '8px' }} />
        <input name="horario" placeholder="Horario (ej. Lunes a Viernes 10-20hs)" value={formData.horario} onChange={handleChange} style={{ display: 'block', width: '100%', margin: '8px 0', padding: '8px' }} />
        <input name="lat" placeholder="Latitud *" value={formData.lat} onChange={handleChange} required style={{ display: 'block', width: '100%', margin: '8px 0', padding: '8px' }} />
        <input name="lng" placeholder="Longitud *" value={formData.lng} onChange={handleChange} required style={{ display: 'block', width: '100%', margin: '8px 0', padding: '8px' }} />
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Guardando...' : 'Agregar lugar'}
        </button>
      </form>
      <button onClick={() => navigate('/mapa')} style={{ marginTop: '10px' }}>Volver al mapa</button>
    </div>
  );
};

export default AgregarLugar;