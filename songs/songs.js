var app = new Vue({
    el: '#app',
    data: {
        fact: "No lyrics yet...",
        partialURL: 'https://api.lyrics.ovh/v1/',
        artist: "",
        title: ""
    },
    methods: {
        mounted() {
            axios 
                .get(this.partialURL + `${this.artist}/${this.title}`)
                .then(response => this.fact = response.data.lyrics)
                .catch(error => console.log(error));
        },
        refresh() {
            this.fact = 'Another lyrics...';
            this.artist = '';
            this.title = '';
        }
    }
})