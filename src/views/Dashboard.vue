<template>
  <div>
    <div v-if="!login">
      <h1 class="welcome" v-if="!login">Welcome, {{ user }}</h1>
      <v-btn class="button mx-15 text-center" @click="upload = true" outlined>
        <v-icon>mdi-upload</v-icon>
        upload new file
      </v-btn>
      <v-divider class="mx-15 mt-10"></v-divider>
      <v-progress-linear
        indeterminate
        v-if="loading"
        class="mx-auto"
      ></v-progress-linear>
      <v-simple-table class="mx-20 mt-10">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Commit Message</th>
              <th class="text-left">User</th>
              <th class="text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in files" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.commitMessage }}</td>
              <td>{{ item.user }}</td>
              <td>{{ item.uploaded }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
    <div v-if="upload">
      <v-dialog v-model="upload" width="500">
        <v-card>
          <v-card-title class="text-h5 blue lighten-2">
            new version
          </v-card-title>

          <v-card-text class="mt-5">
            hey {{ user }}, fill out the details below to add a new file.
          </v-card-text>

          <v-text-field
            flat
            outlined
            class="mx-15"
            label="what do you wanna call this version?"
            v-model="file.name"
          >
          </v-text-field>

          <v-text-field
            clearable
            flat
            outlined
            class="mx-15 mt-n3"
            label="what changed?"
            v-model="file.commitMessage"
          >
          </v-text-field>

          <v-file-input
            class="mx-10"
            accept=".lms"
            label="File input"
            show-size
            truncate-length="50"
            v-model="file.file"
          ></v-file-input>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="uplink"> finish </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div v-if="login">
      <v-dialog v-model="login" width="500">
        <v-card>
          <v-card-title class="text-h5 blue lighten-2"> Login </v-card-title>

          <v-card-text class="mt-5">
            Welcome to spikehub. Please login to continue to the files.
          </v-card-text>

          <v-text-field
            flat
            outlined
            class="mx-15"
            label="Name"
            v-model="log.username"
          >
          </v-text-field>

          <v-text-field
            clearable
            flat
            outlined
            class="mx-15 mt-n3"
            label="Passcode"
            v-model="log.passcode"
          >
          </v-text-field>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="passLogin"> Login </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-snackbar v-model="snackbar" color="blue">
      {{ msg }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      user: null,
      login: false,
      log: {
        username: null,
        passcode: null,
      },
      upload: false,
      file: {
        name: null,
        file: null,
        data: null,
        commitMessage: null,
      },
      msg: null,
      snackbar: false,
      files: [],
      loading: true,
    };
  },
  mounted: function () {
    this.checkLogin();
    this.getAllFiles();
  },
  methods: {
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    getAllFiles() {
      this.$http.get("files").then(
        (response) => {
          this.files = response.data;
          this.loading = false;
        },
        () => {
          this.msg = "error getting files";
          this.snackbar = true;
        }
      );
    },
    uplink() {
      this.upload = false;
      var reader = new FileReader();
      var vm = this;
      reader.onload = (e) => {
        vm.file.data = e.target.result;
        this.$http.post("/upload", this.file).then(
          (response) => {
            this.msg = "successfully uploaded";
            this.snackbar = true;
            this.file = {
              name: null,
              file: null,
              data: null,
              commitMessage: null,
            };
            this.getAllFiles()
          },
          (response) => {
            console.log(response);
          }
        );
      };
      reader.readAsDataURL(this.file.file);
    },
    createImage(file) {
      var image = new Image();
      var reader = new FileReader();
      var vm = this;
      reader.onload = (e) => {
        vm.file.data = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    checkLogin() {
      this.$http.get("/currentUser").then((res) => {
        if (res.data.user) {
          this.user = res.data.user;
          this.login = false;
          this.getAllFiles();
        } else {
          this.login = true;
        }
      });
    },
    passLogin() {
      this.$http.post("/login", this.log).then((res) => {
        this.checkLogin();
      });
    },
  },
};
</script>

<style scoped>
.welcome {
  font-size: 2rem;
  text-align: center;
  margin-top: 5rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
