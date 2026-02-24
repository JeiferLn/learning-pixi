import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Home from './app/Home'

const Class1 = lazy(() => import('./games/class-1/index.tsx'))
const Class2 = lazy(() => import('./games/class-2/index.tsx'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/class1" element={<Class1 />} />
          <Route path="/class2" element={<Class2 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}