import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Nav from './components/Nav';
import Top from './Top';
import ScoreTop from './score/pages/ScoreTop';
// import ScoreDetail from './score/pages/ScoreDetail';

const App = () => {
  return (
    <BrowserRouter basename="/taiki-karaoke/">
      <Header />
      <Nav />
      <main className='p-4'>
        <Routes>
          <Route path='/' element={<Top />} />
          <Route path='/score' element={<ScoreTop />} />
          {/* <Route path='/score/:id' element={ScoreDetail} /> */}
          {/* <Route render={() => <h4>not found...</h4>} /> */}
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App;