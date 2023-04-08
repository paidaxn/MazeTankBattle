<template>
    <!-- <transition name="faderouter" mode="out-in"> -->
    <div class="home" ref="vantaRef">
        <div class="title">迷宫坦克大战</div>
        <div class="subhead">MazeTankBattle</div>        
        <!-- <div class="mode">单人闯关模式</div>
        <div class="mode">双人闯关模式</div> -->
        <div class="mode" @click="gotoplay()">双人对战模式</div>
    </div>
    <!-- </transition> -->
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import * as THREE from 'three';
import BIRDS from 'vanta/src/vanta.birds';
export default {
    data() {
        return {};
    },
    methods: {
        gotoplay() {
            this.$router.push('/mode1');
        }
    },
    mounted() {
        this.vantaEffect = BIRDS({
            el: this.$refs.vantaRef,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0
        });
    },
    beforeDestroy() {
        if (this.vantaEffect) {
            this.vantaEffect.destroy();
        }
    }
};
</script>
<style lang="less" scoped>
* {
    padding: 0;
    margin: 0;
}
.home {
    width: 100%;
    height: 100%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    .title {
        padding-top: 150px;
        font-size: 80px;
        color: rgb(255, 255, 255);
        text-align: center;
    }
    .subhead {
        padding-top: 20px;
        font-size: 50px;
        color: white;
        text-align: center;
    }
    .mode {
        cursor: pointer;
        color: white;
        font-size: 30px;
        text-align: center;
        line-height: 70px;
        margin: 50px auto;
        .wh(200, 70);
        border: 3px white solid;
        border-radius: 80px;
    }
}
</style>
