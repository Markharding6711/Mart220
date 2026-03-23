Project Reflection

For this project, I made a 2D platform-style game inspired by Doodle Jump. The player moves left and right with the arrow keys and automatically jumps on platforms while moving upward. The goal is to collect 10 fruits while avoiding enemies and bad items like apples that reduce your health. I also added a health system, a fruit counter, and a height tracker that increases as you climb, which also affects the difficulty by spawning more enemies.

I built this project off work I had already done in earlier assignments, especially the player animation system. I originally created my own animations using image sequences, so I kept building on that instead of starting over. From there, I added platforms, fruit collection, enemies, and UI elements step by step. One of the harder parts was getting the collisions and movement to feel smooth and not glitchy, especially when adding enemies and knockback.

I used generative AI throughout the project whenever I got stuck. It helped me debug issues, figure out how to structure certain parts of my code, and add new features like the fruit counter and win condition. I also used it to help integrate the p5.play library. I didn’t just copy things directly though—I tested everything and adjusted it so it actually worked with my game.

I did technically use p5.play in my project by including the library and creating a sprite. However, since I had already built my own animation system in earlier weeks, trying to fully switch everything over to p5.play ended up breaking my game multiple times. Because of that, I decided to keep my original animation system and just integrate p5.play in a smaller way so I could still meet the requirement without messing up what I already had working.

I didn’t copy code from other students, but I did use examples from class and lectures to help structure things like my Platform and Food classes. Those examples helped guide my approach, but all of the actual game logic and features were implemented by me.

Overall, this project helped me get more comfortable managing a bigger codebase and working through bugs. It also showed me how small changes can sometimes break everything, and how important it is to test things step by step.
