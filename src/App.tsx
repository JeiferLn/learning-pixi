import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Home from './app/Home'

const Class1 = lazy(() => import('./games/class-1/index.tsx'))
const Class2 = lazy(() => import('./games/class-2/index.tsx'))
const Class3 = lazy(() => import('./games/class-3/index.tsx'))
const Class4 = lazy(() => import('./games/class-4/index.tsx'))
const Class5 = lazy(() => import('./games/class-5/index.tsx'))
const Class6 = lazy(() => import('./games/class-6/index.tsx'))
const Class7 = lazy(() => import('./games/class-7/index.tsx'))
const Class8 = lazy(() => import('./games/class-8/index.tsx'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/class1" element={<Class1 />} />
          <Route path="/class2" element={<Class2 />} />
          <Route path="/class3" element={<Class3 />} />
          <Route path="/class4" element={<Class4 />} />
          <Route path="/class5" element={<Class5 />} />
          <Route path="/class6" element={<Class6 />} />
          <Route path="/class7" element={<Class7 />} />
          <Route path="/class8" element={<Class8 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}