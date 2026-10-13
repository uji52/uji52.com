<template>
  <div class="fido-tools">
    <!-- WebAuthn Support Check Warning -->
    <div v-if="!isSupported" class="alert alert-warning mb-4" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      お使いのブラウザまたは現在の環境（非HTTPS、HTTP上のlocalhost以外など）では
      WebAuthn API (PublicKeyCredential)
      がサポートされていない可能性があります。
    </div>

    <!-- ==================== Section 1: Key作成 (Registration) ==================== -->
    <div class="card mb-4 shadow-sm">
      <div class="card-header bg-body-tertiary">
        <h2 class="h5 mb-0 fw-bold">1. Key作成 (Registration)</h2>
      </div>
      <div class="card-body">
        <div class="row g-4">
          <!-- 左半分: input パラメータ指定 -->
          <div class="col-lg-6">
            <h3 class="h6 fw-bold border-bottom pb-2 mb-3">パラメータ設定</h3>

            <!-- RP 設定 -->
            <div class="row mb-3">
              <div class="col-md-6 mb-2 mb-md-0">
                <label for="regRpId" class="form-label small fw-semibold">
                  Relying Party ID (rp.id)
                </label>
                <input
                  id="regRpId"
                  v-model="regParams.rpId"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="例: localhost または ドメイン"
                />
                <div class="form-text small">
                  空欄の場合はブラウザが現在のオリジンのホスト名を使用します。
                </div>
              </div>
              <div class="col-md-6">
                <label for="regRpName" class="form-label small fw-semibold">
                  RP Name (rp.name)
                </label>
                <input
                  id="regRpName"
                  v-model="regParams.rpName"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="例: WebAuthn Test"
                />
              </div>
            </div>

            <!-- User 設定 -->
            <div class="row mb-3">
              <div class="col-md-6 mb-2 mb-md-0">
                <label for="regUserName" class="form-label small fw-semibold">
                  User Name (user.name)
                </label>
                <input
                  id="regUserName"
                  v-model="regParams.userName"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="例: user@example.com"
                />
              </div>
              <div class="col-md-6">
                <label
                  for="regUserDisplayName"
                  class="form-label small fw-semibold"
                >
                  Display Name (user.displayName)
                </label>
                <input
                  id="regUserDisplayName"
                  v-model="regParams.userDisplayName"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="例: Test User"
                />
              </div>
            </div>

            <!-- User ID -->
            <div class="mb-3">
              <div
                class="d-flex justify-content-between align-items-center mb-1"
              >
                <label
                  for="regUserId"
                  class="form-label small fw-semibold mb-0"
                >
                  User ID (平文 GUID)
                </label>
                <button
                  type="button"
                  class="btn btn-link btn-sm p-0 text-decoration-none"
                  @click="regenerateUserId"
                >
                  <i class="bi bi-arrow-clockwise"></i> 再生成
                </button>
              </div>
              <div class="row g-2 align-items-center">
                <div class="col-sm-7">
                  <input
                    id="regUserId"
                    v-model="regParams.userIdPlain"
                    type="text"
                    class="form-control form-control-sm font-monospace"
                    placeholder="平文 GUID"
                  />
                </div>
                <div class="col-sm-5">
                  <span
                    class="badge bg-secondary-subtle text-secondary-emphasis border font-monospace text-truncate d-block text-start py-2 px-2"
                    :title="regUserIdBase64Url"
                  >
                    <span class="text-body-secondary me-1">B64URL:</span
                    >{{ regUserIdBase64Url }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Challenge 設定 (認証側と同期) -->
            <div class="mb-3">
              <div
                class="d-flex justify-content-between align-items-center mb-1"
              >
                <label
                  for="regChallenge"
                  class="form-label small fw-semibold mb-0"
                >
                  Challenge (ランダム値)
                </label>
                <button
                  type="button"
                  class="btn btn-link btn-sm p-0 text-decoration-none"
                  @click="regenerateChallenge"
                >
                  <i class="bi bi-arrow-clockwise"></i> 再生成
                </button>
              </div>
              <div class="row g-2 align-items-center">
                <div class="col-sm-7">
                  <input
                    id="regChallenge"
                    v-model="sharedChallenge"
                    type="text"
                    class="form-control form-control-sm font-monospace"
                    placeholder="ランダム文字列 (認証側と同期)"
                  />
                </div>
                <div class="col-sm-5">
                  <span
                    class="badge bg-secondary-subtle text-secondary-emphasis border font-monospace text-truncate d-block text-start py-2 px-2"
                    :title="challengeBase64Url"
                  >
                    <span class="text-body-secondary me-1">B64URL:</span
                    >{{ challengeBase64Url }}
                  </span>
                </div>
              </div>
              <div class="form-text small">
                Key作成側と認証側で常に同期されます。
              </div>
            </div>

            <!-- 署名アルゴリズム -->
            <div class="mb-3">
              <label class="form-label small fw-semibold d-block">
                公開鍵アルゴリズム (pubKeyCredParams)
              </label>
              <div class="d-flex flex-wrap gap-3">
                <div class="form-check">
                  <input
                    id="algES256"
                    v-model="regParams.algorithms"
                    type="checkbox"
                    class="form-check-input"
                    :value="-7"
                  />
                  <label for="algES256" class="form-check-label small"
                    >ES256 (-7)</label
                  >
                </div>
                <div class="form-check">
                  <input
                    id="algRS256"
                    v-model="regParams.algorithms"
                    type="checkbox"
                    class="form-check-input"
                    :value="-257"
                  />
                  <label for="algRS256" class="form-check-label small"
                    >RS256 (-257)</label
                  >
                </div>
                <div class="form-check">
                  <input
                    id="algEdDSA"
                    v-model="regParams.algorithms"
                    type="checkbox"
                    class="form-check-input"
                    :value="-8"
                  />
                  <label for="algEdDSA" class="form-check-label small"
                    >Ed25519 (-8)</label
                  >
                </div>
              </div>
            </div>

            <!-- AuthenticatorSelection -->
            <div class="row mb-3">
              <div class="col-md-4 mb-2 mb-md-0">
                <label for="regAttachment" class="form-label small fw-semibold">
                  Attachment
                </label>
                <select
                  id="regAttachment"
                  v-model="regParams.attachment"
                  class="form-select form-select-sm"
                >
                  <option value="">指定なし</option>
                  <option value="platform">platform (内蔵)</option>
                  <option value="cross-platform">cross-platform (外付)</option>
                </select>
              </div>
              <div class="col-md-4 mb-2 mb-md-0">
                <label
                  for="regResidentKey"
                  class="form-label small fw-semibold"
                >
                  Resident Key
                </label>
                <select
                  id="regResidentKey"
                  v-model="regParams.residentKey"
                  class="form-select form-select-sm"
                >
                  <option value="preferred">preferred</option>
                  <option value="required">required</option>
                  <option value="discouraged">discouraged</option>
                </select>
              </div>
              <div class="col-md-4">
                <label
                  for="regUserVerification"
                  class="form-label small fw-semibold"
                >
                  User Verification
                </label>
                <select
                  id="regUserVerification"
                  v-model="regParams.userVerification"
                  class="form-select form-select-sm"
                >
                  <option value="preferred">preferred</option>
                  <option value="required">required</option>
                  <option value="discouraged">discouraged</option>
                </select>
              </div>
            </div>

            <!-- Attestation & Timeout -->
            <div class="row mb-4">
              <div class="col-md-6 mb-2 mb-md-0">
                <label
                  for="regAttestation"
                  class="form-label small fw-semibold"
                >
                  Attestation
                </label>
                <select
                  id="regAttestation"
                  v-model="regParams.attestation"
                  class="form-select form-select-sm"
                >
                  <option value="none">none</option>
                  <option value="direct">direct</option>
                  <option value="indirect">indirect</option>
                </select>
              </div>
              <div class="col-md-6">
                <label for="regTimeout" class="form-label small fw-semibold">
                  Timeout (ms)
                </label>
                <input
                  id="regTimeout"
                  v-model.number="regParams.timeout"
                  type="number"
                  class="form-control form-control-sm"
                  step="1000"
                />
              </div>
            </div>

            <!-- 登録実行ボタン -->
            <button
              id="btnCreateCredential"
              type="button"
              class="btn btn-primary w-100 fw-bold py-2 mb-3"
              :disabled="regLoading"
              @click="handleCreateCredential"
            >
              <span
                v-if="regLoading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              <i v-else class="bi bi-key-fill me-2"></i>
              Key作成を実行 (navigator.credentials.create)
            </button>

            <!-- メッセージ表示 -->
            <div
              v-if="regSuccessMsg"
              class="alert alert-success alert-dismissible fade show small"
              role="alert"
            >
              <i class="bi bi-check-circle-fill me-2"></i>
              {{ regSuccessMsg }}
              <button
                type="button"
                class="btn-close"
                @click="regSuccessMsg = ''"
              ></button>
            </div>
            <div
              v-if="regErrorMsg"
              class="alert alert-danger alert-dismissible fade show small"
              role="alert"
            >
              <i class="bi bi-x-circle-fill me-2"></i>
              {{ regErrorMsg }}
              <button
                type="button"
                class="btn-close"
                @click="regErrorMsg = ''"
              ></button>
            </div>
          </div>

          <!-- 右半分: JSON 表示 -->
          <div class="col-lg-6">
            <div
              class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3"
            >
              <ul class="nav nav-pills" role="tablist">
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link py-1 px-3 small"
                    :class="{ active: regViewTab === 'options' }"
                    type="button"
                    @click="regViewTab = 'options'"
                  >
                    Options (Request JSON)
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link py-1 px-3 small"
                    :class="{ active: regViewTab === 'result' }"
                    type="button"
                    @click="regViewTab = 'result'"
                  >
                    Result (Response JSON)
                    <span
                      v-if="regResult"
                      class="badge bg-success ms-1"
                      style="font-size: 0.65rem"
                      >✓</span
                    >
                  </button>
                </li>
              </ul>
              <button
                type="button"
                class="btn btn-outline-secondary btn-sm py-0 px-2"
                style="font-size: 0.75rem"
                @click="copyJson(currentRegJsonText)"
              >
                <i class="bi bi-clipboard"></i> コピー
              </button>
            </div>

            <!-- Options JSON -->
            <div v-show="regViewTab === 'options'">
              <p class="text-body-secondary small mb-1">
                ※ 左側の入力パラメータから自動構築される
                <code>PublicKeyCredentialCreationOptions</code> のJSON表現です。
              </p>
              <pre
                id="regOptionsJson"
                class="bg-dark text-light p-3 rounded font-monospace small"
                style="max-height: 480px; overflow-y: auto"
                >{{ regOptionsJson }}</pre>
            </div>

            <!-- Result JSON -->
            <div v-show="regViewTab === 'result'">
              <p class="text-body-secondary small mb-1">
                ※ 鍵作成成功時にブラウザから返却された
                <code>PublicKeyCredential</code> の解析結果です。
              </p>
              <pre
                v-if="regResult"
                id="regResultJson"
                class="bg-dark text-light p-3 rounded font-monospace small"
                style="max-height: 480px; overflow-y: auto"
                >{{ regResultJson }}</pre>
              <div
                v-else
                class="text-body-secondary text-center py-5 border rounded bg-body-tertiary"
              >
                <i class="bi bi-info-circle fs-3 d-block mb-2"></i>
                鍵を作成すると、ここにレスポンスのJSONが表示されます。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== Section 2: 認証 (Authentication) ==================== -->
    <div class="card mb-4 shadow-sm">
      <div class="card-header bg-body-tertiary">
        <h2 class="h5 mb-0 fw-bold">2. 認証 (Authentication)</h2>
      </div>
      <div class="card-body">
        <div class="row g-4">
          <!-- 左半分: input パラメータ指定 -->
          <div class="col-lg-6">
            <h3 class="h6 fw-bold border-bottom pb-2 mb-3">パラメータ設定</h3>

            <!-- RP ID -->
            <div class="mb-3">
              <label for="authRpId" class="form-label small fw-semibold">
                Relying Party ID (rpId)
              </label>
              <input
                id="authRpId"
                v-model="authParams.rpId"
                type="text"
                class="form-control form-control-sm"
                placeholder="例: localhost または ドメイン"
              />
              <div class="form-text small">
                空欄の場合はブラウザが現在のオリジンのホスト名を使用します。
              </div>
            </div>

            <!-- Challenge 設定 (Key作成側と同期) -->
            <div class="mb-3">
              <div
                class="d-flex justify-content-between align-items-center mb-1"
              >
                <label
                  for="authChallenge"
                  class="form-label small fw-semibold mb-0"
                >
                  Challenge (ランダム値)
                </label>
                <button
                  type="button"
                  class="btn btn-link btn-sm p-0 text-decoration-none"
                  @click="regenerateChallenge"
                >
                  <i class="bi bi-arrow-clockwise"></i> 再生成
                </button>
              </div>
              <div class="row g-2 align-items-center">
                <div class="col-sm-7">
                  <input
                    id="authChallenge"
                    v-model="sharedChallenge"
                    type="text"
                    class="form-control form-control-sm font-monospace"
                    placeholder="ランダム文字列 (Key作成側と同期)"
                  />
                </div>
                <div class="col-sm-5">
                  <span
                    class="badge bg-secondary-subtle text-secondary-emphasis border font-monospace text-truncate d-block text-start py-2 px-2"
                    :title="challengeBase64Url"
                  >
                    <span class="text-body-secondary me-1">B64URL:</span
                    >{{ challengeBase64Url }}
                  </span>
                </div>
              </div>
              <div class="form-text small">
                Key作成側と認証側で常に同期されます。
              </div>
            </div>

            <!-- Allow Credentials (許可する鍵) -->
            <div class="mb-3">
              <div
                class="d-flex justify-content-between align-items-center mb-1"
              >
                <label
                  for="authCredentialId"
                  class="form-label small fw-semibold mb-0"
                >
                  Credential ID (allowCredentials)
                </label>
                <div class="btn-group btn-group-sm">
                  <button
                    v-if="storedCredentials.length > 0"
                    type="button"
                    class="btn btn-link btn-sm p-0 text-decoration-none me-2"
                    @click="applyLatestCredential"
                  >
                    最新のKeyを適用
                  </button>
                  <button
                    type="button"
                    class="btn btn-link btn-sm p-0 text-decoration-none text-muted"
                    @click="authParams.credentialId = ''"
                  >
                    クリア (空欄=パスキー選択)
                  </button>
                </div>
              </div>
              <input
                id="authCredentialId"
                v-model="authParams.credentialId"
                type="text"
                class="form-control form-control-sm font-monospace"
                placeholder="Base64URL形式のCredential ID（空欄の場合はDiscoverable Credential）"
              />
            </div>

            <!-- Transports -->
            <div class="mb-3">
              <label class="form-label small fw-semibold d-block">
                Transports (オプション)
              </label>
              <div class="d-flex flex-wrap gap-3">
                <div
                  v-for="trans in ['internal', 'usb', 'nfc', 'ble', 'hybrid']"
                  :key="trans"
                  class="form-check"
                >
                  <input
                    :id="`trans_${trans}`"
                    v-model="authParams.transports"
                    type="checkbox"
                    class="form-check-input"
                    :value="trans"
                  />
                  <label :for="`trans_${trans}`" class="form-check-label small">
                    {{ trans }}
                  </label>
                </div>
              </div>
            </div>

            <!-- User Verification & Timeout -->
            <div class="row mb-4">
              <div class="col-md-6 mb-2 mb-md-0">
                <label
                  for="authUserVerification"
                  class="form-label small fw-semibold"
                >
                  User Verification
                </label>
                <select
                  id="authUserVerification"
                  v-model="authParams.userVerification"
                  class="form-select form-select-sm"
                >
                  <option value="preferred">preferred</option>
                  <option value="required">required</option>
                  <option value="discouraged">discouraged</option>
                </select>
              </div>
              <div class="col-md-6">
                <label for="authTimeout" class="form-label small fw-semibold">
                  Timeout (ms)
                </label>
                <input
                  id="authTimeout"
                  v-model.number="authParams.timeout"
                  type="number"
                  class="form-control form-control-sm"
                  step="1000"
                />
              </div>
            </div>

            <!-- 認証実行ボタン -->
            <button
              id="btnGetCredential"
              type="button"
              class="btn btn-success w-100 fw-bold py-2 mb-3"
              :disabled="authLoading"
              @click="handleGetCredential"
            >
              <span
                v-if="authLoading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              <i v-else class="bi bi-shield-check me-2"></i>
              認証を実行 (navigator.credentials.get)
            </button>

            <!-- メッセージ表示 -->
            <div
              v-if="authSuccessMsg"
              class="alert alert-success alert-dismissible fade show small"
              role="alert"
            >
              <i class="bi bi-check-circle-fill me-2"></i>
              {{ authSuccessMsg }}
              <button
                type="button"
                class="btn-close"
                @click="authSuccessMsg = ''"
              ></button>
            </div>
            <div
              v-if="authErrorMsg"
              class="alert alert-danger alert-dismissible fade show small"
              role="alert"
            >
              <i class="bi bi-x-circle-fill me-2"></i>
              {{ authErrorMsg }}
              <button
                type="button"
                class="btn-close"
                @click="authErrorMsg = ''"
              ></button>
            </div>
          </div>

          <!-- 右半分: JSON 表示 -->
          <div class="col-lg-6">
            <div
              class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3"
            >
              <ul class="nav nav-pills" role="tablist">
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link py-1 px-3 small"
                    :class="{ active: authViewTab === 'options' }"
                    type="button"
                    @click="authViewTab = 'options'"
                  >
                    Options (Request JSON)
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link py-1 px-3 small"
                    :class="{ active: authViewTab === 'result' }"
                    type="button"
                    @click="authViewTab = 'result'"
                  >
                    Result (Response JSON)
                    <span
                      v-if="authResult"
                      class="badge bg-success ms-1"
                      style="font-size: 0.65rem"
                      >✓</span
                    >
                  </button>
                </li>
              </ul>
              <button
                type="button"
                class="btn btn-outline-secondary btn-sm py-0 px-2"
                style="font-size: 0.75rem"
                @click="copyJson(currentAuthJsonText)"
              >
                <i class="bi bi-clipboard"></i> コピー
              </button>
            </div>

            <!-- Options JSON -->
            <div v-show="authViewTab === 'options'">
              <p class="text-body-secondary small mb-1">
                ※ 左側の入力パラメータから自動構築される
                <code>PublicKeyCredentialRequestOptions</code> のJSON表現です。
              </p>
              <pre
                id="authOptionsJson"
                class="bg-dark text-light p-3 rounded font-monospace small"
                style="max-height: 480px; overflow-y: auto"
                >{{ authOptionsJson }}</pre>
            </div>

            <!-- Result JSON -->
            <div v-show="authViewTab === 'result'">
              <p class="text-body-secondary small mb-1">
                ※ 認証成功時にブラウザから返却された
                <code>PublicKeyCredential</code> の解析結果です。
              </p>
              <pre
                v-if="authResult"
                id="authResultJson"
                class="bg-dark text-light p-3 rounded font-monospace small"
                style="max-height: 480px; overflow-y: auto"
                >{{ authResultJson }}</pre>
              <div
                v-else
                class="text-body-secondary text-center py-5 border rounded bg-body-tertiary"
              >
                <i class="bi bi-info-circle fs-3 d-block mb-2"></i>
                認証を実行すると、ここにレスポンスのJSONが表示されます。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== Section 3: SessionStorage 保管情報 ==================== -->
    <div class="card mb-4 shadow-sm">
      <div
        class="card-header bg-body-tertiary d-flex justify-content-between align-items-center"
      >
        <h3 class="h6 mb-0 fw-bold">
          <i class="bi bi-database me-2"></i>
          SessionStorage 保管中のKey情報 ({{ storedCredentials.length }}件)
        </h3>
        <button
          v-if="storedCredentials.length > 0"
          type="button"
          class="btn btn-outline-danger btn-sm py-0 px-2"
          @click="handleClearStorage"
        >
          <i class="bi bi-trash"></i> すべて削除
        </button>
      </div>
      <div class="card-body">
        <div
          v-if="storedCredentials.length === 0"
          class="text-body-secondary small"
        >
          現在SessionStorageに保管されているKeyはありません。Keyを作成すると自動的に保管されます。
        </div>
        <div v-else class="table-responsive">
          <table class="table table-sm table-hover align-middle mb-0">
            <thead>
              <tr class="small text-body-secondary">
                <th scope="col">保存日時</th>
                <th scope="col">ユーザー名</th>
                <th scope="col">RP ID</th>
                <th scope="col">Credential ID</th>
                <th scope="col" class="text-end">操作</th>
              </tr>
            </thead>
            <tbody class="small">
              <tr v-for="(cred, index) in storedCredentials" :key="index">
                <td>{{ formatDate(cred.savedAt) }}</td>
                <td>{{ cred.userName || cred.userId || '-' }}</td>
                <td>{{ cred.rpId || '-' }}</td>
                <td
                  class="font-monospace text-truncate"
                  style="max-width: 200px"
                >
                  {{ cred.id }}
                </td>
                <td class="text-end">
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm py-0 px-2"
                    @click="selectCredentialForAuth(cred)"
                  >
                    認証にセット
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import {
  base64UrlToBytes,
  stringToBase64Url,
  generateGuid,
  generateRandomBase64Url,
  getStoredCredentials,
  saveStoredCredential,
  clearStoredCredentials,
  parseCredentialResponse
} from '@/utils/webauthn'

// ブラウザのWebAuthnサポート判定
const isSupported = ref(true)

// ==================== 共通 Challenge (Key作成・認証で同期) ====================
const sharedChallenge = ref(generateRandomBase64Url(32))

const challengeBase64Url = computed(() =>
  stringToBase64Url(sharedChallenge.value)
)

const regenerateChallenge = () => {
  sharedChallenge.value = generateRandomBase64Url(32)
}

// ==================== State: Key作成 (Registration) ====================
const defaultHostname =
  typeof window !== 'undefined' && window.location
    ? window.location.hostname
    : ''

const regParams = reactive({
  rpId: defaultHostname,
  rpName: 'WebAuthn Local Test',
  userName: 'user@example.com',
  userDisplayName: 'Test User',
  userIdPlain: generateGuid(),
  algorithms: [-7, -257],
  attachment: '',
  residentKey: 'preferred',
  userVerification: 'preferred',
  attestation: 'none',
  timeout: 60000
})

const regUserIdBase64Url = computed(() =>
  stringToBase64Url(regParams.userIdPlain)
)

const regLoading = ref(false)
const regSuccessMsg = ref('')
const regErrorMsg = ref('')
const regResult = ref(null)
const regViewTab = ref('options') // 'options' | 'result'

const regenerateUserId = () => {
  regParams.userIdPlain = generateGuid()
}

// 構築される creationOptions (JSON用)
const regOptionsObject = computed(() => {
  const options = {
    rp: {
      name: regParams.rpName
    },
    user: {
      id: regUserIdBase64Url.value,
      name: regParams.userName,
      displayName: regParams.userDisplayName
    },
    challenge: challengeBase64Url.value,
    pubKeyCredParams: regParams.algorithms.map((alg) => ({
      type: 'public-key',
      alg
    })),
    timeout: regParams.timeout,
    attestation: regParams.attestation,
    authenticatorSelection: {
      residentKey: regParams.residentKey,
      userVerification: regParams.userVerification
    }
  }

  if (regParams.rpId) {
    options.rp.id = regParams.rpId
  }
  if (regParams.attachment) {
    options.authenticatorSelection.authenticatorAttachment =
      regParams.attachment
  }

  return options
})

const regOptionsJson = computed(() => {
  return JSON.stringify(regOptionsObject.value, null, 2)
})

const regResultJson = computed(() => {
  return regResult.value ? JSON.stringify(regResult.value, null, 2) : ''
})

const currentRegJsonText = computed(() => {
  return regViewTab.value === 'result' && regResult.value
    ? regResultJson.value
    : regOptionsJson.value
})

// ==================== State: 認証 (Authentication) ====================
const authParams = reactive({
  rpId: defaultHostname,
  credentialId: '',
  transports: ['internal'],
  userVerification: 'preferred',
  timeout: 60000
})

const authLoading = ref(false)
const authSuccessMsg = ref('')
const authErrorMsg = ref('')
const authResult = ref(null)
const authViewTab = ref('options') // 'options' | 'result'

// 構築される requestOptions (JSON用)
const authOptionsObject = computed(() => {
  const options = {
    challenge: challengeBase64Url.value,
    timeout: authParams.timeout,
    userVerification: authParams.userVerification
  }

  if (authParams.rpId) {
    options.rpId = authParams.rpId
  }

  if (authParams.credentialId) {
    const cred = {
      id: authParams.credentialId,
      type: 'public-key'
    }
    if (authParams.transports.length > 0) {
      cred.transports = authParams.transports
    }
    options.allowCredentials = [cred]
  }

  return options
})

const authOptionsJson = computed(() => {
  return JSON.stringify(authOptionsObject.value, null, 2)
})

const authResultJson = computed(() => {
  return authResult.value ? JSON.stringify(authResult.value, null, 2) : ''
})

const currentAuthJsonText = computed(() => {
  return authViewTab.value === 'result' && authResult.value
    ? authResultJson.value
    : authOptionsJson.value
})

// ==================== SessionStorage 状態 ====================
const storedCredentials = ref([])

const refreshStoredCredentials = () => {
  storedCredentials.value = getStoredCredentials()
}

const applyLatestCredential = () => {
  if (storedCredentials.value.length > 0) {
    authParams.credentialId = storedCredentials.value[0].id
  }
}

const selectCredentialForAuth = (cred) => {
  authParams.credentialId = cred.id
  if (cred.rpId) {
    authParams.rpId = cred.rpId
  }
  if (cred.transports && cred.transports.length > 0) {
    authParams.transports = [...cred.transports]
  }
}

const handleClearStorage = () => {
  clearStoredCredentials()
  refreshStoredCredentials()
}

// 日時フォーマット
const formatDate = (isoStr) => {
  if (!isoStr) return '-'
  try {
    const d = new Date(isoStr)
    return d.toLocaleString()
  } catch (e) {
    return isoStr
  }
}

// クリップボードコピー
const copyJson = async (text) => {
  if (!text) return
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text)
    } catch (e) {
      // ignore
    }
  }
}

// ==================== Key作成の実行 ====================
const handleCreateCredential = async () => {
  regSuccessMsg.value = ''
  regErrorMsg.value = ''
  regLoading.value = true

  try {
    if (
      typeof navigator === 'undefined' ||
      !navigator.credentials ||
      typeof navigator.credentials.create !== 'function'
    ) {
      throw new Error(
        'navigator.credentials.create がサポートされていない環境です。'
      )
    }

    const rawOptions = regOptionsObject.value
    const publicKey = {
      ...rawOptions,
      challenge: base64UrlToBytes(rawOptions.challenge).buffer,
      user: {
        ...rawOptions.user,
        id: base64UrlToBytes(rawOptions.user.id).buffer
      }
    }

    const credential = await navigator.credentials.create({ publicKey })
    if (!credential) {
      throw new Error('Key作成が完了しませんでした（credential is null）。')
    }

    const parsed = parseCredentialResponse(credential)
    regResult.value = parsed
    regViewTab.value = 'result'

    // SessionStorageに保管
    const toStore = {
      id: parsed.id,
      rawId: parsed.rawId,
      type: parsed.type,
      rpId: regParams.rpId || defaultHostname,
      userName: regParams.userName,
      transports: parsed.transports || []
    }
    saveStoredCredential(toStore)
    refreshStoredCredentials()

    // 認証側のCredential IDにも自動反映
    authParams.credentialId = parsed.id

    regSuccessMsg.value =
      'Keyの作成に成功しました！情報はSessionStorageに保管され、認証セクションにもセットされました。'
  } catch (err) {
    regErrorMsg.value = `Key作成エラー: ${err.name || 'Error'} - ${err.message}`
  } finally {
    regLoading.value = false
  }
}

// ==================== 認証の実行 ====================
const handleGetCredential = async () => {
  authSuccessMsg.value = ''
  authErrorMsg.value = ''
  authLoading.value = true

  try {
    if (
      typeof navigator === 'undefined' ||
      !navigator.credentials ||
      typeof navigator.credentials.get !== 'function'
    ) {
      throw new Error(
        'navigator.credentials.get がサポートされていない環境です。'
      )
    }

    const rawOptions = authOptionsObject.value
    const publicKey = {
      challenge: base64UrlToBytes(rawOptions.challenge).buffer,
      timeout: rawOptions.timeout,
      userVerification: rawOptions.userVerification
    }

    if (rawOptions.rpId) {
      publicKey.rpId = rawOptions.rpId
    }

    if (rawOptions.allowCredentials && rawOptions.allowCredentials.length > 0) {
      publicKey.allowCredentials = rawOptions.allowCredentials.map((c) => ({
        type: c.type,
        id: base64UrlToBytes(c.id).buffer,
        ...(c.transports ? { transports: c.transports } : {})
      }))
    }

    const credential = await navigator.credentials.get({ publicKey })
    if (!credential) {
      throw new Error('認証が完了しませんでした（credential is null）。')
    }

    const parsed = parseCredentialResponse(credential)
    authResult.value = parsed
    authViewTab.value = 'result'

    authSuccessMsg.value = `認証に成功しました！ (Credential ID: ${parsed.id})`
  } catch (err) {
    authErrorMsg.value = `認証エラー: ${err.name || 'Error'} - ${err.message}`
  } finally {
    authLoading.value = false
  }
}

onMounted(() => {
  if (
    typeof window !== 'undefined' &&
    typeof window.PublicKeyCredential === 'undefined'
  ) {
    isSupported.value = false
  }
  refreshStoredCredentials()
  if (storedCredentials.value.length > 0 && !authParams.credentialId) {
    authParams.credentialId = storedCredentials.value[0].id
  }
})
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
