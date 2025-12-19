/*
概要: CloudFront のカスタムポリシーに基づく署名付きクッキーを生成する簡易スクリプト
使用法:
  node tools/generate_cloudfront_signed_cookies.js \
    --privateKey ~/.ssh/keys/dev_web_key_prv.pem \
    --publicKeyId KNO3HB7SCSQXD\
    --domain dev.uji52.com \
    --ip 1.2.3.4/32 \
    --expires 86400

出力: ブラウザにセットすべき `Set-Cookie` ヘッダを標準出力に出します。

注意:
- このスクリプトは署名に `RSA-SHA1` を使います（CloudFront 用の既存サンプル互換性のため）。
- `private_key.pem` は安全に管理してください。公開鍵は CloudFront コンソールに登録し、Key Group を作って配信のビヘイビアに紐付けてください。
- カスタムポリシーで `IpAddress` 条件を入れることで「自宅IPのみ」制限も可能です。
*/

const fs = require('fs');
const crypto = require('crypto');

function usageAndExit() {
  console.log('Usage: node tools/generate_cloudfront_signed_cookies.js --privateKey ./private_key.pem --publicKeyId APKA... --domain dev.uji52.com --ip 1.2.3.4/32 --expires 3600');
  process.exit(1);
}

const argv = require('process').argv.slice(2);
if (argv.length === 0) usageAndExit();

function getArg(name) {
  const ix = argv.indexOf(name);
  if (ix === -1 || ix + 1 >= argv.length) return null;
  return argv[ix + 1];
}

const privateKeyPath = getArg('--privateKey');
const publicKeyId = getArg('--publicKeyId');
const domain = getArg('--domain');
const ip = getArg('--ip');
const expiresSec = parseInt(getArg('--expires') || '3600', 10);

if (!privateKeyPath || !publicKeyId || !domain) usageAndExit();
if (!fs.existsSync(privateKeyPath)) {
  console.error('privateKey file not found:', privateKeyPath);
  process.exit(1);
}

const privateKeyPem = fs.readFileSync(privateKeyPath, 'utf8');

function base64UrlEncode(input) {
  return input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64Encode(input) {
  return input.toString('base64');
}

function makePolicy(resource, expireEpoch, ipCidr) {
  const stmt = {
    Statement: [
      {
        Resource: resource,
        Condition: {
          DateLessThan: { 'AWS:EpochTime': expireEpoch }
        }
      }
    ]
  };
  if (ipCidr) {
    stmt.Statement[0].Condition.IpAddress = { 'AWS:SourceIp': ipCidr };
  }
  return JSON.stringify(stmt);
}

function signPolicy(policyStr, privateKey) {
  // Use RSA-SHA1 for compatibility with CloudFront signed-cookie examples
  const signer = crypto.createSign('RSA-SHA1');
  signer.update(policyStr);
  const signature = signer.sign(privateKey);
  return base64UrlEncode(signature);
}

function signPolicyAsBase64(policyStr, privateKey) {
  const signer = crypto.createSign('RSA-SHA1');
  signer.update(policyStr);
  const signature = signer.sign(privateKey);
  return base64Encode(signature);
}

(async function main() {
  const now = Math.floor(Date.now() / 1000);
  const expire = now + (isNaN(expiresSec) ? 3600 : expiresSec);
  const resource = `https://${domain}/*`;

  const policy = makePolicy(resource, expire, ip);
  const policyB64 = encodeURIComponent(base64Encode(Buffer.from(policy, 'utf8')));
  const signature = encodeURIComponent(signPolicyAsBase64(policy, privateKeyPem));

  // CloudFront の署名付きクッキーに使う名前
  // カスタムポリシー: CloudFront-Policy, CloudFront-Signature, CloudFront-Key-Pair-Id
  // Domain と Path は例。Secure は true, HttpOnly は false にする（ブラウザJSから触らなくても可）。

  console.log('# 以下をレスポンスの Set-Cookie ヘッダとして使うか、ブラウザにセットしてください');
  console.log(`Set-Cookie: CloudFront-Policy=${policyB64}; Domain=${domain}; Path=/; Secure; SameSite=None`);
  console.log(`Set-Cookie: CloudFront-Signature=${signature}; Domain=${domain}; Path=/; Secure; SameSite=None`);
  console.log(`Set-Cookie: CloudFront-Key-Pair-Id=${publicKeyId}; Domain=${domain}; Path=/; Secure; SameSite=None`);
  console.log('');
  console.log('# 有効期限（epoch）:', expire);
  console.log('# ポリシー（デコード済）:\n', policy);
  console.log('');
  console.log('Set-Cookie: 以降を document.cookie = のあとに文字列で追加するとSet可能');
  console.log('');
  console.log(`document.cookie = "CloudFront-Policy=${policyB64}; Domain=${domain}; Path=/; Secure; SameSite=None"`);
  console.log(`document.cookie = "CloudFront-Signature=${signature}; Domain=${domain}; Path=/; Secure; SameSite=None"`);
  console.log(`document.cookie = "CloudFront-Key-Pair-Id=${publicKeyId}; Domain=${domain}; Path=/; Secure; SameSite=None"`);
})();
