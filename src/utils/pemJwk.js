/**
 * PEM to JWK converter (pure JavaScript, client-side only)
 *
 * Supports:
 * - Public Keys: SPKI (RSA, EC P-256/P-384/P-521/secp256k1, Ed25519), PKCS#1 RSA Public Key
 * - Private Keys: PKCS#8 (RSA, EC, Ed25519), PKCS#1 RSA Private Key, SEC1 EC Private Key
 * - Certificates: X.509 Certificates (extracts public key, adds x5c)
 */

export class PemParseError extends Error {
  constructor(message) {
    super(message)
    this.name = 'PemParseError'
  }
}

export const OIDS = {
  RSA_ENCRYPTION: '1.2.840.113549.1.1.1',
  EC_PUBLIC_KEY: '1.2.840.10045.2.1',
  ED25519: '1.3.101.112',
  P_256: '1.2.840.10045.3.1.7',
  P_384: '1.3.132.0.34',
  P_521: '1.3.132.0.35',
  SECP256K1: '1.3.132.0.10'
}

export const EC_CURVES_BY_OID = {
  [OIDS.P_256]: { name: 'P-256', size: 32 },
  [OIDS.P_384]: { name: 'P-384', size: 48 },
  [OIDS.P_521]: { name: 'P-521', size: 66 },
  [OIDS.SECP256K1]: { name: 'secp256k1', size: 32 }
}

/**
 * Base64 string to Uint8Array
 */
export function base64ToBytes(b64) {
  try {
    const cleanB64 = b64.replace(/[\r\n\s]+/g, '')
    const binStr = atob(cleanB64)
    const len = binStr.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binStr.charCodeAt(i)
    }
    return bytes
  } catch (err) {
    throw new PemParseError(
      'Base64データのデコードに失敗しました: ' + err.message
    )
  }
}

/**
 * Uint8Array to Base64URL string (RFC 7515 / 7517)
 */
export function bytesToBase64Url(bytes) {
  let binary = ''
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Remove leading zero bytes from unsigned BigInteger (ASN.1 INTEGER padding)
 */
export function stripLeadingZeros(bytes) {
  let start = 0
  while (start < bytes.length - 1 && bytes[start] === 0) {
    start++
  }
  return bytes.subarray(start)
}

/**
 * Pad byte array with leading zeros to exact length (for EC coordinates and scalar)
 */
export function padToLength(bytes, targetLength) {
  const stripped = stripLeadingZeros(bytes)
  if (stripped.length === targetLength) return stripped
  if (stripped.length > targetLength) {
    return stripped.subarray(stripped.length - targetLength)
  }
  const result = new Uint8Array(targetLength)
  result.set(stripped, targetLength - stripped.length)
  return result
}

/**
 * Parse an ASN.1 DER TLV node
 */
export function parseNode(bytes, offset = 0) {
  const start = offset
  if (offset >= bytes.length) {
    throw new PemParseError('ASN.1データのパース中に終端に達しました')
  }

  const tag = bytes[offset++]
  if (offset >= bytes.length) {
    throw new PemParseError('ASN.1の長さフィールドが不完全です')
  }

  let lengthByte = bytes[offset++]
  let length = 0

  if ((lengthByte & 0x80) === 0) {
    length = lengthByte
  } else {
    const numBytes = lengthByte & 0x7f
    if (numBytes === 0) {
      throw new PemParseError('不定長ASN.1形式はサポートされていません')
    }
    if (offset + numBytes > bytes.length) {
      throw new PemParseError('ASN.1の長さバイトが不完全です')
    }
    for (let i = 0; i < numBytes; i++) {
      length = (length << 8) | bytes[offset++]
    }
  }

  if (offset + length > bytes.length) {
    throw new PemParseError('ASN.1の値の長さがデータの長さを超えています')
  }

  const value = bytes.subarray(offset, offset + length)
  const totalLength = offset + length - start

  return {
    tag,
    length,
    value,
    totalLength,
    rawBytes: bytes.subarray(start, offset + length)
  }
}

/**
 * Parse a DER sequence of nodes
 */
export function parseSequence(bytes) {
  const items = []
  let curr = 0
  while (curr < bytes.length) {
    const node = parseNode(bytes, curr)
    items.push(node)
    curr += node.totalLength
  }
  return items
}

/**
 * Decode DER encoded OID into dotted string (e.g. "1.2.840.113549.1.1.1")
 */
export function decodeOID(bytes) {
  if (bytes.length === 0) return ''
  const parts = [Math.floor(bytes[0] / 40), bytes[0] % 40]
  let val = 0
  for (let i = 1; i < bytes.length; i++) {
    const b = bytes[i]
    val = (val << 7) | (b & 0x7f)
    if ((b & 0x80) === 0) {
      parts.push(val)
      val = 0
    }
  }
  return parts.join('.')
}

/**
 * Extract PEM blocks from text
 */
export function extractPemBlocks(pemString) {
  if (typeof pemString !== 'string' || !pemString.trim()) {
    throw new PemParseError('PEMデータが入力されていません')
  }

  const regex = /-----BEGIN ([A-Z0-9 -]+)-----([\s\S]*?)-----END \1-----/g
  const blocks = []
  let match

  while ((match = regex.exec(pemString)) !== null) {
    const type = match[1].trim()
    const base64Content = match[2].replace(/[\r\n\s]+/g, '')
    if (!base64Content) {
      continue
    }
    const der = base64ToBytes(base64Content)
    blocks.push({
      header: type,
      base64: base64Content,
      der
    })
  }

  if (blocks.length === 0) {
    throw new PemParseError(
      '有効なPEMヘッダー（-----BEGIN ...-----）が見つかりませんでした'
    )
  }

  return blocks
}

/**
 * Parse PKCS#1 RSA Public Key
 */
export function parsePkcs1RsaPublicKey(derBytes) {
  const root = parseNode(derBytes, 0)
  if (root.tag !== 0x30) {
    throw new PemParseError('不正なPKCS#1 RSA公開鍵: SEQUENCEではありません')
  }
  const items = parseSequence(root.value)
  if (items.length < 2 || items[0].tag !== 0x02 || items[1].tag !== 0x02) {
    throw new PemParseError('不正なPKCS#1 RSA公開鍵構造です')
  }

  const modulusBytes = stripLeadingZeros(items[0].value)
  const exponentBytes = stripLeadingZeros(items[1].value)

  return {
    jwk: {
      kty: 'RSA',
      n: bytesToBase64Url(modulusBytes),
      e: bytesToBase64Url(exponentBytes)
    },
    keyInfo: {
      type: 'public',
      format: 'PKCS#1',
      algorithm: 'RSA',
      bitLength: modulusBytes.length * 8,
      isPrivate: false
    }
  }
}

/**
 * Parse PKCS#1 RSA Private Key
 */
export function parsePkcs1RsaPrivateKey(derBytes) {
  const root = parseNode(derBytes, 0)
  if (root.tag !== 0x30) {
    throw new PemParseError('不正なPKCS#1 RSA秘密鍵: SEQUENCEではありません')
  }
  const items = parseSequence(root.value)
  if (items.length < 9) {
    throw new PemParseError(
      '不正なPKCS#1 RSA秘密鍵: フィールド数が不足しています'
    )
  }

  const modulusBytes = stripLeadingZeros(items[1].value)

  return {
    jwk: {
      kty: 'RSA',
      n: bytesToBase64Url(modulusBytes),
      e: bytesToBase64Url(stripLeadingZeros(items[2].value)),
      d: bytesToBase64Url(stripLeadingZeros(items[3].value)),
      p: bytesToBase64Url(stripLeadingZeros(items[4].value)),
      q: bytesToBase64Url(stripLeadingZeros(items[5].value)),
      dp: bytesToBase64Url(stripLeadingZeros(items[6].value)),
      dq: bytesToBase64Url(stripLeadingZeros(items[7].value)),
      qi: bytesToBase64Url(stripLeadingZeros(items[8].value))
    },
    keyInfo: {
      type: 'private',
      format: 'PKCS#1',
      algorithm: 'RSA',
      bitLength: modulusBytes.length * 8,
      isPrivate: true
    }
  }
}

/**
 * Parse SEC1 EC Private Key
 */
export function parseSec1EcPrivateKey(derBytes, fallbackCurveOid = null) {
  const root = parseNode(derBytes, 0)
  if (root.tag !== 0x30) {
    throw new PemParseError('不正なSEC1 EC秘密鍵: SEQUENCEではありません')
  }
  const items = parseSequence(root.value)
  if (items.length < 2 || items[0].tag !== 0x02 || items[1].tag !== 0x04) {
    throw new PemParseError('不正なSEC1 EC秘密鍵構造です')
  }

  const dBytes = items[1].value
  let curveOid = fallbackCurveOid
  let pubBytes = null

  for (let i = 2; i < items.length; i++) {
    const item = items[i]
    if (item.tag === 0xa0) {
      // [0] parameters
      const sub = parseSequence(item.value)
      if (sub.length > 0 && sub[0].tag === 0x06) {
        curveOid = decodeOID(sub[0].value)
      }
    } else if (item.tag === 0xa1) {
      // [1] publicKey
      const sub = parseSequence(item.value)
      if (sub.length > 0 && sub[0].tag === 0x03) {
        // BIT STRING - first byte is unused bits
        pubBytes = sub[0].value.subarray(1)
      }
    }
  }

  if (!curveOid) {
    if (dBytes.length <= 32) curveOid = OIDS.P_256
    else if (dBytes.length <= 48) curveOid = OIDS.P_384
    else if (dBytes.length <= 66) curveOid = OIDS.P_521
    else {
      throw new PemParseError(
        'EC秘密鍵から曲線パラメータを特定できませんでした'
      )
    }
  }

  const curve = EC_CURVES_BY_OID[curveOid]
  if (!curve) {
    throw new PemParseError(`未対応のEC曲線OIDです: ${curveOid}`)
  }

  const jwk = {
    kty: 'EC',
    crv: curve.name,
    d: bytesToBase64Url(padToLength(dBytes, curve.size))
  }

  if (
    pubBytes &&
    pubBytes[0] === 0x04 &&
    pubBytes.length >= 1 + 2 * curve.size
  ) {
    jwk.x = bytesToBase64Url(pubBytes.subarray(1, 1 + curve.size))
    jwk.y = bytesToBase64Url(
      pubBytes.subarray(1 + curve.size, 1 + 2 * curve.size)
    )
  }

  return {
    jwk,
    keyInfo: {
      type: 'private',
      format: 'SEC1',
      algorithm: 'EC',
      curve: curve.name,
      bitLength: curve.size * 8,
      isPrivate: true
    }
  }
}

/**
 * Parse SubjectPublicKeyInfo (SPKI)
 */
export function parseSpki(derBytes) {
  const root = parseNode(derBytes, 0)
  if (root.tag !== 0x30) {
    throw new PemParseError('不正なSPKI公開鍵: SEQUENCEではありません')
  }
  const items = parseSequence(root.value)
  if (items.length < 2 || items[0].tag !== 0x30 || items[1].tag !== 0x03) {
    throw new PemParseError('不正なSPKI公開鍵構造です')
  }

  const algSeq = parseSequence(items[0].value)
  if (algSeq.length < 1 || algSeq[0].tag !== 0x06) {
    throw new PemParseError('SPKIのAlgorithmIdentifierが無効です')
  }
  const algOid = decodeOID(algSeq[0].value)

  // subjectPublicKey is BIT STRING (first byte is unused bits)
  const bitStringVal = items[1].value
  if (bitStringVal.length < 1) {
    throw new PemParseError('SPKIの公開鍵データが空です')
  }
  const pubKeyBytes = bitStringVal.subarray(1)

  // 1. RSA
  if (algOid === OIDS.RSA_ENCRYPTION) {
    const parsed = parsePkcs1RsaPublicKey(pubKeyBytes)
    parsed.keyInfo.format = 'SPKI'
    return parsed
  }

  // 2. EC
  if (algOid === OIDS.EC_PUBLIC_KEY) {
    if (algSeq.length < 2 || algSeq[1].tag !== 0x06) {
      throw new PemParseError('EC公開鍵の曲線パラメータが見つかりません')
    }
    const curveOid = decodeOID(algSeq[1].value)
    const curve = EC_CURVES_BY_OID[curveOid]
    if (!curve) {
      throw new PemParseError(`未対応のEC曲線OIDです: ${curveOid}`)
    }
    if (pubKeyBytes[0] !== 0x04) {
      throw new PemParseError('非圧縮形式のEC公開鍵のみサポートしています')
    }
    const expectedCoordLen = curve.size
    if (pubKeyBytes.length < 1 + 2 * expectedCoordLen) {
      throw new PemParseError(`EC公開鍵のデータ長が不正です (${curve.name})`)
    }
    const x = pubKeyBytes.subarray(1, 1 + expectedCoordLen)
    const y = pubKeyBytes.subarray(
      1 + expectedCoordLen,
      1 + 2 * expectedCoordLen
    )
    return {
      jwk: {
        kty: 'EC',
        crv: curve.name,
        x: bytesToBase64Url(x),
        y: bytesToBase64Url(y)
      },
      keyInfo: {
        type: 'public',
        format: 'SPKI',
        algorithm: 'EC',
        curve: curve.name,
        bitLength: curve.size * 8,
        isPrivate: false
      }
    }
  }

  // 3. Ed25519
  if (algOid === OIDS.ED25519) {
    if (pubKeyBytes.length !== 32) {
      throw new PemParseError('Ed25519公開鍵の長さが不正です')
    }
    return {
      jwk: {
        kty: 'OKP',
        crv: 'Ed25519',
        x: bytesToBase64Url(pubKeyBytes)
      },
      keyInfo: {
        type: 'public',
        format: 'SPKI',
        algorithm: 'OKP',
        curve: 'Ed25519',
        bitLength: 256,
        isPrivate: false
      }
    }
  }

  throw new PemParseError(`未対応の公開鍵アルゴリズムOIDです: ${algOid}`)
}

/**
 * Parse PKCS#8 PrivateKeyInfo
 */
export function parsePkcs8(derBytes) {
  const root = parseNode(derBytes, 0)
  if (root.tag !== 0x30) {
    throw new PemParseError('不正なPKCS#8秘密鍵: SEQUENCEではありません')
  }
  const items = parseSequence(root.value)
  if (
    items.length < 3 ||
    items[0].tag !== 0x02 ||
    items[1].tag !== 0x30 ||
    items[2].tag !== 0x04
  ) {
    throw new PemParseError('不正なPKCS#8秘密鍵構造です')
  }

  const algSeq = parseSequence(items[1].value)
  if (algSeq.length < 1 || algSeq[0].tag !== 0x06) {
    throw new PemParseError('PKCS#8のAlgorithmIdentifierが無効です')
  }
  const algOid = decodeOID(algSeq[0].value)
  const privKeyBytes = items[2].value

  // 1. RSA
  if (algOid === OIDS.RSA_ENCRYPTION) {
    const parsed = parsePkcs1RsaPrivateKey(privKeyBytes)
    parsed.keyInfo.format = 'PKCS#8'
    return parsed
  }

  // 2. EC
  if (algOid === OIDS.EC_PUBLIC_KEY) {
    let curveOid = null
    if (algSeq.length >= 2 && algSeq[1].tag === 0x06) {
      curveOid = decodeOID(algSeq[1].value)
    }
    const parsed = parseSec1EcPrivateKey(privKeyBytes, curveOid)
    parsed.keyInfo.format = 'PKCS#8'
    return parsed
  }

  // 3. Ed25519
  if (algOid === OIDS.ED25519) {
    let rawPriv = privKeyBytes
    if (
      privKeyBytes.length === 34 &&
      privKeyBytes[0] === 0x04 &&
      privKeyBytes[1] === 32
    ) {
      rawPriv = privKeyBytes.subarray(2)
    }
    return {
      jwk: {
        kty: 'OKP',
        crv: 'Ed25519',
        d: bytesToBase64Url(rawPriv)
      },
      keyInfo: {
        type: 'private',
        format: 'PKCS#8',
        algorithm: 'OKP',
        curve: 'Ed25519',
        bitLength: 256,
        isPrivate: true
      }
    }
  }

  throw new PemParseError(`未対応の秘密鍵アルゴリズムOIDです: ${algOid}`)
}

/**
 * Parse X.509 Certificate
 */
export function parseCertificate(derBytes, rawBase64 = null) {
  const root = parseNode(derBytes, 0)
  if (root.tag !== 0x30) {
    throw new PemParseError('不正なX.509証明書: SEQUENCEではありません')
  }
  const certItems = parseSequence(root.value)
  if (certItems.length < 3 || certItems[0].tag !== 0x30) {
    throw new PemParseError('不正なX.509証明書構造です')
  }

  const tbsItems = parseSequence(certItems[0].value)
  let spkiNode = null
  for (const item of tbsItems) {
    if (item.tag === 0x30) {
      const sub = parseSequence(item.value)
      if (sub.length === 2 && sub[0].tag === 0x30 && sub[1].tag === 0x03) {
        const algSub = parseSequence(sub[0].value)
        if (algSub.length >= 1 && algSub[0].tag === 0x06) {
          spkiNode = item
          break
        }
      }
    }
  }

  if (!spkiNode) {
    throw new PemParseError(
      'X.509証明書内にSubjectPublicKeyInfoが見つかりませんでした'
    )
  }

  const parsed = parseSpki(spkiNode.rawBytes)
  parsed.keyInfo.type = 'certificate'
  parsed.keyInfo.format = 'X.509'

  if (rawBase64) {
    parsed.jwk.x5c = [rawBase64]
  }

  return parsed
}

/**
 * Convert a single PEM block to JWK
 */
export function convertBlock(block) {
  const header = block.header.toUpperCase()
  switch (header) {
    case 'PUBLIC KEY':
      return parseSpki(block.der)
    case 'RSA PUBLIC KEY':
      return parsePkcs1RsaPublicKey(block.der)
    case 'PRIVATE KEY':
      return parsePkcs8(block.der)
    case 'RSA PRIVATE KEY':
      return parsePkcs1RsaPrivateKey(block.der)
    case 'EC PRIVATE KEY':
      return parseSec1EcPrivateKey(block.der)
    case 'CERTIFICATE':
    case 'X509 CERTIFICATE':
      return parseCertificate(block.der, block.base64)
    default:
      throw new PemParseError(
        `未対応のPEMタイプです: -----BEGIN ${block.header}-----`
      )
  }
}

/**
 * Convert PEM string to JWK (first block)
 * @param {string} pemString
 * @returns {{ jwk: object, keyInfo: object }}
 */
export function pemToJwk(pemString) {
  const blocks = extractPemBlocks(pemString)
  return convertBlock(blocks[0])
}

/**
 * Convert PEM string containing multiple blocks to JWK Set (JWKS)
 * @param {string} pemString
 * @returns {{ keys: object[], details: object[] }}
 */
export function pemToJwks(pemString) {
  const blocks = extractPemBlocks(pemString)
  const keys = []
  const details = []

  for (const block of blocks) {
    const res = convertBlock(block)
    keys.push(res.jwk)
    details.push(res.keyInfo)
  }

  return { keys, details }
}
