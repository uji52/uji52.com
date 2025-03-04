<template>
  <div class="container">
    <header
      class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom"
    >
      <nav>
        <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li>
            <router-link id="linkTop" to="/" class="nav-link px-2">
              <svg
                class="bi"
                width="32"
                height="32"
                role="img"
                aria-label="Icon"
              >
                <use xlink:href="#icon"></use>
              </svg>
            </router-link>
          </li>
          <li>
            <router-link
              id="linkLanding"
              to="/"
              class="nav-link px-2"
              :class="{ 'link-secondary': $route.path === '/' }"
              >Home</router-link
            >
          </li>
          <li>
            <router-link
              id="linkDevelop"
              to="/develop"
              class="nav-link px-2"
              :class="{ 'link-secondary': $route.path === '/develop' }"
              >Develop</router-link
            >
          </li>
          <li>
            <router-link
              id="linkRelease"
              to="/release"
              class="nav-link px-2"
              :class="{ 'link-secondary': $route.path === '/release' }"
              >ReleaseNote</router-link
            >
          </li>
          <li>
            <router-link
              id="linkFeedback"
              to="/feedback"
              class="nav-link px-2"
              :class="{ 'link-secondary': $route.path === '/feedback' }"
              >Request</router-link
            >
          </li>
        </ul>
      </nav>

      <div class="col-md-3 text-end">
        <!--<button type="button" class="btn btn-outline-primary me-2">Login</button>-->
        <!--<button type="button" class="btn btn-primary">Sign-up</button>-->
      </div>
    </header>
  </div>
  <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
    <symbol id="icon" viewBox="0 0 64 64">
      <path
        fill="#888888"
        stroke="#888888"
        d="M 12 4 L 32 4 Q 40 8 32 12 L 16 12 L 12 16 L 12 24 L 16 28 C 28 28 36 32 36 44 C 36 56 28 60 16 60 L 8 60 Q 0 56 8 52 L 16 52 C 24 52 28 52 28 44 C 28 36 24 36 16 36 L 12 36 L 4 28 L 4 12 Z M 56 60 L 32 60 L 28 56 L 28 48 L 52 20 C 52 16 52 12 44 12 C 36 12 36 20 36 20 Q 32 28 28 20 C 28 12 36 4 44 4 C 52 4 60 12 60 20 L 59 22 L 34 52 L 56 52 Q 64 56 56 60 Z">
      </path>
    </symbol>
  </svg>
</template>

<script setup></script>

<style scoped>
.read-the-docs {
  color: #888;
}
.bi {
  fill: currentColor;
  vertical-align: text-bottom;
}
</style>
