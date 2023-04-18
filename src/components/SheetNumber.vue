<script>
export default {
    data() {
        return {
            name: '',
            value: '',
            mobile: false
        }
    },
    methods: {
        toggleControls() {
            const state = this.$refs['sheet-number-controls'].style.display

            if (state == 'flex') {
                this.$refs['sheet-number-controls'].style.display = 'none'
            }
            else {
                this.$refs['sheet-number-controls'].style.display = 'flex'
            }
        }
    },
    mounted() {
        this.name = this.$refs['sheet-number'].getAttribute('name')
        this.value = this.$refs['sheet-number'].getAttribute('value')

        if (window.innerWidth < 768) {
            this.mobile = true
        }
        else {
            this.mobile = false
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth < 768) {
                this.mobile = true
            }
            else {
                this.mobile = false
            }
        })
    }
}
</script>
<template>
    <div class="sheet-number-wrapper" ref="sheet-number" @click="toggleControls()">
        <div class="sheet-number">
            <div class="sheet-number-header">
                <p>{{ name }}</p>
            </div>
            <div class="sheet-number-body">
                <h1>{{ value }}</h1>
            </div>
            <div class="sheet-number-footer" v-if="mobile">
                <p>Clique para expandir</p>
            </div>
        </div>
        <div class="sheet-number-controls" ref="sheet-number-controls">
            <img class="sheet-controls-config" src="../assets/img/setting.svg">
            <img class="sheet-controls-remove" src="../assets/img/cancel.svg" @click="toggleControls()">
        </div>
    </div>
</template>
<style>
.sheet-number-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    max-width: 19em;
    height: 10em;
    color: var(--text);
    cursor: pointer;
}

.sheet-number {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background-color: var(--primary);
    border: 2px solid var(--background);
    border-radius: 10px;
    height: 10em;
    width: 15em;
    color: var(--text);
    position: relative;
}

.sheet-number-controls {
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    width: 3em;
    height: 10em;
}

.sheet-number-controls img {
    width: 95%;
    background-color: var(--primary);
    border-radius: 50%;
    margin: 5px;
    box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    z-index: 10;
}

.sheet-number-controls img:hover {
    background-color: var(--secondary);
}

.sheet-number-header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 4em;
    background-color: var(--background);
    box-sizing: border-box;
    border: 2px solid var(--primary);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    text-align: center;
    font-weight: bold;
    margin: 0;
    padding: 5px;
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: wrap;
    word-wrap: break-word;
    word-break: break-all;
    line-break: auto;
    position: relative;
}

.sheet-number-header p {
    margin: 0;
}

.sheet-number-body {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    font-weight: bold;
    margin: 0;
    padding: 5px;
}

.sheet-number-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 2em;
    background-color: var(--background);
    box-sizing: border-box;
    border: 2px solid var(--primary);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    text-align: center;
    font-weight: bold;
    font-size: 0.8em;
    margin: 0;
    padding: 5px;
}
</style>