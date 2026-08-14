import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Onboarding from './components/Onboarding';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import UserProfile from './components/UserProfile';
import TestsPage from './components/TestsPage';
import Tests from './components/Tests';
import HistoryPage from './components/HistoryPage';
import NeuroPage from './components/NeuroPage';
import NeuroDesafioPage from './components/NeuroDesafioPage';
import NeuroTriviaGeneral from './components/NeuroTriviaGeneral';
import DeportesPage from './components/DeportesPage';
import DeportesTriviaCapitulo from './components/DeportesTriviaCapitulo';
import DeportesTrivia from './components/DeportesTrivia';
import SpiritualPage from './components/SpiritualPage';
import SpiritualDesafioPage from './components/SpiritualDesafioPage';
import MeditacionesPage from './components/MeditacionesPage';
import MapaPage from './components/MapaPage';
import AgregarLugar from './components/AgregarLugar';
import Resenas from './components/Resenas';
import GamesPage from './components/GamesPage';
import AboutPage from './components/AboutPage'; // 👈 NUEVO

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Onboarding />} />
          <Route path="/about" element={<AboutPage />} /> {/* 👈 NUEVA RUTA */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Rutas protegidas */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          
          <Route path="/tests" element={<PrivateRoute><TestsPage /></PrivateRoute>} />
          <Route path="/tests/:testId" element={<PrivateRoute><Tests /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
          
          <Route path="/neuro" element={<PrivateRoute><NeuroPage /></PrivateRoute>} />
          <Route path="/neuro/desafio/:chapterId" element={<PrivateRoute><NeuroDesafioPage /></PrivateRoute>} />
          <Route path="/trivia-neuro" element={<PrivateRoute><NeuroTriviaGeneral /></PrivateRoute>} />
          
          <Route path="/deportes" element={<PrivateRoute><DeportesPage /></PrivateRoute>} />
          <Route path="/deportes/desafio/:chapterId" element={<PrivateRoute><DeportesTriviaCapitulo /></PrivateRoute>} />
          <Route path="/trivia-deportes" element={<PrivateRoute><DeportesTrivia /></PrivateRoute>} />
          
          <Route path="/caminos" element={<PrivateRoute><SpiritualPage /></PrivateRoute>} />
          <Route path="/caminos/desafio/:chapterId" element={<PrivateRoute><SpiritualDesafioPage /></PrivateRoute>} />
          
          <Route path="/meditaciones" element={<PrivateRoute><MeditacionesPage /></PrivateRoute>} />
          <Route path="/mapa" element={<PrivateRoute><MapaPage /></PrivateRoute>} />
          <Route path="/agregar-lugar" element={<PrivateRoute><AgregarLugar /></PrivateRoute>} />
          <Route path="/resenas/:lugarId" element={<PrivateRoute><Resenas /></PrivateRoute>} />
          <Route path="/juegos" element={<PrivateRoute><GamesPage /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;