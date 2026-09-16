/**
 * PEMからJWKへの変換ユーティリティのユニットテスト
 */

import crypto from 'crypto'
import {
  pemToJwk,
  pemToJwks,
  PemParseError,
  base64ToBytes,
  bytesToBase64Url,
  bytesToBigInt,
  stripLeadingZeros,
  padToLength,
  parseNode,
  decodeOID
} from '@/utils/pemJwk'

describe('pemJwk utility', () => {
  describe('Helper functions', () => {
    /**
     * bytesToBase64Urlがバイト配列を正しくBase64URL文字列へ変換することを検証
     */
    it('bytesToBase64Url converts bytes correctly', () => {
      const bytes = new Uint8Array([0xfb, 0xff, 0xfe])
      const b64url = bytesToBase64Url(bytes)
      expect(b64url).toBe('-_-_'.slice(0, 0) + '-__-')
    })

    /**
     * base64ToBytesが不正なBase64文字列に対してエラーを送出することを検証
     */
    it('base64ToBytes throws on invalid base64', () => {
      expect(() => base64ToBytes('@@@@@@')).toThrow(PemParseError)
    })

    /**
     * bytesToBigIntがバイト配列を正しくBigIntへ変換することを検証
     */
    it('bytesToBigInt converts byte array to BigInt correctly', () => {
      expect(bytesToBigInt(new Uint8Array([]))).toBe(0n)
      expect(bytesToBigInt(new Uint8Array([0x01]))).toBe(1n)
      expect(bytesToBigInt(new Uint8Array([0x01, 0x02]))).toBe(0x0102n)
      expect(bytesToBigInt(new Uint8Array([0x00, 0x05]))).toBe(5n)
    })

    /**
     * stripLeadingZerosが先頭の冗長なゼロバイトを除去することを検証
     */
    it('stripLeadingZeros strips leading zeros', () => {
      const arr = new Uint8Array([0, 0, 1, 2])
      expect(stripLeadingZeros(arr)).toEqual(new Uint8Array([1, 2]))

      const allZeros = new Uint8Array([0, 0, 0])
      expect(stripLeadingZeros(allZeros)).toEqual(new Uint8Array([0]))
    })

    /**
     * padToLengthが必要に応じてゼロパディングまたは切り詰めを行うことを検証
     */
    it('padToLength pads or truncates appropriately', () => {
      const shortArr = new Uint8Array([1, 2])
      expect(padToLength(shortArr, 4)).toEqual(new Uint8Array([0, 0, 1, 2]))

      const exactArr = new Uint8Array([1, 2, 3, 4])
      expect(padToLength(exactArr, 4)).toEqual(exactArr)

      const longArr = new Uint8Array([0, 1, 2, 3, 4])
      expect(padToLength(longArr, 4)).toEqual(exactArr)
    })

    /**
     * decodeOIDが空バイト配列に対して空文字列を返すことを検証
     */
    it('decodeOID decodes empty bytes to empty string', () => {
      expect(decodeOID(new Uint8Array([]))).toBe('')
    })

    /**
     * parseNodeが不正なASN.1形式に対して適切にエラーを送出することを検証
     */
    it('parseNode error handling', () => {
      expect(() => parseNode(new Uint8Array([]), 0)).toThrow(
        'ASN.1データのパース中に終端に達しました'
      )
      expect(() => parseNode(new Uint8Array([0x30]), 0)).toThrow(
        'ASN.1の長さフィールドが不完全です'
      )
      // 不定長 (0x80)
      expect(() => parseNode(new Uint8Array([0x30, 0x80]), 0)).toThrow(
        '不定長ASN.1形式はサポートされていません'
      )
      // 長さバイトの不足（0x82は2バイト長を示すが1バイトのみ提供）
      expect(() => parseNode(new Uint8Array([0x30, 0x82, 0x01]), 0)).toThrow(
        'ASN.1の長さバイトが不完全です'
      )
      // データ長超過
      expect(() => parseNode(new Uint8Array([0x30, 0x05, 0x01]), 0)).toThrow(
        'ASN.1の値の長さがデータの長さを超えています'
      )
    })
  })

  describe('RSA Keys', () => {
    let rsaKey
    let rsaPubSpkiPem
    let rsaPrivPkcs8Pem
    let rsaPubPkcs1Pem
    let rsaPrivPkcs1Pem
    let nodePubJwk
    let nodePrivJwk

    beforeAll(() => {
      rsaKey = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
      rsaPubSpkiPem = rsaKey.publicKey.export({ type: 'spki', format: 'pem' })
      rsaPrivPkcs8Pem = rsaKey.privateKey.export({
        type: 'pkcs8',
        format: 'pem'
      })
      rsaPubPkcs1Pem = rsaKey.publicKey.export({ type: 'pkcs1', format: 'pem' })
      rsaPrivPkcs1Pem = rsaKey.privateKey.export({
        type: 'pkcs1',
        format: 'pem'
      })
      nodePubJwk = rsaKey.publicKey.export({ format: 'jwk' })
      nodePrivJwk = rsaKey.privateKey.export({ format: 'jwk' })
    })

    /**
     * RSA SPKI公開鍵を正しくJWKへ変換することを検証
     */
    it('converts RSA SPKI Public Key to JWK', () => {
      const res = pemToJwk(rsaPubSpkiPem)
      expect(res.jwk.kty).toBe('RSA')
      expect(res.jwk.n).toBe(nodePubJwk.n)
      expect(res.jwk.e).toBe(nodePubJwk.e)
      expect(res.keyInfo.format).toBe('SPKI')
      expect(res.keyInfo.algorithm).toBe('RSA')
      expect(res.keyInfo.type).toBe('public')
      expect(res.keyInfo.isPrivate).toBe(false)
      expect(res.keyInfo.bitLength).toBe(2048)
    })

    /**
     * RSA PKCS#1公開鍵を正しくJWKへ変換することを検証
     */
    it('converts RSA PKCS#1 Public Key to JWK', () => {
      const res = pemToJwk(rsaPubPkcs1Pem)
      expect(res.jwk.kty).toBe('RSA')
      expect(res.jwk.n).toBe(nodePubJwk.n)
      expect(res.jwk.e).toBe(nodePubJwk.e)
      expect(res.keyInfo.format).toBe('PKCS#1')
      expect(res.keyInfo.algorithm).toBe('RSA')
      expect(res.keyInfo.type).toBe('public')
      expect(res.keyInfo.isPrivate).toBe(false)
    })

    /**
     * RSA PKCS#8秘密鍵を正しくJWKへ変換することを検証
     */
    it('converts RSA PKCS#8 Private Key to JWK', () => {
      const res = pemToJwk(rsaPrivPkcs8Pem)
      expect(res.jwk.kty).toBe('RSA')
      expect(res.jwk.n).toBe(nodePrivJwk.n)
      expect(res.jwk.e).toBe(nodePrivJwk.e)
      expect(res.jwk.d).toBe(nodePrivJwk.d)
      expect(res.jwk.p).toBe(nodePrivJwk.p)
      expect(res.jwk.q).toBe(nodePrivJwk.q)
      expect(res.jwk.dp).toBe(nodePrivJwk.dp)
      expect(res.jwk.dq).toBe(nodePrivJwk.dq)
      expect(res.jwk.qi).toBe(nodePrivJwk.qi)
      expect(res.keyInfo.format).toBe('PKCS#8')
      expect(res.keyInfo.algorithm).toBe('RSA')
      expect(res.keyInfo.type).toBe('private')
      expect(res.keyInfo.isPrivate).toBe(true)
    })

    /**
     * RSA PKCS#1秘密鍵を正しくJWKへ変換することを検証
     */
    it('converts RSA PKCS#1 Private Key to JWK', () => {
      const res = pemToJwk(rsaPrivPkcs1Pem)
      expect(res.jwk.kty).toBe('RSA')
      expect(res.jwk.n).toBe(nodePrivJwk.n)
      expect(res.jwk.e).toBe(nodePrivJwk.e)
      expect(res.jwk.d).toBe(nodePrivJwk.d)
      expect(res.keyInfo.format).toBe('PKCS#1')
      expect(res.keyInfo.isPrivate).toBe(true)
    })
  })

  describe('EC Keys', () => {
    const curves = [
      { name: 'prime256v1', crv: 'P-256' },
      { name: 'secp384r1', crv: 'P-384' }
    ]

    curves.forEach(({ name, crv }) => {
      describe(`Curve ${crv}`, () => {
        let ecKey
        let spkiPem
        let pkcs8Pem
        let sec1Pem
        let nodePubJwk
        let nodePrivJwk

        beforeAll(() => {
          ecKey = crypto.generateKeyPairSync('ec', { namedCurve: name })
          spkiPem = ecKey.publicKey.export({ type: 'spki', format: 'pem' })
          pkcs8Pem = ecKey.privateKey.export({ type: 'pkcs8', format: 'pem' })
          sec1Pem = ecKey.privateKey.export({ type: 'sec1', format: 'pem' })
          nodePubJwk = ecKey.publicKey.export({ format: 'jwk' })
          nodePrivJwk = ecKey.privateKey.export({ format: 'jwk' })
        })

        /**
         * EC SPKI公開鍵を正しくJWKへ変換することを検証
         */
        it('converts EC SPKI Public Key to JWK', () => {
          const res = pemToJwk(spkiPem)
          expect(res.jwk.kty).toBe('EC')
          expect(res.jwk.crv).toBe(crv)
          expect(res.jwk.x).toBe(nodePubJwk.x)
          expect(res.jwk.y).toBe(nodePubJwk.y)
          expect(res.keyInfo.algorithm).toBe('EC')
          expect(res.keyInfo.curve).toBe(crv)
          expect(res.keyInfo.type).toBe('public')
        })

        /**
         * EC PKCS#8秘密鍵を正しくJWKへ変換することを検証
         */
        it('converts EC PKCS#8 Private Key to JWK', () => {
          const res = pemToJwk(pkcs8Pem)
          expect(res.jwk.kty).toBe('EC')
          expect(res.jwk.crv).toBe(crv)
          expect(res.jwk.d).toBe(nodePrivJwk.d)
          expect(res.jwk.x).toBe(nodePrivJwk.x)
          expect(res.jwk.y).toBe(nodePrivJwk.y)
          expect(res.keyInfo.algorithm).toBe('EC')
          expect(res.keyInfo.isPrivate).toBe(true)
        })

        /**
         * EC SEC1秘密鍵を正しくJWKへ変換することを検証
         */
        it('converts EC SEC1 Private Key to JWK', () => {
          const res = pemToJwk(sec1Pem)
          expect(res.jwk.kty).toBe('EC')
          expect(res.jwk.crv).toBe(crv)
          expect(res.jwk.d).toBe(nodePrivJwk.d)
          expect(res.jwk.x).toBe(nodePrivJwk.x)
          expect(res.jwk.y).toBe(nodePrivJwk.y)
          expect(res.keyInfo.format).toBe('SEC1')
        })
      })
    })
  })

  describe('Ed25519 Keys', () => {
    let edKey
    let spkiPem
    let pkcs8Pem
    let nodePubJwk
    let nodePrivJwk

    beforeAll(() => {
      edKey = crypto.generateKeyPairSync('ed25519')
      spkiPem = edKey.publicKey.export({ type: 'spki', format: 'pem' })
      pkcs8Pem = edKey.privateKey.export({ type: 'pkcs8', format: 'pem' })
      nodePubJwk = edKey.publicKey.export({ format: 'jwk' })
      nodePrivJwk = edKey.privateKey.export({ format: 'jwk' })
    })

    /**
     * Ed25519 SPKI公開鍵を正しくJWKへ変換することを検証
     */
    it('converts Ed25519 SPKI Public Key to JWK', () => {
      const res = pemToJwk(spkiPem)
      expect(res.jwk.kty).toBe('OKP')
      expect(res.jwk.crv).toBe('Ed25519')
      expect(res.jwk.x).toBe(nodePubJwk.x)
      expect(res.keyInfo.algorithm).toBe('OKP')
      expect(res.keyInfo.type).toBe('public')
    })

    /**
     * Ed25519 PKCS#8秘密鍵を正しくJWKへ変換することを検証
     */
    it('converts Ed25519 PKCS#8 Private Key to JWK', () => {
      const res = pemToJwk(pkcs8Pem)
      expect(res.jwk.kty).toBe('OKP')
      expect(res.jwk.crv).toBe('Ed25519')
      expect(res.jwk.d).toBe(nodePrivJwk.d)
      expect(res.keyInfo.algorithm).toBe('OKP')
      expect(res.keyInfo.isPrivate).toBe(true)
    })
  })

  describe('X.509 Certificate', () => {
    /**
     * 自己署名証明書から公開鍵を正しく抽出しJWKへ変換することを検証
     */
    it('extracts public key from self-signed certificate', () => {
      // ダミーの証明書を生成
      const rsa = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
      const spkiDer = rsa.publicKey.export({ type: 'spki', format: 'der' })

      // SPKIをラップした簡易X.509証明書のDER構造を生成
      // Certificate ::= SEQUENCE { TBSCertificate, AlgorithmIdentifier, BIT STRING }
      // TBSCertificate ::= SEQUENCE { version, serialNumber, signature, issuer, validity, subject, SPKI }
      const version = new Uint8Array([0xa0, 0x03, 0x02, 0x01, 0x02]) // バージョン3 (v3)
      const serial = new Uint8Array([0x02, 0x01, 0x01])
      const sigAlg = new Uint8Array([
        0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01,
        0x0b, 0x05, 0x00
      ]) // sha256WithRSAEncryption
      const issuer = new Uint8Array([0x30, 0x00])
      const validity = new Uint8Array([
        0x30, 0x1e, 0x17, 0x0d, 0x32, 0x30, 0x30, 0x31, 0x30, 0x31, 0x30, 0x30,
        0x30, 0x30, 0x30, 0x30, 0x5a, 0x17, 0x0d, 0x33, 0x30, 0x30, 0x31, 0x30,
        0x31, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x5a
      ])
      const subject = new Uint8Array([0x30, 0x00])

      const tbsContent = Buffer.concat([
        version,
        serial,
        sigAlg,
        issuer,
        validity,
        subject,
        spkiDer
      ])
      const tbsLengthBytes =
        tbsContent.length < 128
          ? [tbsContent.length]
          : [0x82, tbsContent.length >> 8, tbsContent.length & 0xff]
      const tbs = Buffer.concat([
        Buffer.from([0x30, ...tbsLengthBytes]),
        tbsContent
      ])

      const certSig = new Uint8Array([0x03, 0x03, 0x00, 0x12, 0x34])
      const certContent = Buffer.concat([tbs, sigAlg, certSig])
      const certLengthBytes =
        certContent.length < 128
          ? [certContent.length]
          : [0x82, certContent.length >> 8, certContent.length & 0xff]
      const certDer = Buffer.concat([
        Buffer.from([0x30, ...certLengthBytes]),
        certContent
      ])

      const certB64 = certDer.toString('base64')
      const certPem = `-----BEGIN CERTIFICATE-----\n${certB64}\n-----END CERTIFICATE-----`

      const res = pemToJwk(certPem)
      const nodeJwk = rsa.publicKey.export({ format: 'jwk' })
      expect(res.jwk.kty).toBe('RSA')
      expect(res.jwk.n).toBe(nodeJwk.n)
      expect(res.jwk.e).toBe(nodeJwk.e)
      expect(res.jwk.x5c).toEqual([certB64])
      expect(res.keyInfo.type).toBe('certificate')
      expect(res.keyInfo.format).toBe('X.509')
    })
  })

  describe('Multiple PEM blocks (JWKS)', () => {
    /**
     * 複数のPEMブロックをJWKS形式へ正しく変換することを検証
     */
    it('converts multiple PEM blocks to JWKS', () => {
      const rsa = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
      const ec = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' })

      const rsaPem = rsa.publicKey.export({ type: 'spki', format: 'pem' })
      const ecPem = ec.publicKey.export({ type: 'spki', format: 'pem' })

      const combinedPem = `${rsaPem}\n${ecPem}`
      const jwks = pemToJwks(combinedPem)

      expect(jwks.keys).toHaveLength(2)
      expect(jwks.keys[0].kty).toBe('RSA')
      expect(jwks.keys[1].kty).toBe('EC')
      expect(jwks.details).toHaveLength(2)
    })
  })

  describe('Error handling', () => {
    /**
     * PEM文字列が空または無効な場合にエラーを送出することを検証
     */
    it('throws when PEM string is empty or invalid', () => {
      expect(() => pemToJwk('')).toThrow('PEMデータが入力されていません')
      expect(() => pemToJwk(null)).toThrow('PEMデータが入力されていません')
      expect(() => pemToJwk('some plain string')).toThrow(
        '有効なPEMヘッダー（-----BEGIN ...-----）が見つかりませんでした'
      )
    })

    /**
     * 未対応のPEMタイプが渡された場合にエラーを送出することを検証
     */
    it('throws when unsupported PEM type is given', () => {
      const unsupported =
        '-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIB\n-----END ENCRYPTED PRIVATE KEY-----'
      expect(() => pemToJwk(unsupported)).toThrow('未対応のPEMタイプです')
    })

    /**
     * PKCS#1 RSA公開鍵の構造が不正な場合にエラーを送出することを検証
     */
    it('throws when PKCS#1 RSA Public Key is invalid', () => {
      // SEQUENCEではない
      const invalidDer = new Uint8Array([0x02, 0x01, 0x00])
      const b64 = Buffer.from(invalidDer).toString('base64')
      const pem = `-----BEGIN RSA PUBLIC KEY-----\n${b64}\n-----END RSA PUBLIC KEY-----`
      expect(() => pemToJwk(pem)).toThrow('SEQUENCEではありません')
    })

    /**
     * SPKI構造が不完全な場合にエラーを送出することを検証
     */
    it('throws when SPKI structure is incomplete', () => {
      const emptySeq = new Uint8Array([0x30, 0x00])
      const b64 = Buffer.from(emptySeq).toString('base64')
      const pem = `-----BEGIN PUBLIC KEY-----\n${b64}\n-----END PUBLIC KEY-----`
      expect(() => pemToJwk(pem)).toThrow('不正なSPKI公開鍵構造です')
    })

    /**
     * 未対応のEC曲線OIDが指定された場合にエラーを送出することを検証
     */
    it('throws when EC curve is unknown', () => {
      // 未対応の曲線OID 1.2.3.4 を持つEC SPKI
      const algSeq = Buffer.from([
        0x30, 0x09, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01
      ]) // EC公開鍵OID
      const spkiDer = Buffer.concat([
        Buffer.from([0x30, 0x15]),
        algSeq,
        Buffer.from([0x03, 0x08, 0x00, 0x04, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06])
      ])
      const pem = `-----BEGIN PUBLIC KEY-----\n${spkiDer.toString('base64')}\n-----END PUBLIC KEY-----`
      expect(() => pemToJwk(pem)).toThrow()
    })
  })

  describe('Edge cases and thorough error handling', () => {
    /**
     * PKCS#1 RSA秘密鍵のタグまたは構造が不正な場合にエラーを送出することを検証
     */
    it('throws when PKCS#1 RSA Private Key has invalid tag or structure', () => {
      const nonSeq = new Uint8Array([0x02, 0x01, 0x00])
      expect(() =>
        pemToJwk(
          `-----BEGIN RSA PRIVATE KEY-----\n${Buffer.from(nonSeq).toString('base64')}\n-----END RSA PRIVATE KEY-----`
        )
      ).toThrow('SEQUENCEではありません')

      const shortSeq = new Uint8Array([0x30, 0x03, 0x02, 0x01, 0x00])
      expect(() =>
        pemToJwk(
          `-----BEGIN RSA PRIVATE KEY-----\n${Buffer.from(shortSeq).toString('base64')}\n-----END RSA PRIVATE KEY-----`
        )
      ).toThrow('フィールド数が不足しています')
    })

    /**
     * SEC1形式のEC秘密鍵のタグまたは構造が不正な場合にエラーを送出することを検証
     */
    it('throws when SEC1 EC Private Key has invalid tag or structure', () => {
      const nonSeq = new Uint8Array([0x02, 0x01, 0x00])
      expect(() =>
        pemToJwk(
          `-----BEGIN EC PRIVATE KEY-----\n${Buffer.from(nonSeq).toString('base64')}\n-----END EC PRIVATE KEY-----`
        )
      ).toThrow('SEQUENCEではありません')

      const invalidSeq = new Uint8Array([0x30, 0x03, 0x02, 0x01, 0x00])
      expect(() =>
        pemToJwk(
          `-----BEGIN EC PRIVATE KEY-----\n${Buffer.from(invalidSeq).toString('base64')}\n-----END EC PRIVATE KEY-----`
        )
      ).toThrow('不正なSEC1 EC秘密鍵構造です')
    })

    /**
     * SEC1形式のEC秘密鍵に曲線パラメータが含まれない場合にエラーを送出することを検証
     */
    it('throws when SEC1 EC Private Key has no curve parameters', () => {
      // 曲線パラメータを持たない32バイト秘密鍵
      const priv = new Uint8Array(32)
      const sec1Body = Buffer.concat([
        Buffer.from([0x02, 0x01, 0x01, 0x04, 0x20]),
        priv
      ])
      const sec1Der = Buffer.concat([
        Buffer.from([0x30, sec1Body.length]),
        sec1Body
      ])
      expect(() =>
        pemToJwk(
          `-----BEGIN EC PRIVATE KEY-----\n${sec1Der.toString('base64')}\n-----END EC PRIVATE KEY-----`
        )
      ).toThrow('EC秘密鍵から曲線パラメータを特定できませんでした')
    })

    /**
     * SEC1形式のEC秘密鍵のスカラー長が曲線サイズを超える場合にエラーを送出することを検証
     */
    it('throws when SEC1 EC Private Key scalar length exceeds curve size', () => {
      const priv33 = Buffer.alloc(33, 1)
      const sec1Param = Buffer.from([
        0xa0, 0x0a, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07
      ])
      const sec1Body = Buffer.concat([
        Buffer.from([0x02, 0x01, 0x01, 0x04, 0x21]),
        priv33,
        sec1Param
      ])
      const sec1Der = Buffer.concat([
        Buffer.from([0x30, sec1Body.length]),
        sec1Body
      ])
      expect(() =>
        pemToJwk(
          `-----BEGIN EC PRIVATE KEY-----\n${sec1Der.toString('base64')}\n-----END EC PRIVATE KEY-----`
        )
      ).toThrow('EC秘密鍵のスカラー長が不正です (P-256)')
    })

    /**
     * SEC1形式のEC秘密鍵のスカラー値が0の場合にエラーを送出することを検証
     */
    it('throws when SEC1 EC Private Key scalar is zero', () => {
      // 32バイトのゼロスカラー
      const privZero = Buffer.alloc(32, 0)
      const sec1Param = Buffer.from([
        0xa0, 0x0a, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07
      ])
      const sec1Body = Buffer.concat([
        Buffer.from([0x02, 0x01, 0x01, 0x04, 0x20]),
        privZero,
        sec1Param
      ])
      const sec1Der = Buffer.concat([
        Buffer.from([0x30, sec1Body.length]),
        sec1Body
      ])
      expect(() =>
        pemToJwk(
          `-----BEGIN EC PRIVATE KEY-----\n${sec1Der.toString('base64')}\n-----END EC PRIVATE KEY-----`
        )
      ).toThrow('EC秘密鍵のスカラー値が不正です (P-256)')
    })

    /**
     * SEC1形式のEC秘密鍵のスカラー値が位数以上の場合にエラーを送出することを検証
     */
    it('throws when SEC1 EC Private Key scalar is greater than or equal to curve order', () => {
      // P-256の位数 n (d = n)
      const p256OrderHex =
        'ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551'
      const privOrder = Buffer.from(p256OrderHex, 'hex')
      const sec1Param = Buffer.from([
        0xa0, 0x0a, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07
      ])
      const sec1Body = Buffer.concat([
        Buffer.from([0x02, 0x01, 0x01, 0x04, 0x20]),
        privOrder,
        sec1Param
      ])
      const sec1Der = Buffer.concat([
        Buffer.from([0x30, sec1Body.length]),
        sec1Body
      ])
      expect(() =>
        pemToJwk(
          `-----BEGIN EC PRIVATE KEY-----\n${sec1Der.toString('base64')}\n-----END EC PRIVATE KEY-----`
        )
      ).toThrow('EC秘密鍵のスカラー値が不正です (P-256)')

      // 位数より大きいスカラー値（全バイト0xff）
      const privAllFf = Buffer.alloc(32, 0xff)
      const sec1BodyFf = Buffer.concat([
        Buffer.from([0x02, 0x01, 0x01, 0x04, 0x20]),
        privAllFf,
        sec1Param
      ])
      const sec1DerFf = Buffer.concat([
        Buffer.from([0x30, sec1BodyFf.length]),
        sec1BodyFf
      ])
      expect(() =>
        pemToJwk(
          `-----BEGIN EC PRIVATE KEY-----\n${sec1DerFf.toString('base64')}\n-----END EC PRIVATE KEY-----`
        )
      ).toThrow('EC秘密鍵のスカラー値が不正です (P-256)')
    })

    /**
     * SEC1形式のEC秘密鍵の公開点形式またはデータ長が不正な場合にエラーを送出することを検証
     */
    it('throws when SEC1 EC Private Key has invalid public point format or length', () => {
      const priv32 = Buffer.alloc(32, 1)
      const sec1Param = Buffer.from([
        0xa0, 0x0a, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07
      ])
      // 圧縮公開点（0x04ではなく0x02で開始）
      const badPub = Buffer.from([0xa1, 0x05, 0x03, 0x03, 0x00, 0x02, 0x01])
      const sec1Body = Buffer.concat([
        Buffer.from([0x02, 0x01, 0x01, 0x04, 0x20]),
        priv32,
        sec1Param,
        badPub
      ])
      const sec1Der = Buffer.concat([
        Buffer.from([0x30, sec1Body.length]),
        sec1Body
      ])
      expect(() =>
        pemToJwk(
          `-----BEGIN EC PRIVATE KEY-----\n${sec1Der.toString('base64')}\n-----END EC PRIVATE KEY-----`
        )
      ).toThrow('EC公開点の形式またはデータ長が不正です (P-256)')
    })

    /**
     * SPKIがSEQUENCEでない、またはアルゴリズム識別子が無効な場合にエラーを送出することを検証
     */
    it('throws when SPKI is not a sequence or has invalid algorithm identifier', () => {
      const nonSeq = new Uint8Array([0x02, 0x01, 0x00])
      expect(() =>
        pemToJwk(
          `-----BEGIN PUBLIC KEY-----\n${Buffer.from(nonSeq).toString('base64')}\n-----END PUBLIC KEY-----`
        )
      ).toThrow('SEQUENCEではありません')

      const badAlg = Buffer.from([
        0x30, 0x0c, 0x30, 0x02, 0x02, 0x00, 0x03, 0x06, 0x00, 0x01, 0x02, 0x03,
        0x04, 0x05
      ])
      expect(() =>
        pemToJwk(
          `-----BEGIN PUBLIC KEY-----\n${badAlg.toString('base64')}\n-----END PUBLIC KEY-----`
        )
      ).toThrow('SPKIのAlgorithmIdentifierが無効です')
    })

    /**
     * SPKIの公開鍵ビット列が空の場合にエラーを送出することを検証
     */
    it('throws when SPKI has empty bit string', () => {
      const emptyBitString = Buffer.from([
        0x30, 0x08, 0x30, 0x04, 0x06, 0x02, 0x2a, 0x01, 0x03, 0x00
      ])
      expect(() =>
        pemToJwk(
          `-----BEGIN PUBLIC KEY-----\n${emptyBitString.toString('base64')}\n-----END PUBLIC KEY-----`
        )
      ).toThrow('SPKIの公開鍵データが空です')
    })

    /**
     * EC SPKIに曲線OIDが存在しない場合にエラーを送出することを検証
     */
    it('throws when EC SPKI is missing curve OID', () => {
      const ecSpkiCompressed = Buffer.from([
        0x30, 0x16, 0x30, 0x09, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02,
        0x01, 0x03, 0x09, 0x00, 0x02, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07
      ]) // 曲線OIDを持たないECアルゴリズム識別子
      expect(() =>
        pemToJwk(
          `-----BEGIN PUBLIC KEY-----\n${ecSpkiCompressed.toString('base64')}\n-----END PUBLIC KEY-----`
        )
      ).toThrow('EC公開鍵の曲線パラメータが見つかりません')
    })

    /**
     * EC SPKIが圧縮点形式を使用している場合にエラーを送出することを検証
     */
    it('throws when EC SPKI uses compressed point format', () => {
      const p256AlgSeq = Buffer.from([
        0x30, 0x13, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02,
        0x01, // id-ecPublicKey OID
        0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07 // P-256 OID
      ])
      const compressedPoint = Buffer.concat([
        Buffer.from([0x02]),
        Buffer.alloc(32, 1)
      ])
      const bitString = Buffer.concat([
        Buffer.from([0x03, compressedPoint.length + 1, 0x00]),
        compressedPoint
      ])
      const spki = Buffer.concat([
        Buffer.from([0x30, p256AlgSeq.length + bitString.length]),
        p256AlgSeq,
        bitString
      ])
      expect(() =>
        pemToJwk(
          `-----BEGIN PUBLIC KEY-----\n${spki.toString('base64')}\n-----END PUBLIC KEY-----`
        )
      ).toThrow('非圧縮形式のEC公開鍵のみサポートしています')
    })

    /**
     * EC SPKIの座標データ長が不正な場合にエラーを送出することを検証
     */
    it('throws when EC SPKI coordinate length is invalid', () => {
      const p256AlgSeq = Buffer.from([
        0x30, 0x13, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02,
        0x01, // id-ecPublicKey OID
        0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07 // P-256 OID
      ])
      // 長さ不足（期待値65バイトに対して1+30バイト）
      const shortPoint = Buffer.concat([
        Buffer.from([0x04]),
        Buffer.alloc(30, 1)
      ])
      const shortBitString = Buffer.concat([
        Buffer.from([0x03, shortPoint.length + 1, 0x00]),
        shortPoint
      ])
      const shortSpki = Buffer.concat([
        Buffer.from([0x30, p256AlgSeq.length + shortBitString.length]),
        p256AlgSeq,
        shortBitString
      ])
      expect(() =>
        pemToJwk(
          `-----BEGIN PUBLIC KEY-----\n${shortSpki.toString('base64')}\n-----END PUBLIC KEY-----`
        )
      ).toThrow('EC公開鍵のデータ長が不正です (P-256)')

      // 長さ超過（期待値65バイトに対して1+66バイト）
      const longPoint = Buffer.concat([
        Buffer.from([0x04]),
        Buffer.alloc(66, 1)
      ])
      const longBitString = Buffer.concat([
        Buffer.from([0x03, longPoint.length + 1, 0x00]),
        longPoint
      ])
      const longSpki = Buffer.concat([
        Buffer.from([0x30, p256AlgSeq.length + longBitString.length]),
        p256AlgSeq,
        longBitString
      ])
      expect(() =>
        pemToJwk(
          `-----BEGIN PUBLIC KEY-----\n${longSpki.toString('base64')}\n-----END PUBLIC KEY-----`
        )
      ).toThrow('EC公開鍵のデータ長が不正です (P-256)')
    })

    /**
     * ASN.1の長さフィールドが不正またはオーバーフローする場合にエラーを送出することを検証
     */
    it('throws when ASN.1 length field is invalid or overflows', () => {
      // ASN.1長さの4バイト負値／符号付きオーバーフロー: 0x30 0x84 0xff 0xff 0xff 0xfa
      const overflowDer = Buffer.from([0x30, 0x84, 0xff, 0xff, 0xff, 0xfa])
      expect(() =>
        pemToJwk(
          `-----BEGIN PUBLIC KEY-----\n${overflowDer.toString('base64')}\n-----END PUBLIC KEY-----`
        )
      ).toThrow('ASN.1の長さフィールドが不正です')

      // 4バイトを超えるASN.1長さフィールド: 0x30 0x85 0x01 0x00 0x00 0x00 0x00
      const tooLargeDer = Buffer.from([
        0x30, 0x85, 0x01, 0x00, 0x00, 0x00, 0x00
      ])
      expect(() =>
        pemToJwk(
          `-----BEGIN PUBLIC KEY-----\n${tooLargeDer.toString('base64')}\n-----END PUBLIC KEY-----`
        )
      ).toThrow('ASN.1の長さフィールドが大きすぎます')
    })

    /**
     * PKCS#8がSEQUENCEでない、または構造が無効な場合にエラーを送出することを検証
     */
    it('throws when PKCS#8 is not a sequence or has invalid structure', () => {
      const nonSeq = new Uint8Array([0x02, 0x01, 0x00])
      expect(() =>
        pemToJwk(
          `-----BEGIN PRIVATE KEY-----\n${Buffer.from(nonSeq).toString('base64')}\n-----END PRIVATE KEY-----`
        )
      ).toThrow('SEQUENCEではありません')

      const badAlg = Buffer.from([
        0x30, 0x0b, 0x02, 0x01, 0x00, 0x30, 0x02, 0x02, 0x00, 0x04, 0x02, 0x01,
        0x02
      ])
      expect(() =>
        pemToJwk(
          `-----BEGIN PRIVATE KEY-----\n${badAlg.toString('base64')}\n-----END PRIVATE KEY-----`
        )
      ).toThrow('PKCS#8のAlgorithmIdentifierが無効です')

      const shortPkcs8 = new Uint8Array([0x30, 0x03, 0x02, 0x01, 0x00])
      expect(() =>
        pemToJwk(
          `-----BEGIN PRIVATE KEY-----\n${Buffer.from(shortPkcs8).toString('base64')}\n-----END PRIVATE KEY-----`
        )
      ).toThrow('不正なPKCS#8秘密鍵構造です')
    })

    /**
     * X.509証明書がSEQUENCEでない、またはSPKIが含まれない場合にエラーを送出することを検証
     */
    it('throws when Certificate is not a sequence or has no SPKI', () => {
      const nonSeq = new Uint8Array([0x02, 0x01, 0x00])
      expect(() =>
        pemToJwk(
          `-----BEGIN CERTIFICATE-----\n${Buffer.from(nonSeq).toString('base64')}\n-----END CERTIFICATE-----`
        )
      ).toThrow('SEQUENCEではありません')

      const noSpkiCert = Buffer.from([
        0x30, 0x08, 0x30, 0x02, 0x02, 0x00, 0x30, 0x02, 0x02, 0x00
      ])
      expect(() =>
        pemToJwk(
          `-----BEGIN CERTIFICATE-----\n${noSpkiCert.toString('base64')}\n-----END CERTIFICATE-----`
        )
      ).toThrow('X.509証明書構造です')

      const certWithNoSpkiInTbs = Buffer.concat([
        Buffer.from([0x30, 0x10]),
        Buffer.from([0x30, 0x06, 0x02, 0x01, 0x01, 0x02, 0x01, 0x02]),
        Buffer.from([0x30, 0x02, 0x02, 0x00]),
        Buffer.from([0x03, 0x02, 0x00, 0x00])
      ])
      expect(() =>
        pemToJwk(
          `-----BEGIN CERTIFICATE-----\n${certWithNoSpkiInTbs.toString('base64')}\n-----END CERTIFICATE-----`
        )
      ).toThrow('SubjectPublicKeyInfoが見つかりませんでした')
    })
  })
})
