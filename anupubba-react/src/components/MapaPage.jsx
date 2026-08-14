import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Corregir iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 13);
  }, [center, map]);
  return null;
};

const MapaPage = () => {
  const [lugares, setLugares] = useState([]);
  const [filteredLugares, setFilteredLugares] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [distancia, setDistancia] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categorias = [
    { id: 'todos', label: '📌 Todos', color: '#6c757d' },
    { id: 'yoga', label: '🧘 Yoga', color: '#6C63FF' },
    { id: 'psicologia', label: '🧠 Psicología', color: '#8b5cf6' },
    { id: 'deportes', label: '🏃 Deportes', color: '#f97316' },
    { id: 'meditacion', label: '🪷 Meditación', color: '#6bcb77' },
    { id: 'espiritual', label: '✨ Espiritual', color: '#6C63FF' },
    { id: 'otros', label: '📌 Otros', color: '#6c757d' },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.warn('No se pudo obtener ubicación')
      );
    }
  }, []);

  useEffect(() => {
    const fetchLugares = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'lugares'));
        const data = [];
        querySnapshot.forEach((doc) => {
          const lugarData = doc.data();
          // Verificar que tenga coordenadas válidas
          const lat = parseFloat(lugarData.lat);
          const lng = parseFloat(lugarData.lng);
          if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            data.push({ id: doc.id, ...lugarData, lat, lng });
          } else {
            console.warn('Lugar con coordenadas inválidas:', doc.id, lugarData);
          }
        });
        setLugares(data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar lugares:', err);
        setLoading(false);
      }
    };
    fetchLugares();
  }, []);

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => {
    let resultado = lugares;

    if (categoriaSeleccionada !== 'todos') {
      resultado = resultado.filter((l) => l.categoria === categoriaSeleccionada);
    }

    if (busqueda.trim() !== '') {
      const text = busqueda.toLowerCase();
      resultado = resultado.filter((l) =>
        (l.nombre?.toLowerCase().includes(text)) ||
        (l.descripcion?.toLowerCase().includes(text)) ||
        (l.etiquetas?.some(tag => tag.toLowerCase().includes(text)))
      );
    }

    if (userLocation && distancia && parseFloat(distancia) > 0) {
      const maxDist = parseFloat(distancia);
      resultado = resultado.filter((l) =>
        getDistance(userLocation.lat, userLocation.lng, l.lat, l.lng) <= maxDist
      );
    }

    setFilteredLugares(resultado);
  }, [lugares, categoriaSeleccionada, busqueda, distancia, userLocation]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando mapa...</div>;

  const buttonStyle = (categoriaId) => ({
    padding: '8px 16px',
    border: '2px solid #ddd',
    borderRadius: '20px',
    background: categoriaSeleccionada === categoriaId ? '#f0eeff' : 'white',
    borderColor: categoriaSeleccionada === categoriaId ? '#6C63FF' : '#ddd',
    color: categoriaSeleccionada === categoriaId ? '#6C63FF' : '#555',
    fontWeight: categoriaSeleccionada === categoriaId ? '600' : '400',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', background: 'white', borderBottom: '1px solid #eee', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '8px 16px',
              background: '#e2e8f0',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: '#4a5568',
            }}
          >
            ← Volver
          </button>
          <button
            onClick={() => navigate('/agregar-lugar')}
            style={{
              padding: '8px 16px',
              background: '#6C63FF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            + Agregar lugar
          </button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '14px', color: '#888', alignSelf: 'center' }}>
            {filteredLugares.length} lugares
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaSeleccionada(cat.id)}
              style={buttonStyle(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="🔍 Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              flex: 1,
              minWidth: '150px',
              padding: '8px 14px',
              border: '2px solid #edf2f7',
              borderRadius: '20px',
              fontSize: '14px',
            }}
          />
          <input
            type="number"
            placeholder="📏 Distancia (km)"
            value={distancia}
            onChange={(e) => setDistancia(e.target.value)}
            style={{
              width: '130px',
              padding: '8px 14px',
              border: '2px solid #edf2f7',
              borderRadius: '20px',
              fontSize: '14px',
            }}
          />
          {distancia && (
            <button
              onClick={() => setDistancia('')}
              style={{
                padding: '4px 10px',
                background: 'transparent',
                border: 'none',
                color: '#e53e3e',
                cursor: 'pointer',
                fontSize: '18px',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <MapContainer
          center={userLocation || [-33.4489, -70.6693]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {userLocation && <MapCenter center={[userLocation.lat, userLocation.lng]} />}
          {filteredLugares.map((lugar) => (
            <Marker key={lugar.id} position={[lugar.lat, lugar.lng]}>
              <Popup>
                <strong>{lugar.nombre}</strong><br />
                {lugar.descripcion && `${lugar.descripcion.substring(0, 80)}...`}<br />
                <strong>📍 Dirección:</strong> {lugar.direccion}<br />
                {lugar.telefono && <><strong>📞 Teléfono:</strong> {lugar.telefono}<br /></>}
                {lugar.precio && <><strong>💰 Precio:</strong> {lugar.precio}<br /></>}
                {lugar.horario && <><strong>🕐 Horario:</strong> {lugar.horario}<br /></>}
                {lugar.etiquetas?.length > 0 && (
                  <><strong>🏷️ Etiquetas:</strong> {lugar.etiquetas.join(', ')}<br /></>
                )}
                <span style={{ fontSize: '12px', color: '#888' }}>
                  📂 {categorias.find(c => c.id === lugar.categoria)?.label || lugar.categoria}
                </span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapaPage;