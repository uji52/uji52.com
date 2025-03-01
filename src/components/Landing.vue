<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <div class="px-4 py-5 my-5 text-center">
      <h1 class="display-5 fw-bold text-body-emphasis">Welcome to uji52.com</h1>
      <div class="col-lg-6 mx-auto">
        <p class="lead mb-4">システム開発に利用できるツールを提供します</p>
        <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <router-link to="/develop" class="btn btn-primary btn-lg px-4 gap-3">
            開発ツール
          </router-link>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="container px-4 py-5">
      <h2 class="pb-2 border-bottom">Features</h2>
      <div class="row g-4 py-5 row-cols-1 row-cols-lg-3">
        <div class="col d-flex align-items-start">
          <div
            class="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3"
          >
            <i class="bi bi-code-slash"></i>
          </div>
          <div>
            <h3 class="fs-2 text-body-emphasis">開発ツール</h3>
            <p>
              Base64エンコード/デコード、URLエンコード/デコード、ハッシュ計算など、
              開発に便利なツールを提供しています。
            </p>
            <router-link to="/develop" class="btn btn-primary">
              使ってみる
            </router-link>
          </div>
        </div>
        <div class="col d-flex align-items-start">
          <div
            class="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3"
          >
            <i class="bi bi-journal-text"></i>
          </div>
          <div>
            <h3 class="fs-2 text-body-emphasis">リリースノート</h3>
            <p>
              機能追加や改善、バグ修正など、
              アプリケーションの更新履歴を確認できます。
            </p>
            <router-link to="/release" class="btn btn-primary">
              確認する
            </router-link>
          </div>
        </div>
        <div class="col d-flex align-items-start">
          <div
            class="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3"
          >
            <i class="bi bi-lightbulb"></i>
          </div>
          <div>
            <h3 class="fs-2 text-body-emphasis">要望・提案(作成中)</h3>
            <p>
              新機能の提案やバグ報告など、
              サービス改善のためのフィードバックをお待ちしています。
            </p>
            <router-link to="/feedback" class="btn btn-primary">
              投稿する
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.icon-square {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
}

.text-body-emphasis {
  color: var(--bs-emphasis-color);
}
</style>
