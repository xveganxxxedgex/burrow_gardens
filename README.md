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

~~Create logic to handle abilities that can only be done once certain characters join the group~~

~~Fix console warnings when setState is called for AIs no longer rendered~~

~~Fix timeout issues with movement/idle (likely caused by recent refactors)~~

~~Fix image aspect ratio in inventory~~

~~When Hero hits space next to another bunny, make the bunny face their direction~~

~~Fix bouncy hero/bunny collision behaviour~~

~~Create inventory state/logic~~

~~Fix faster diagonal movement~~

~~Move AI to group area once they've been friended~~

~~Remove bunny collision with other bunnies (including hero) when going to target position~~

~~Add to bunny collect popover that the bunny is going to the group area so the player understands why they may leave the screen~~

~~Add logic so hero doesn't collide with bunnies going to their target position~~

~~Add logic so if the preferred exit does not have a path, try going to the nearest exit instead.~~

~~If no exits have valid paths, need logic so when the tile changes, the bunnies tile updates to go to their target tile~~

~~Organize images directory to have subfolders and update file usages accordingly~~

~~When repopulating produce, need to ensure nothing is colliding with that position before placing it there (ensure food doesn't populate where an AI is)~~

~~Fix character image facing left for a split second when first moving down~~

~~Add tree elements that lose produce when hero stomps while colliding with them~~

~~Add logic to handle collision detection for trees or other non-block objects (how to handle collisions with visually blank areas in image/div)~~

~~Add logic for produce falling from trees~~

~~Ensure no items move to where the hero is to avoid weird collision movement issues~~

~~Enable Tab events while menu is open to switch between the menu tabs~~

~~Create food items~~

~~Create menu/options components~~

~~Add background music~~

~~Use correct images for inventory pictures for food~~

~~When bunny is at target tile, add back collision detection for hero~~

~~Fix issue when you trigger burrow action and move where it puts you at the same spot on the next tile~~

~~Add key event for escape when in menu modal~~

~~Fix bug when friending bunny, and while it's going to the target tile, you go to another tile that has a bunny and it's stuck as moving when it shouldn't be~~

~~Fix produce not repopulating on their parent item~~

~~Add event sound effects~~

~~Create food art~~

~~Improve delay when going to another tile~~

~~Improve pathfinding/tile exit logic~~

Maybe add a cute animation like a binky when a bunny is added to the group, to play before they head to the group tile

Add areas where hero has to jump

Add logic to handle jump actions (move player up and over in the direction they're facing)

Add house to map with collision detection on door area

Create tile(s) for inside the house

Create art and objects with collision for inside the house

Add unit tests

Create characters

Maybe have alt state for food items for buried items so the entity doesn't go away, but it shows like an empty patch where the produce was

Create quests to bring food items to different characters that will subtract those items from your inventory

Create game state storage

Create full map templates, using different screens

Create character art

Create background art

Pause game state when browser is idle (see TODOs in code)

Maybe save state to session using store.js to let players continue
