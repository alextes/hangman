# hangman
3dhubs technical challenge

### use
* `npm run server` to start the server. default address is `http://localhost:8888`
* `GET /newGame` to start a game
* `POST /makeGuess` to make a guess
* a guess request should include a json body like:
```
{
  "id": 123,
  "character": "a"
}
```
* `npm run lint` to check for linting errors
* `npm run dev` to start the client dev server
* `npm run build` to build

### requirements
* chooses a random word out of 6 words: (3dhubs, marvin, print, filament, order, layer)
* prints the spaces for the letters of the word (eg: ​_ _ _​ _ _ for order)
* the user can try to ask for a letter and that should be shown on the puzzle (eg: asks for "r" and now it shows ​_ r _​ _ r for order)
* the user can only ask 5 letters that don't exist in the word and then it's game over
* if the user wins, congratulate him!
