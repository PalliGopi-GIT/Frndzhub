import { Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import FriendDetail from './pages/FriendDetail.tsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/friend/:id" element={<FriendDetail />} />
    </Routes>
  )
}
