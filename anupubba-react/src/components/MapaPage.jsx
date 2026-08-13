import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  const [categoria, setCategoria] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [distancia, setDistancia] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [filtroDeporte, setFiltroDeporte] = useState('todos');
  const [deportesDisponibles, setDeportesDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
        setLugares(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
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
    if (categoria !== 'todos') resultado = resultado.filter((l) => l.categoria === categoria);
    if (categoria === 'deportes' && filtroDeporte !== 'todos') {
      resultado = resultado.filter((l) =>
        l.etiquetas && l.etiquetas.some(tag => tag.toLowerCase() === filtroDeporte.toLowerCase())
      );
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
  }, [lugares, categoria, busqueda, distancia, userLocation, filtroDeporte]);

  useEffect(() => {
    const deportes = new Set();
    lugares.forEach((l) => {
      if (l.categoria === 'deportes' && l.etiquetas) {
        l.etiquetas.forEach(tag => deportes.add(tag));
      }
    });
    setDeportesDisponibles(Array.from(deportes));
  }, [lugares]);

  if (loading) return <div>Cargando mapa...</div>;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', background: '#f5f5f5' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <button onClick={() => navigate('/dashboard')}>Volver</button>
          <button onClick={() => navigate('/agregar-lugar')}>Agregar lugar</button>

          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="todos">Todas las categorías</option>
            <option value="yoga">Yoga</option>
            <option value="psicologia">Psicología</option>
            <option value="deportes">Deportes</option>
            <option value="meditacion">Meditación</option>
            <option value="espiritual">Espiritual</option>
          </select>

          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <input
            type="number"
            placeholder="Distancia (km)"
            value={distancia}
            onChange={(e) => setDistancia(e.target.value)}
            style={{ width: '100px' }}
          />

          {categoria === 'deportes' && deportesDisponibles.length > 0 && (
            <select value={filtroDeporte} onChange={(e) => setFiltroDeporte(e.target.value)}>
              <option value="todos">Todos los deportes</option>
              {deportesDisponibles.map(deporte => (
                <option key={deporte} value={deporte}>{deporte}</option>
              ))}
            </select>
          )}
        </div>
        <div style={{ marginTop: '5px', fontSize: '14px', color: '#555' }}>
          Mostrando {filteredLugares.length} lugares
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <MapContainer
          center={userLocation || [-33.4489, -70.6693]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
          {userLocation && <MapCenter center={[userLocation.lat, userLocation.lng]} />}
          {filteredLugares.map((lugar) => (
            <Marker key={lugar.id} position={[lugar.lat, lugar.lng]}>
              <Popup>
                <strong>{lugar.nombre}</strong><br />
                {lugar.descripcion && `${lugar.descripcion.substring(0, 100)}...`}<br />
                <strong>Dirección:</strong> {lugar.direccion}<br />
                {lugar.telefono && <><strong>Teléfono:</strong> {lugar.telefono}<br /></>}
                {lugar.precio && <><strong>Precio:</strong> {lugar.precio}<br /></>}
                {lugar.horario && <><strong>Horario:</strong> {lugar.horario}<br /></>}
                {lugar.etiquetas && lugar.etiquetas.length > 0 && (
                  <><strong>Etiquetas:</strong> {lugar.etiquetas.join(', ')}<br /></>
                )}
                <button onClick={() => navigate(`/resenas/${lugar.id}`)}>Ver reseñas</button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapaPage;