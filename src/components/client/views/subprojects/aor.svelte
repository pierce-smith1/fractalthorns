<script>
    import Background from "../../background.svelte";

</script>
<div>
    <h1>Aegis of Rhodon</h1>

    <strong class="warning">! This game is discontinued and won't see any further development. 
    It was one hell of a ride and I hope to follow it up the future, but for now, I leave it
    to the sands of time...
    </strong>
    
    <p>The <strong>Tree of Roses</strong> sprouts from a seed embedded in the steel
    veil, driving a spear between worlds segregated for eons by an ancient seal.
    From the rushing melange of energy came forth the world of
    <strong>Rhodon</strong> - a vibrant land of metallic grass; trees built of
    pointy bark and silicon leaves; flowing rivers of chaotic data feeding pools of
    icy threads. A world where natural and artificial are fused in stunning
    symbiosis.</p>
    
    <p>But with the seal shattered, the living invite themselves to her world - and
    <strong>they will come to harvest her.</strong> With the insatiable hunger of beating flesh,
    they will rip the electron-speckled fruit and dendritic metals from her brittle
    golden skeleton. They will persist, blinded by feverish desire in their
    hedonistic violation of the land, until cracks in the sky bleed only quiet air
    and her circuits of roses dither to sparkling pixels.</p>
    
    <p>Unless something is done.</p>
    
    <div class=images>
        <img class="deco" src="/assets/images/aor/hashcracker.png" /> 
        <img class="deco" src="/assets/images/aor/welchian_rune.png" /> 
        <img class="deco" src="/assets/images/aor/obsilicon.png" />
    </div>
    
    <h2>Downloads</h2>
    
    <p>Current version: b2.0.3</p>
    
    <ul>
        <li><a href="/assets/downloads/aor/aor.exe">Windows</a></li>
        <li><a href="/assets/downloads/aor/aor">Linux</a></li>
    </ul>
    
    <h2>Changelog</h2>
    
    <h3>b2.0.3</h3>
    <ul>
        <li>(game) Made actions slightly slower (8x speed compared to pre-2.0.0, rather than 10x)</li>
        <li>(bug) Fixed a bug where attempts to study items would cause crashes if you had no empty explorer slots</li>
        <li>(bug) Fixed a bug where it was possible to do more foraging/mining than was allowed at a location by queuing over multiple explorers</li>
        <li>(bug) Fixed a bug causing the slots for dead explorers to not properly update their &quot;is selected&quot; visual cues</li>
    </ul>
    
    <h3>b2.0.2</h3>
    <ul>
        <li>(game) Changed the order of activity events so that items are consumed before new ones are generated; this will make it possible to for instance trade with a full inventory and still recieve items</li>
        <li>(qol) The selected explorer is now distinguished visually in the explorer list</li>
        <li>(bug) Fixed a bug causing items copied by a Haskeel to be quantum entangled</li>
        <li>(bug) Fixed a bug where some activities could cause a crash if you had a full inventory</li>
        <li>(bug) Fixed a bug causing explorers to die if they both recieved and lost an injury at the same time while having 3 injuries</li>
        <li>(bug) Fixed a bug causing Spinal Trap to sometimes not save explorers from death</li>
        <li>(bug) Fixed a bug causing the UI for explorer bars to not refresh after a new expedition was started</li>
        <li>(bug) Attempted to fix a bug causing dummy location tiles to appear in the top-left of the map</li>
    </ul>
    
    <h3>b2.0.1</h3>
    <ul>
        <li>(game) Made slight adjustments to some signature items: <ul>
            <li><span class="spoiler">(buff) Pentium Bar [Stone, Metallic, Crystalline, Runic Resources]: 35 -&gt; 40</span></li>
            <li><span class="spoiler">(buff) Pentium Bar [Leafy Resource]: 0 -&gt; 40</span></li>
            <li><span class="spoiler">(buff) Advanced Coniine and Phoratoxin Iris [Item Uses]: 2 -&gt; 3</span></li>
        </ul></li>
        <li>(game) Item balance: <ul>
            <li>(buff) Seaquake [Stone Power]: 0 -&gt; 200</li>
            <li>(buff) <span class="spoiler">Rowhammer</span> (the new hammer) [Stone Cost]: 160 -&gt; 150</li>
        </ul></li>
        <li>(qol) Added a "new expedition" button for quickly restarting the game</li>
        <li>(bug) Fixed a bug causing items dragged from an external slot to a filled inventory slot to crash the game and leave the save unusable</li>
        <li>(bug) Fixed a bug causing environment and skill slots to appear to accept item drops</li>
        <li>(bug) Fixed a bug causing the signature item tutorial to not appear</li>
        <li>(bug) Fixed a bug causing the metallic and stone resource numbers in the smithing box to be swapped</li>
        <li>(bug) Fixed a bug where clicking on a location too far away would perpetually set that location as the next destination</li>
        <li>(bug) Fixed a bug causing some on-death effects not to proc</li>
        <li>(bug) Updated some dialog boxes</li>
        <li>(bug) Updated the lore tooltip with the correct numbers (it's 5/15/20 per consumble/tool/artifact, not 2/8/12)</li>
    </ul>
    
    <h3>b2.0.0</h3>
    <ul>
        <li>(game) Added <b>exploration</b> - dissassemble food, tools and artifacts to uncover the map of Rhodon, then choose somewhere to move once your explorers have enough resources to make the passage. Each location has unique effects and special items to find, but they only have a limited number of resources - so don't get too comfortable where you are.</li>
        <li>(game) Added <b>an end goal</b> - find and reach the Tree of Roses to bring your adventure to a close (the ending is a blatant placeholder).</li>
        <li>(game) Added <b>sounds</b> - certain UI elements and game actions will now play sounds (thanks prrrki!)</li>
        <li>The new content is extremely experimental and hasn't even been playtested yet. I'm not actually sure if it's possible to beat the game.</li>
        <li>(game) Experimenting with the game being significantly faster; all actions now complete 10x as quickly.</li>
        <li>(game) Added a new tier of items</li>
        <li>(game) Tools no longer have a limited number of uses</li>
        <li>(game) Globally, random injuries no longer occur - they can now only be triggered by determinate events (i.e. running out of energy) or location-specific random events</li>
        <li>(game) In response to the above changes, the Plum and Orange Fennahian color bonuses have been changed</li>
        <li>(game) Fleshed out the global action counter into a more comprehensive threat system; this includes a bar showing the current and maximum threat (how long you have left before Welchian Fever begins)</li>
        <li>(game) The fungus items have been changed from tool products to signature (location specific) items; the Spacefiller has been reworked into the Spearfisher with a new set of consumables</li>
        <li>(game) Added infostrips showing the total number of resources you have in your inventory and in each explorer's material slots</li>
        <li>(game) Added info about explorers' current energy/spirit, equipped items, and injuries to their tooltips</li>
        <li>(game) Added icons to explorer buttons indicating if they hold a tool/artifact/injury</li>
        <li>(game) Raised the maximum number of explorers from 11 to 12</li>
        <li>(game) New games now start with 2 explorers, one of which has dual heritage</li>
        <li>(game) Item balance (most are buffs to account for the game being harder now): <ul>
            <li>(buff) Bleeding Wildheart and Norton Ghost Pepper [Leafy Resource]: 0 -&gt; 10</li>
            <li>(buff) Norton Ghost Pepper [Energy Boost]: 20 -&gt; 30</li>
            <li>(nerf) Seaquake [Item Level]: 3 -&gt; 2</li>
            <li>(buff) Fungified Token, Polymore, and Copycap [Item Level]: 4 -&gt; 5</li>
            <li>(buff) Fungified Token, Polymore, and Copycap [Item Uses]: 1 -&gt; 3</li>
            <li>(buff) Obsessive Checksum Discorder [Energy Penalty]: 20 -&gt; 10</li>
            <li>(buff) Obsessive Checksum Discorder [Item Uses]: 5 -&gt; 6</li>
            <li>(buff) Dynamic Digestion [Spirit Penalty]: 20 -&gt; 10</li>
            <li>(buff) Dynamic Digestion [Energy Penalty]: 10 -&gt; 0</li>
            <li>(buff) Dynamic Digestion [Item Uses]: 2 -&gt; 10</li>
            <li>(buff) Double Vision [Item Uses]: 3 -&gt; 6</li>
        </ul></li>
        <li>(qol) Save files are no longer encrypted (the qol is for really for me)</li>
        <li>(bug) Fixed nasty UI misalignment near the explorer portrait</li>
        <li>(bug) Fixed some more things probably, I wasn't keeping track</li>
        <li>(bug) Added a bunch of new bugs (you should find them!!!!)</li>
    </ul>
    
    
    <h3>b1.4.1</h3>
    <ul>
        <li>(game) Tools can no longer be defiled</li>
        <li>(game) Pipeapples now give +20 spirit and energy</li>
        <li>(qol) Made some item slot theming take effect in GTK, hopefully making them look better and hiding the PushButtons in the gather UI</li>
        <li>(qol) Added notices to the trade UI when there are no other players or when the connection to the trade server fails</li>
        <li>(bug) Fixed a bug where a coupling explorer's partner would sometimes be from the Ashmorgue</li>
        <li>(bug) The crash slot has been turned into the Does Nothing slot</li>
        <li>(bug) Fixed a bug causing a crash when explorers tried to couple in multi-window mode</li>
    </ul>
    
    <h3>b1.4.0</h3>
    <ul>
        <li>(dev) Changed the order that some injury-related events are resolved - this was done purely to allow new features to exist and should not have a visible effect</li>
        <li>(game) Added a new foraging tool and a new set of consumables</li>
        <li>(game) The Seaquake can now support 30 crystalline resource</li>
    </ul>
    
    <h3>b1.3.0</h3>
    <ul>
        <li>(game) You can now split the UI into multiple windows (still very janky)</li>
        <li>(game) In single window mode, the window can now be expanded and fullscreened</li>
        <li>(game) The explorer list has been moved to make more space for future UI controls</li>
        <li>(bug) Fixed Lime Fennahians crashing the game whenever they found an item</li>
        <li>(qol) Added an "are you sure" dialog when quitting</li>
    </ul>
    
    <h3>b1.2.0</h3>
    <ul>
        <li>(dev) Several core systems have been re-written in anticipation of future content. They are now probably very unstable and I anticipate <em>many</em> new bugs will be present, so anything you can find is greatly appreciated
        <li>(game) Trying a new UI layout that creates space for future controls</li>
        <li>(game) Changed the mechanics of material slotting; previously, you were <em>unable</em> to slot materials at all if they caused a particular resource to exceeded your smithing tool's max capacity. Now, you are <em>able</em> to slot materials regardless of your tool's capacity, however you can still only craft items that your tool allows. This should help materials be more flexible and generally valuable, as previously very high-value materials couldn't be used with lower-level tools
        <li>(game) Changed how Fennahian names are generated</li>
        <li>(bug) Fixed injuries displaying simply as "Level x" instead of "Level x Injury"</li>
        <li>(qol) The crash dialog has been reworked to make it more clear something unintentional has occured</li>
        <li>(qol) Added an about screen</li>
    </ul>
    
    <h3>b1.1.1</h3>
    <ul>
        <li>(bug) Fixed a bug causing Welchian Fever to occasionally appear too early</li>
        <li>(bug) Fixed a bug causing the injury tutorial to appear incorrectly</li>
        <li>(bug) Attempted to address some visual inconsistency between platforms</li>
    </ul>
    
    <h3>b1.1.0</h3>
    <ul>
        <li>(bug) Fixed a bug where an explorer could equip a tool while performing an action of that tool's type</li>
        <li>(game) Significantly delayed the appearance of Welchian Fever</li>
        <li>(game) Changed the base color trait of Lime Fennahians from <b>+7% material value</b> to <b>+5% chance to get double items</b>
        <li>(qol) Added a log that shows a chronology of important game events</li>
        <li>(qol) Fixed some minor grammar/spelling mistakes</li>
        <li>(qol) Adjusted the tooltip for Welchian Fever to convey its intended purpose</li>
    </ul>
    
    <h3>b1.0.1</h3>
    <ul>
        <li>(bug) Attempted to fix a bug causing text clipping in tooltips on high DPI displays</li>
        <li>(bug) Fixed a bug causing queued smithing actions to be rejected, even if the explorer had enough energy and materials to carry it out</li>
        <li>(bug) Fixed a bug where dragging two items into the same smithing slot caused the first one to become unusable</li>
    </ul>
    
    <h3>b1.0.0</h3>
    <ul>
        <li>Released</li>
    </ul>
    
    <h2>Anticipated questions</h2>
    
    <p><strong>What can I play this on?</strong></p>
    
    Theoretically, any 64-bit Windows 7+ or Linux machine. The Windows binary comes
    statically linked with all dependencies, but the Linux one will require you
    have Qt5 installed and have sacrificed the sufficient quantity of live goats to
    RMS. MacOS is not supported yet but may be in the future.
    
    <p><strong>How do I save the game? Where are my save files?</strong></p>
    
    <p>AOR autosaves every time the inventory is changed or you close the main game
    window. Games are saved to a file called &quot;save.rho&quot; in the same
    folder as the executable. This file is also backed up every couple of minutes
    to &quot;save.rho.bak&quot;</p>
    
    <p><strong>How do I load a game?</strong></p>
    
    <p>When you start AOR, it will try to read from any file named &quot;save.rho&quot;
    in the same folder as the executable. To load a different game, rename your current
    save.rho to something else, then move a different save.rho into the game folder.</p>
    
    <p><strong>How do I update the game?</strong></p>
    
    <p>For the forseeable future, you'll have to do this manually by just replacing your
    executable with a new one downloaded from here.</p>
    
    <p>Note that if the major version of the game increases (e.g. the version goes
    from 2.x.x to 3.x.x), that means it will <strong>not</strong> be compatible
    with save files from older versions.</p>
    
    <p><strong>Is the game open source?</strong></p>
    
    <a href="https://github.com/pierce-smith1/aor">Yes.</a>
</div>

<style>
    .images {
        display: flex;
        justify-content: space-evenly;
    }

    .deco {
        opacity: 50%;
    }

    .warning {
        display: block;
        padding: 10px;
        border: 1px solid rgba(255 255 255 / 50%);
        border-radius: 5px;
        color: yellow !important;
    }
</style>