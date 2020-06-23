import 'https://cdn.jsdelivr.net/npm/vue/dist/vue.js';
import 'https://unpkg.com/vuex@3.4.0/dist/vuex.js'

function randomColor() {
    return '#' + Math.random().toString(16).substr(-6)
}

class Move {
    constructor(sourceRodId, targetRodId) {
        this.sourceRodId = sourceRodId
        this.targetRodId = targetRodId
    }
}

class Disk {
    constructor(size) {
        this.size = size
        this.color = randomColor()
    }
    biggerThan(anotherDisk) {
        return this.size > anotherDisk.size
    }
}

class Rod {
    constructor(id, numberOfDisks, size) {
        this.id = id
        this.size = size
        this.disks = []
        this.createDisks(numberOfDisks)
    }
    createDisks(numberOfDisks) {
        for (let size = numberOfDisks; size >= 1; size--) {
            this.disks.push(new Disk(size))
        }
    }
    put(disk) {
        // in principiu nu e nevoie de modificare de mai jos pt ca o fac in joc
        if (!this.canPutDisk(disk)) throw new Error('Cannot put disk')
        this.disks.push(disk)
    }
    canPutDisk(disk) {
        return this.isEmpty()
            || this.topDisk().biggerThan(disk)
    }
    pop() {
        if (this.isEmpty()) throw new Error('Rod is empty')
        return this.disks.pop()
    }
    isEmpty() {
        return this.disks.length == 0
    }
    topDisk() {
        return this.disks[this.disks.length - 1]
    }
}

class Game {
    constructor(numberOfDisks) {
        this.rods = {
            A: new Rod('A', numberOfDisks, numberOfDisks),
            B: new Rod('B', 0, numberOfDisks),
            C: new Rod('C', 0, numberOfDisks)
        }
        this.numberOfDisks = numberOfDisks
        this.numberOfMoves = 0
        this.finished = false
    }
    makeMove(move) {

        // ce este mai sus este de mn adaugat
        let sourceRod = this.rods[move.sourceRodId]
        let targetRod = this.rods[move.targetRodId]
        if (!targetRod.canPutDisk(sourceRod.topDisk())) {
            throw new Error('Cannot move disk')
        }
        let disk = sourceRod.pop()
        targetRod.put(disk)
        // sourceRod.put(disk) *nu o mai pun inca o data si pe soursa*
        if(this.rods.C.disks.length === this.numberOfDisks) {
            this.finished = true
            return
        }
    }
}

const store = new Vuex.Store({
    state: {
        game: new Game(5)
    },
    mutations: {
        makeMove: (state, move) => state.game.makeMove(move)
    },
    // getters: {
    //     game: state => state.game
    // }
})

const rod = {
    props: ['rod'],
    template: `
        <div class="rod"
             :style="{ height: disksHeight(rod.size), width: diskWidth(rod.size) }"
             @dragover.prevent
             @dragenter.prevent
             @drop="drop($event, rod)"
        >
            <div v-for="disk in rod.disks"
                 :key="disk.size"
                 class="disk"
                 :style="{
                     height: disksHeight(1),
                     width: diskWidth(disk.size),
                     backgroundColor: disk.color
                 }"
                 draggable="true"
                 @dragstart="drag($event, rod)"   
            >
            </div>
        </div>
    `,
    methods: {
        disksHeight: (disks) => disks * 2 + 'em',
        diskWidth: (diskSize) => diskSize * 3 + 'em',
        drag: (event, dragRod) => {
            event.dataTransfer.setData("dragRodId", dragRod.id)
        },
        drop: (event, dropRod) => {
            const dragRodId = event.dataTransfer.getData("dragRodId")
            store.commit('makeMove', new Move(dragRodId, dropRod.id))
        }
    },
}

const game = {
    template: `
        <section>
            <div v-if="isFinished" class="finish">
                <p class="congr">F E L I C I T A R I !!!!</p>
                <p class="mafiot">Esti mare mafiot !!!!</p>
            </div>
            <div class="game" v-else>
                <rod v-for="rod in rods" :rod="rod" :key="rod.id"></rod>
            </div>
        </section>
    `,
    components: { rod },
    computed: {
        rods: () => store.state.game.rods,
        isFinished: () => store.state.game.finished
    },
}

new Vue({
    el: '#app',
    store,
    components: { rod, game },
    template: `<game></game>`
})