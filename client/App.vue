<template>
  <div id="app">
    <h1>Hangman</h1>
    <button v-on:click="requestNewGame">New Game</button>
    <stats></stats>
    <span>solvedWord</span>
    <span>textfield</span>
  </div>
</template>
<script>
import { startNewGame } from './store/gameState'
import Stats from './components/Stats.vue'
import Vue from 'vue'

export default {
  components: {
    Stats
  },
  methods: {
    requestNewGame: startNewGame
  }
}
</script>
<style>
  #app {
    text-align: center;
  }
</style>
