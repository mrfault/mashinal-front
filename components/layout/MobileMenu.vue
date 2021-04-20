<template>
  <div class="mobile-menu d-lg-none">
    <div class="menu-header">
      <div class="container">
        <span @click.stop>
          <icon name="burger" />
        </span>
        <nuxt-link class="logo" :to="$localePath('/')">
          <img src="/img/logo.svg" alt="logo" />
        </nuxt-link>
        <span @click.stop>
          <icon name="options" />
        </span>
      </div>
    </div>
  </div>
</template>