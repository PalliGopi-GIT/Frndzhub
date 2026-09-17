import { Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import FriendDetail from './pages/FriendDetail.tsx'
import VaultPage from './pages/VaultPage.tsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/friend/:id" element={<FriendDetail />} />
      <Route path="/vault/:id" element={<VaultPage />} />
    </Routes>
  )
}
