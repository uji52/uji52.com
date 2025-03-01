<template>
  <div class="release-note">
    <div class="container py-5">
      <h2 class="text-center mb-5">リリースノート</h2>
      
      <div class="timeline">
        <div v-for="release in releases" :key="release.version" class="timeline-item">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">
                {{ release.version }}
                <span v-if="release.isNew" class="badge bg-primary ms-2">New</span>
              </h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ release.date }}</h6>
              <ul class="list-unstyled">
                <li v-for="(note, index) in release.notes" :key="index">
                  {{ note }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
  import { ref } from 'vue'
  
  const releases = ref([
  {
      version: '2.0.0',
      date: '2025/03/01',
      isNew: true,
      notes: ['デザイン変更', 'GA削除', 'ログイン機構削除']
    },
    {
      version: '1.7.3',
      date: '2022/11/09',
      notes: ['SHA256ハッシュのBase64URL値を追加']
    },
    {
      version: '1.7.2',
      date: '2022/11/09',
      notes: ['SHA256ハッシュのBase64値を追加']
    },
    {
      version: '1.7.1',
      date: '2022/08/14',
      notes: ['SHA256ハッシュの出力から一部0が欠損する問題の修正']
    },
    {
      version: '1.7.0',
      date: '2022/02/17',
      notes: ['認証機能に関する注記の追記']
    },
    {
      version: '1.6.0',
      date: '2022/02/16',
      notes: ['認証機能追加']
    },
    {
      version: '1.5.0',
      date: '2022/02/03',
      notes: ['ランダム値生成追加']
    },
    {
      version: '1.4.0',
      date: '2020/10/07',
      notes: ['SHA256ハッシュ修正']
    },
    {
      version: '1.3.0',
      date: '2020/08/29',
      notes: ['Google Analytics追加']
    },
    {
      version: '1.2.0',
      date: '2020/08/23',
      notes: ['SHA256ハッシュ追加']
    },
    {
      version: '1.1.0',
      date: '2020/05/05',
      notes: ['Release Note追加', 'バージョン番号追加']
    },
    {
      version: '1.0.0',
      date: '2020/05/02',
      notes: ['初期リリース']
    }
  ])
</script>
  
<style scoped>
  .release-note {
    min-height: 100vh;
  }
  
  .timeline {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .timeline::after {
    content: '';
    position: absolute;
    width: 2px;
    background-color: #dee2e6;
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -1px;
  }
  
  .timeline-item {
    padding: 10px 40px;
    position: relative;
    width: 50%;
  }
  
  .timeline-item:nth-child(odd) {
    left: 0;
  }
  
  .timeline-item:nth-child(even) {
    left: 50%;
  }
  
  .timeline-item::before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    right: -8px;
    background-color: white;
    border: 2px solid #007bff;
    top: 22px;
    border-radius: 50%;
    z-index: 1;
  }
  
  .timeline-item:nth-child(even)::before {
    left: -8px;
  }

  .card {
    border: none;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #ffffffbb;  /* 背景色を白に変更 */
  }
  
  .card-title {
    color: #0055bb;
    font-weight: 600;
  }
  
  .card-subtitle {
    color: #667777 !important;  /* 日付の色を調整 */
  }
  
  .card-body {
    color: #444444;  /* メインテキストの色を調整 */
  }
  
  .badge {
    font-weight: 500;
    padding: 0.35em 0.65em;
  }
  
  /* Newバッジの色を調整（オプション） */
  .badge.bg-primary {
    background-color: #0d6efd !important;
    color: #fff;
  }
  
  /* リストアイテムのスタイル調整 */
  .list-unstyled li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
  
  @media (max-width: 767.98px) {
    .timeline::after {
      left: 31px;
    }
    
    .timeline-item {
      width: 100%;
      padding-left: 70px;
      padding-right: 25px;
    }
    
    .timeline-item:nth-child(even) {
      left: 0;
    }
    
    .timeline-item::before {
      left: 23px;
      right: auto;
    }
  }
</style>