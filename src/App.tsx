import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Nav from './components/Nav'
import Top from './Top'
import ScoreTop from './score/pages/ScoreList'
import ScoreDetail from './score/pages/ScoreDetail'
import { NotFound } from './score/pages/NotFound'

const App = () => {
  return (
    <BrowserRouter basename='/taiki-karaoke/'>
      <Header />
      <Nav />
      <main className='p-4'>
        <Routes>
          <Route index element={<Top />} />
          <Route path='/score' element={<ScoreTop />} />
          <Route path='/score/:id' element={<ScoreDetail />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
