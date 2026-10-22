import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'

// Home ships in the main bundle; other pages load on demand (the router waits, so there's no blank flash).
const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/work', lazy: async () => ({ Component: (await import('./pages/Work')).default }) },
        { path: '/contact', lazy: async () => ({ Component: (await import('./pages/Contact')).default }) },
        { path: '*', lazy: async () => ({ Component: (await import('./pages/NotFound')).default }) },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
)

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </LazyMotion>
  )
}
