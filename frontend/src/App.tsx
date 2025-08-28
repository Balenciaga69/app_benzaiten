import BenzaitenForm from './components/BenzaitenForm.tsx'
import pkg from '../package.json'

function App() {
  return (
    <div className='container py-5 text-light'>
      <div className='row justify-content-center'>
        <div className='col-md-8 col-lg-6'>
          <h1 className='text-center mb-4 fw-light'>觀音法門 AI 六字大明咒</h1>
          <BenzaitenForm />
        </div>
      </div>
      <footer className='text-center mt-5 text-secondary small'>
        © 2025 All Rights Reserved. v{pkg.version}
      </footer>
    </div>
  )
}

export default App
