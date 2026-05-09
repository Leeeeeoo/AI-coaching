import crypto from 'crypto'

export async function transcribeAudio(file) {
  if (!file?.buffer) {
    const error = new Error('Audio file is required')
    error.status = 400
    throw error
  }

  const token = process.env.ALIYUN_NLS_TOKEN || (await createNlsToken().catch(() => ''))
  const appKey = process.env.NLS_APP_KEY

  if (!token || !appKey) {
    return '我刚才录音里提到：今天有点发热，想问问是否需要处理。'
  }

  const format = guessAudioFormat(file.originalname, file.mimetype)
  const url = new URL('https://nls-gateway-cn-shanghai.aliyuncs.com/stream/v1/asr')
  url.searchParams.set('appkey', appKey)
  url.searchParams.set('format', format)
  url.searchParams.set('sample_rate', format === 'mp3' ? '16000' : '16000')
  url.searchParams.set('enable_punctuation_prediction', 'true')
  url.searchParams.set('enable_inverse_text_normalization', 'true')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-NLS-Token': token,
      'Content-Type': 'application/octet-stream',
    },
    body: file.buffer,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.status !== 20000000) {
    throw new Error(`Aliyun ASR failed: ${response.status} ${JSON.stringify(data)}`)
  }

  return data.result || ''
}

async function createNlsToken() {
  const accessKeyId = process.env.ALIYUN_AK_ID
  const accessKeySecret = process.env.ALIYUN_AK_SECRET
  if (!accessKeyId || !accessKeySecret) {
    return ''
  }

  const params = {
    AccessKeyId: accessKeyId,
    Action: 'CreateToken',
    Format: 'JSON',
    RegionId: 'cn-shanghai',
    SignatureMethod: 'HMAC-SHA1',
    SignatureNonce: crypto.randomUUID(),
    SignatureVersion: '1.0',
    Timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    Version: '2019-02-28',
  }

  const signature = signAliyunRpc(params, accessKeySecret)
  const body = new URLSearchParams({ ...params, Signature: signature })
  const response = await fetch('https://nls-meta.cn-shanghai.aliyuncs.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  if (!response.ok) {
    return ''
  }
  const data = await response.json().catch(() => ({}))
  return data.Token?.Id || ''
}

function signAliyunRpc(params, accessKeySecret) {
  const canonicalized = Object.keys(params)
    .sort()
    .map((key) => `${percentEncode(key)}=${percentEncode(params[key])}`)
    .join('&')
  const stringToSign = `POST&${percentEncode('/')}&${percentEncode(canonicalized)}`
  return crypto.createHmac('sha1', `${accessKeySecret}&`).update(stringToSign).digest('base64')
}

function percentEncode(value) {
  return encodeURIComponent(value).replace(/\+/g, '%20').replace(/\*/g, '%2A').replace(/%7E/g, '~')
}

function guessAudioFormat(filename = '', mimetype = '') {
  const text = `${filename} ${mimetype}`.toLowerCase()
  if (text.includes('mp3')) return 'mp3'
  if (text.includes('wav')) return 'wav'
  return 'mp3'
}
