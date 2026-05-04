import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { Home } from './pages/Home/Home'
import { KMP } from './pages/KMP/KMP'
import { NotFound } from './pages/NotFound/NotFound'
import { RabinKarp } from './pages/RabinKarp/RabinKarp'
import { ZFunction } from './pages/ZFunction/ZFunction'
import './index.css'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/kmp" element={<KMP />} />
        <Route path="/rabin-karp" element={<RabinKarp />} />
        <Route path="/z-function" element={<ZFunction />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
