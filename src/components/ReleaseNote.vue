<template>
  <div class="release-note">
    <div class="container py-5">
      <h2 class="text-center mb-5">Release Note</h2>

      <div class="timeline">
        <div
          v-for="release in releases"
          :key="release.version"
          class="timeline-item"
        >
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">
                {{ release.version }}
                <span v-if="release.isNew" class="badge bg-primary ms-2"
                  >New</span
                >
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
  import { releases as releaseData } from '@/data/releases.js'

  const releases = ref(releaseData)
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
    background-color: #ffffffbb; /* 背景色を白に変更 */
  }
  
  .card-title {
    color: #0055bb;
    font-weight: 600;
  }
  
  .card-subtitle {
    color: #667777; /* 日付の色を調整 */
  }
  
  .card-body {
    color: #444444; /* メインテキストの色を調整 */
  }
  
  .badge {
    font-weight: 500;
    padding: 0.35em 0.65em;
  }
  
  /* Newバッジの色を調整（オプション） */
  .badge.bg-primary {
    background-color: #0d6efd;
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
