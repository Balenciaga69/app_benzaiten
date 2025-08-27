import BenzaitenForm from './components/BenzaitenForm.tsx'

function App() {
  return (
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-8 col-lg-6'>
          <h1 className='text-center mb-4'>Benzaiten 記錄系統</h1>
          <BenzaitenForm />
        </div>
      </div>
    </div>
  )
}

export default App
