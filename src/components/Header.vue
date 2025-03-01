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
            <router-link id="linkLanding"
              to="/"
              class="nav-link px-2"
              :class="{ 'link-secondary': $route.path === '/' }"
              >Home</router-link
            >
          </li>
          <li>
            <router-link id="linkDevelop"
              to="/develop"
              class="nav-link px-2"
              :class="{ 'link-secondary': $route.path === '/develop' }"
              >Develop</router-link
            >
          </li>
          <li>
            <router-link id="linkRelease"
              to="/release"
              class="nav-link px-2"
              :class="{ 'link-secondary': $route.path === '/release' }"
              >ReleaseNote</router-link
            >
          </li>
          <li>
            <router-link id="linkFeedback"
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
        d="M 8,0 L 32,0 32,16 0,16 Z
           M 0,16 L 16,16 16,48 0,32 Z
           M 16,32 A 16 16 0 0 1 16,64
           M 16,48 L 16,64 0,64 Z
           M 48,16 A 8 8 0 0 1 32,16
           M 32,16 A 16 16 0 0 1 64,16
           M 48,16 L 64,16 48,48 32,48 Z
           M 32,48 L 64,48 64,64 32,64 Z
           "
      ></path>
    </symbol>
  </svg>
</template>

<script setup>
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
.bi {
  fill: currentColor;
  vertical-align: text-bottom;
}
</style>
