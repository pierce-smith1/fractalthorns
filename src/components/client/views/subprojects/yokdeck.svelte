<script lang="ts">
    import {onMount} from "svelte";

    onMount(() => {
        const rs: Array<number> = [];
        document.querySelectorAll('.imgc img').forEach(n => {
            let r = Math.floor(Math.random() * 52);
            while (rs.includes(r)) {
                r = Math.floor(Math.random() * 52);
            }
            rs.push(r);
            n.setAttribute('src', `/assets/images/yokdeck/cards/card${r.toString().padStart(3, '0')}.png`);
        });
    });
</script>

<div>
    <h1>the yokdeck</h1>

    <div class="imgc">
        <img>
        <img>
        <img>
    </div>

    <p>This is a 52-card llokin-themed deck designed specifically for use with the Windows Vista/7 card games.</p>

    <a href="/assets/downloads/yokdeck.zip">download</a>

    <p>The above download includes:
    <ul>
        <li>individual pngs of each 146x196 card</li>
        <li>a single image sheet of all 52 cards</li>
        <li>a hacked <code>CardGames.dll</code> that replaces the Large Print Deck in Windows card games with this one</li>
    </ul>

    <p>To install the deck, just replace
    <code>C:\Windows\System32\CardGames.dll</code> with the copy from this archive,
    then in your card game of choice, choose the <strong>Large Print Deck</strong>.
    If you run into permissions issues, <a href="https://www.howtogeek.com/301768/how-to-take-ownership-of-files-and-folders-in-windows/">remind Windows that you're the
    boss</a>.</p> 

    <p>I've only tested this in Windows 7, since later versions don't have the card
    games bundled anymore. If you get a copy of a Windows Vista/7 card game and
    move it to Windows 10, this <em>might</em> work.</p>

    <p>enjoy &lt;3</p>
</div>

<style>
    .imgc {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
    }
</style>