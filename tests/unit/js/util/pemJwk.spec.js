import crypto from 'crypto'
import {
  pemToJwk,
  pemToJwks,
  PemParseError,
  base64ToBytes,
  bytesToBase64Url,
  stripLeadingZeros,
  padToLength,
  parseNode,
  decodeOID
} from '@/utils/pemJwk'

describe('pemJwk utility', () => {
  describe('Helper functions', () => {
    it('bytesToBase64Url converts bytes correctly', () => {
      const bytes = new Uint8Array([0xfb, 0xff, 0xfe])
      const b64url = bytesToBase64Url(bytes)
      expect(b64url).toBe('-_-_'.slice(0, 0) + '-__-')
    })

    it('base64ToBytes throws on invalid base64', () => {
      expect(() => base64ToBytes('@@@@@@')).toThrow(PemParseError)
    })

    it('stripLeadingZeros strips leading zeros', () => {
      const arr = new Uint8Array([0, 0, 1, 2])
      expect(stripLeadingZeros(arr)).toEqual(new Uint8Array([1, 2]))

      const allZeros = new Uint8Array([0, 0, 0])
      expect(stripLeadingZeros(allZeros)).toEqual(new Uint8Array([0]))
    })

    it('padToLength pads or truncates appropriately', () => {
      const shortArr = new Uint8Array([1, 2])
      expect(padToLength(shortArr, 4)).toEqual(new Uint8Array([0, 0, 1, 2]))

      const exactArr = new Uint8Array([1, 2, 3, 4])
      expect(padToLength(exactArr, 4)).toEqual(exactArr)

      const longArr = new Uint8Array([0, 1, 2, 3, 4])
      expect(padToLength(longArr, 4)).toEqual(exactArr)
    })

    it('decodeOID decodes empty bytes to empty string', () => {
      expect(decodeOID(new Uint8Array([]))).toBe('')
    })

    it('parseNode error handling', () => {
      expect(() => parseNode(new Uint8Array([]), 0)).toThrow(
        'ASN.1データのパース中に終端に達しました'
      )
      expect(() => parseNode(new Uint8Array([0x30]), 0)).toThrow(
        'ASN.1の長さフィールドが不完全です'
      )
      // Indefinite length (0x80)
      expect(() => parseNode(new Uint8Array([0x30, 0x80]), 0)).toThrow(
        '不定長ASN.1形式はサポートされていません'
      )
      // Incomplete length bytes (0x82 means 2 length bytes, but only 1 provided)
      expect(() => parseNode(new Uint8Array([0x30, 0x82, 0x01]), 0)).toThrow(
        'ASN.1の長さバイトが不完全です'
      )
      // Length exceeds data
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

    it('converts Ed25519 SPKI Public Key to JWK', () => {
      const res = pemToJwk(spkiPem)
      expect(res.jwk.kty).toBe('OKP')
      expect(res.jwk.crv).toBe('Ed25519')
      expect(res.jwk.x).toBe(nodePubJwk.x)
      expect(res.keyInfo.algorithm).toBe('OKP')
      expect(res.keyInfo.type).toBe('public')
    })

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
    it('extracts public key from self-signed certificate', () => {
      // Create a dummy self-signed cert or standard cert
      const rsa = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
      const spkiDer = rsa.publicKey.export({ type: 'spki', format: 'der' })

      // Create a simple X.509 cert DER structure wrapping SPKI
      // Certificate ::= SEQUENCE { TBSCertificate, AlgorithmIdentifier, BIT STRING }
      // TBSCertificate ::= SEQUENCE { version, serialNumber, signature, issuer, validity, subject, SPKI }
      const version = new Uint8Array([0xa0, 0x03, 0x02, 0x01, 0x02]) // v3
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
    it('throws when PEM string is empty or invalid', () => {
      expect(() => pemToJwk('')).toThrow('PEMデータが入力されていません')
      expect(() => pemToJwk(null)).toThrow('PEMデータが入力されていません')
      expect(() => pemToJwk('some plain string')).toThrow(
        '有効なPEMヘッダー（-----BEGIN ...-----）が見つかりませんでした'
      )
    })

    it('throws when unsupported PEM type is given', () => {
      const unsupported =
        '-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIB\n-----END ENCRYPTED PRIVATE KEY-----'
      expect(() => pemToJwk(unsupported)).toThrow('未対応のPEMタイプです')
    })

    it('throws when PKCS#1 RSA Public Key is invalid', () => {
      // Not a sequence
      const invalidDer = new Uint8Array([0x02, 0x01, 0x00])
      const b64 = Buffer.from(invalidDer).toString('base64')
      const pem = `-----BEGIN RSA PUBLIC KEY-----\n${b64}\n-----END RSA PUBLIC KEY-----`
      expect(() => pemToJwk(pem)).toThrow('SEQUENCEではありません')
    })

    it('throws when SPKI structure is incomplete', () => {
      const emptySeq = new Uint8Array([0x30, 0x00])
      const b64 = Buffer.from(emptySeq).toString('base64')
      const pem = `-----BEGIN PUBLIC KEY-----\n${b64}\n-----END PUBLIC KEY-----`
      expect(() => pemToJwk(pem)).toThrow('不正なSPKI公開鍵構造です')
    })

    it('throws when EC curve is unknown', () => {
      // SPKI with EC OID but unsupported curve OID 1.2.3.4
      const algSeq = Buffer.from([
        0x30, 0x09, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01
      ]) // EC OID
      const spkiDer = Buffer.concat([
        Buffer.from([0x30, 0x15]),
        algSeq,
        Buffer.from([0x03, 0x08, 0x00, 0x04, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06])
      ])
      const pem = `-----BEGIN PUBLIC KEY-----\n${spkiDer.toString('base64')}\n-----END PUBLIC KEY-----`
      expect(() => pemToJwk(pem)).toThrow()
    })
  })
})

  describe('Edge cases and thorough error handling', () => {
    it('throws when PKCS#1 RSA Private Key has invalid tag or structure', () => {
      const nonSeq = new Uint8Array([0x02, 0x01, 0x00])
      expect(() =>
        pemToJwk(`-----BEGIN RSA PRIVATE KEY-----\n${Buffer.from(nonSeq).toString('base64')}\n-----END RSA PRIVATE KEY-----`)
      ).toThrow('SEQUENCEではありません')

      const shortSeq = new Uint8Array([0x30, 0x03, 0x02, 0x01, 0x00])
      expect(() =>
        pemToJwk(`-----BEGIN RSA PRIVATE KEY-----\n${Buffer.from(shortSeq).toString('base64')}\n-----END RSA PRIVATE KEY-----`)
      ).toThrow('フィールド数が不足しています')
    })

    it('throws when SEC1 EC Private Key has invalid tag or structure', () => {
      const nonSeq = new Uint8Array([0x02, 0x01, 0x00])
      expect(() =>
        pemToJwk(`-----BEGIN EC PRIVATE KEY-----\n${Buffer.from(nonSeq).toString('base64')}\n-----END EC PRIVATE KEY-----`)
      ).toThrow('SEQUENCEではありません')

      const invalidSeq = new Uint8Array([0x30, 0x03, 0x02, 0x01, 0x00])
      expect(() =>
        pemToJwk(`-----BEGIN EC PRIVATE KEY-----\n${Buffer.from(invalidSeq).toString('base64')}\n-----END EC PRIVATE KEY-----`)
      ).toThrow('不正なSEC1 EC秘密鍵構造です')
    })

    it('handles SEC1 EC Private Key with fallback curve detection and unknown length', () => {
      // 100-byte private key without curve params
      const longPriv = new Uint8Array(100)
      const sec1Der = Buffer.concat([
        Buffer.from([0x30, 0x69, 0x02, 0x01, 0x01, 0x04, 0x64]),
        longPriv
      ])
      expect(() =>
        pemToJwk(`-----BEGIN EC PRIVATE KEY-----\n${sec1Der.toString('base64')}\n-----END EC PRIVATE KEY-----`)
      ).toThrow('EC秘密鍵から曲線パラメータを特定できませんでした')
    })

    it('throws when SPKI is not a sequence or has invalid algorithm identifier', () => {
      const nonSeq = new Uint8Array([0x02, 0x01, 0x00])
      expect(() =>
        pemToJwk(`-----BEGIN PUBLIC KEY-----\n${Buffer.from(nonSeq).toString('base64')}\n-----END PUBLIC KEY-----`)
      ).toThrow('SEQUENCEではありません')

      const badAlg = Buffer.from([
        0x30, 0x0c, 0x30, 0x02, 0x02, 0x00, 0x03, 0x06, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05
      ])
      expect(() =>
        pemToJwk(`-----BEGIN PUBLIC KEY-----\n${badAlg.toString('base64')}\n-----END PUBLIC KEY-----`)
      ).toThrow('SPKIのAlgorithmIdentifierが無効です')
    })

    it('throws when SPKI has empty bit string', () => {
      const emptyBitString = Buffer.from([
        0x30, 0x08, 0x30, 0x04, 0x06, 0x02, 0x2a, 0x01, 0x03, 0x00
      ])
      expect(() =>
        pemToJwk(`-----BEGIN PUBLIC KEY-----\n${emptyBitString.toString('base64')}\n-----END PUBLIC KEY-----`)
      ).toThrow('SPKIの公開鍵データが空です')
    })

    it('throws when EC SPKI has invalid coordinate length or compressed format', () => {
      const ecSpkiCompressed = Buffer.from([
        0x30, 0x16, 0x30, 0x09, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01,
        0x03, 0x09, 0x00, 0x02, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07
      ]) // alg is EC without curve OID
      expect(() =>
        pemToJwk(`-----BEGIN PUBLIC KEY-----\n${ecSpkiCompressed.toString('base64')}\n-----END PUBLIC KEY-----`)
      ).toThrow('EC公開鍵の曲線パラメータが見つかりません')
    })

    it('throws when PKCS#8 is not a sequence or has invalid structure', () => {
      const nonSeq = new Uint8Array([0x02, 0x01, 0x00])
      expect(() =>
        pemToJwk(`-----BEGIN PRIVATE KEY-----\n${Buffer.from(nonSeq).toString('base64')}\n-----END PRIVATE KEY-----`)
      ).toThrow('SEQUENCEではありません')

      const badAlg = Buffer.from([
        0x30, 0x0b, 0x02, 0x01, 0x00, 0x30, 0x02, 0x02, 0x00, 0x04, 0x02, 0x01, 0x02
      ])
      expect(() =>
        pemToJwk(`-----BEGIN PRIVATE KEY-----\n${badAlg.toString('base64')}\n-----END PRIVATE KEY-----`)
      ).toThrow('PKCS#8のAlgorithmIdentifierが無効です')

      const shortPkcs8 = new Uint8Array([0x30, 0x03, 0x02, 0x01, 0x00])
      expect(() =>
        pemToJwk(`-----BEGIN PRIVATE KEY-----\n${Buffer.from(shortPkcs8).toString('base64')}\n-----END PRIVATE KEY-----`)
      ).toThrow('不正なPKCS#8秘密鍵構造です')
    })

    it('throws when Certificate is not a sequence or has no SPKI', () => {
      const nonSeq = new Uint8Array([0x02, 0x01, 0x00])
      expect(() =>
        pemToJwk(`-----BEGIN CERTIFICATE-----\n${Buffer.from(nonSeq).toString('base64')}\n-----END CERTIFICATE-----`)
      ).toThrow('SEQUENCEではありません')

      const noSpkiCert = Buffer.from([0x30, 0x08, 0x30, 0x02, 0x02, 0x00, 0x30, 0x02, 0x02, 0x00])
      expect(() =>
        pemToJwk(`-----BEGIN CERTIFICATE-----\n${noSpkiCert.toString('base64')}\n-----END CERTIFICATE-----`)
      ).toThrow('X.509証明書構造です')

      const certWithNoSpkiInTbs = Buffer.concat([
        Buffer.from([0x30, 0x10]),
        Buffer.from([0x30, 0x06, 0x02, 0x01, 0x01, 0x02, 0x01, 0x02]),
        Buffer.from([0x30, 0x02, 0x02, 0x00]),
        Buffer.from([0x03, 0x02, 0x00, 0x00])
      ])
      expect(() =>
        pemToJwk(`-----BEGIN CERTIFICATE-----\n${certWithNoSpkiInTbs.toString('base64')}\n-----END CERTIFICATE-----`)
      ).toThrow('SubjectPublicKeyInfoが見つかりませんでした')
    })
  })
