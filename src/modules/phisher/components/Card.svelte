<script lang="ts">
    export let name;
    export let sprite;
</script>

<div class="card flex flex-col p-4 m-5 border-solid border-gray-200 border">
    <h1 class="w-full text-4xl text-black mb-1.5 capitalize text-center my-4">
        {name}
    </h1>
    <img src={sprite} alt={name} class="w-full" draggable="false" />
</div>

<style lang="scss">
    .card {
        width: 80%;
        height: 60vh;
        position: absolute;
        top: 50%;
        left: 50%;
        border-radius: 1%;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
        background-color: white;
        transform: translateX(-50%) translateY(-50%);
    }
</style>
