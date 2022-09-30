<template>
  <div>
    <h1 class="maintitle">Spikehub</h1>
    <v-divider class="mx-15"></v-divider>
    <h3 class="text-center mt-2 sub">next-gen version control for spike prime</h3>
    <v-btn class='button' @click="login" outlined >
      <v-icon>mdi-login</v-icon>
       dashboard
    </v-btn>
    <v-container class="mt-5">
      <v-row>
        <v-col>
          <v-card class="mx-auto" max-width="344">
            <v-img
              src="https://antonsmindstorms.com/wp-content/uploads/2021/03/Screen-Shot-2021-03-21-at-21.44.16.png"
              aspect-ratio="1.7"
            ></v-img>
            <v-card-title class="text-center">Spikehub</v-card-title>
            <v-card-text>
              <p class="text-center">
                Spikehub is a next-gen version control system for the spike prime
                robot. It allows you to easily share your code with others and
                keep track of changes.
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import HelloWorld from '../components/HelloWorld'

  export default {
    name: 'Home',

    components: {
      HelloWorld,
    },
    methods: {
      login() {
        this.$router.push('/dashboard')
      },
    }
  }
</script>
<style scoped>
.maintitle {
  font-size: 5rem;
  text-align: center;
  margin-top: 6rem;

}

.sub{
  font-size: 1.5rem;
  text-align: center;
  margin-top: 1rem;
  font-weight: 400;
}

.button{
  margin: 0 auto;
  display: block;
  text-align: center;
  margin-top: 2rem;
  border-color: #b03b2e;
}
</style>