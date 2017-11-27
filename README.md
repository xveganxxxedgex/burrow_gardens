# Overview

This is a 2d game built with ReactJS.

The objective is to collect all of the unique kinds of produce in the Burrow Gardens realm, as well as befriend all possible bunnies.

Some produce can only be obtained after learning skills from bunny friends.

## How To Play/Controls

Use `keyboard controls` or `WASD` to move, `space` for action, and `i` to bring up your inventory/info menu.

## Demo

[A live demo can be found here](https://xveganxxxedgex.github.io/burrow_gardens/), but the game is still under development and far from finished

## TODO

~~Create general movement/action functionality (arrow keys + space)~~

~~Create logic for getting map bounds (so player can't move into the whitespace)~~

~~Create logic for going between different maps~~

~~Create basic map template~~

~~Create hitbox detection~~

~~Fix hitbox detection going diagonal issue~~

~~Rotate images depending on which direction player is moving/facing~~

~~Create logic to handle actions based on colliding entities~~

~~Add sprite/gif images as backgrounds upon character move (or possibly even on idle)~~

~~Create way for user to see their inventory/active quest/current friends~~

~~Add collision detection for other bunnies~~

~~Create AI logic so characters randomly move on the map~~

~~Fix jumpy AI movement~~

~~When repopulating produce, need to ensure nothing is colliding with that position before placing it there~~

~~Create logic to handle abilities that can only be done once certain characters join the group~~

Fix timeout issues with movement/idle (likely caused by recent refactors)

Fix console warnings when setState is called for AIs no longer rendered

Move AI to group area once they've been friended

Create characters

Create food items

Maybe have alt state for food items for buried items so the entity doesn't go away, but it shows like an empty patch where the produce was

Create inventory state/logic

Create quests to bring food items to different characters

Create game state storage

Create full map templates, using different screens

Create character art

Create background art

Create food art

Create menu/options components

Add event sound effects

Add background music

Pause game state when browser is idle (see TODOs in code)

Maybe save state to session using store.js to let players continue
