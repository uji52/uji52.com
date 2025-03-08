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
        stroke="#444444"
        d="M 10 4 L 32 4 Q 40 10 32 16 L 16 16 L 16 16 L 16 20 L 16 24 C 28 28 36 32 36 44 C 36 56 28 60 16 60 L 8 60 Q 0 56 8 48 L 16 48 C 20 48 24 48 24 42 C 24 36 20 34 16 34 L 10 34 L 4 30 L 4 10 Z M 56 60 L 28 60 L 24 56 L 24 48 L 48 20 C 52 16 50 14 44 14 C 38 14 40 20 40 20 Q 34 28 28 20 C 28 12 36 4 44 4 C 52 4 60 12 60 20 L 59 22 L 38 48 L 56 48 Q 64 54 56 60 Z">
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
