import { useState } from 'react'
import axios from 'axios'

interface ProcessedEntry {
  date: string
  theme: string
  action?: string
  subject: string
  additionalInfo: string
}

interface FormData {
  prompt: string
  authCode: string
}

interface ApiResponse {
  success: boolean
  message: string
  data?: ProcessedEntry[]
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
    } catch (err: unknown) {
      const error = err as Error
      if (error && 'response' in error) {
        const axiosError = error as { response: { data: ApiResponse } }
        setError(`錯誤: ${axiosError.response.data.error || axiosError.response.data.message || '未知錯誤'}`)
      } else {
        setError(`網路錯誤: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='card bg-secondary-subtle border border-secondary rounded-3 shadow-sm'>
      <div className='card-body'>
        <form onSubmit={handleSubmit} className='d-flex flex-column gap-3'>
          <div>
            <label htmlFor='prompt' className='form-label'>
              提示內容 <span className='text-danger'>*</span>
            </label>
            <textarea
              id='prompt'
              name='prompt'
              className='form-control bg-dark text-light border-secondary'
              rows={4}
              value={formData.prompt}
              onChange={handleInputChange}
              placeholder='輸入你想要記錄的內容...'
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor='authCode' className='form-label'>
              授權碼 <span className='text-danger'>*</span>
            </label>
            <input
              id='authCode'
              name='authCode'
              type='password'
              className='form-control bg-dark text-light border-secondary'
              value={formData.authCode}
              onChange={handleInputChange}
              placeholder='輸入授權碼'
              disabled={loading}
            />
          </div>

          {error && (
            <div className='alert alert-danger py-2 mb-0' role='alert'>
              {error}
            </div>
          )}

          {response && (
            <div className={`alert ${response.success ? 'alert-success' : 'alert-warning'} py-2 mb-0`} role='alert'>
              <strong>{response.message}</strong>
              {response.data && response.data.length > 0 && (
                <div className='mt-1'>
                  <small>處理了 {response.data.length} 筆記錄</small>
                </div>
              )}
            </div>
          )}

          {response && response.success && response.data && response.data.length > 0 && (
            <div className='mt-3'>
              <h6>處理結果：</h6>
              <div className='table-responsive'>
                <table className='table table-dark table-striped table-hover'>
                  <thead>
                    <tr>
                      <th>日期</th>
                      <th>主題</th>
                      <th>動作</th>
                      <th>主旨</th>
                      <th>細節</th>
                    </tr>
                  </thead>
                  <tbody>
                    {response.data.map((item: ProcessedEntry, index: number) => (
                      <tr key={index}>
                        <td>{item.date}</td>
                        <td>{item.theme}</td>
                        <td>{item.action || '-'}</td>
                        <td>{item.subject}</td>
                        <td>{item.additionalInfo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
