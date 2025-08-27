import { useState } from 'react'
import axios from 'axios'

interface FormData {
  prompt: string
  authCode: string
}

interface ApiResponse {
  success: boolean
  message: string
  data?: any[]
  error?: string
  details?: string
}

const BenzaitenForm = () => {
  const [formData, setFormData] = useState<FormData>({
    prompt: '',
    authCode: '',
  })
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.prompt.trim()) {
      setError('請輸入提示內容')
      return
    }

    if (!formData.authCode.trim()) {
      setError('請輸入授權碼')
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const result = await axios.post(
        'https://beu6aadqqoq2swyngksbl7xihi0niwii.lambda-url.us-east-1.on.aws/',
        {
          userInput: formData.prompt,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Code': formData.authCode,
          },
        }
      )

      setResponse(result.data)
      // 清空表單（保留授權碼）
      setFormData((prev) => ({
        ...prev,
        prompt: '',
      }))
    } catch (err: any) {
      if (err.response) {
        setError(`錯誤: ${err.response.data.error || err.response.data.message || '未知錯誤'}`)
      } else {
        setError(`網路錯誤: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='card'>
      <div className='card-body'>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='prompt' className='form-label'>
              提示內容 <span className='text-danger'>*</span>
            </label>
            <textarea
              id='prompt'
              name='prompt'
              className='form-control'
              rows={3}
              value={formData.prompt}
              onChange={handleInputChange}
              placeholder='輸入你想要記錄的內容...'
              disabled={loading}
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='authCode' className='form-label'>
              授權碼 <span className='text-danger'>*</span>
            </label>
            <input
              id='authCode'
              name='authCode'
              type='password'
              className='form-control'
              value={formData.authCode}
              onChange={handleInputChange}
              placeholder='輸入授權碼'
              disabled={loading}
            />
          </div>

          {error && (
            <div className='alert alert-danger' role='alert'>
              {error}
            </div>
          )}

          {response && (
            <div className={`alert ${response.success ? 'alert-success' : 'alert-warning'}`} role='alert'>
              <strong>{response.message}</strong>
              {response.data && response.data.length > 0 && (
                <div className='mt-2'>
                  <small>處理了 {response.data.length} 筆記錄</small>
                </div>
              )}
            </div>
          )}

          <button type='submit' className='btn btn-primary w-100' disabled={loading}>
            {loading ? (
              <>
                <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                處理中...
              </>
            ) : (
              '提交'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BenzaitenForm
