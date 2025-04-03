# Froggy Fisticuffs

Github: https://github.com/Benjaminnnnnnnn/SoftwareDesign

Stage-based asynchronous autobattler:

    Spend 10 currency each stage to improve your army.
    Get matched up against a board of approximatly equal strength from our database.
    Repeat until 5 wins or 3 losses.

## Set-up Instructions

Our application is comprised of two services, one being a React (Typescript) web-app and the other being a Fast-API server (Python).
Information to run each is given in the READMEs in ./frontend and ./backend.

**Assets are removed as instructed but they can all be viewed in ./frontend/public on Github**

## Design Info

### Macroscopic 

The structure of the React frontend is comprised as such:

    page.tsx <-- contains state pattern logic (will be elaborated on later)
    |
    \
     App.tsx 
     |
     |\
     |  Shop.tsx <-- Component containing the shop logic
     |
      \
        HexGrid.tsx <-- Component containing the rendered window and rendering logic


The backend's functionality is largly convered on the github wiki page:

https://github.com/Benjaminnnnnnnn/SoftwareDesign/wiki

### Important Files and Systems

This section will serve as a guide to the most essential parts of the project, as well as highlights where certain design patterns were utilized and implemented.

1. frontend/src/app/game

    1.a Game Objects ([Wiki: Creating New Pieces])

        Piece ABC frontend/src/app/game/pieces/piece.ts & Item ABC frontend/src/app/game/items/item.ts
   
        Game Objects consist of two types: units and items
  
        Both can be instantiated via our Object Factory class (./frontend/src/app/game/factory/ObjFactory.ts)

        All concrete Game Objects inherit from an abstract base class, it is easy to add new units and items

   1.b Board System ([Wiki: Board Design])

        Board class ./frontend/src/app/game/board/board.ts
   
        The board is represented as an unweighted graph where each vertex can have up to 6 edges

        Each nvertex is a Hex which is an object containing positional informationa nd wether or not it is occupied
   
        This facilitates BFS search which is important for target and path finding in combat
   
        The board class adheres to the SRP (Single Responsibility Principle) as it only handles itself and things it contains, without handling its own rendering

   1.c Battle System

       BattleHandler class ./frontend/src/app/game/battle/BattleHandler.ts

       Handles the game loop, once combat starts each unit decides wether or not it must move or attack, using the command pattern (./frontend/src/app/game/battle/Command.ts)

       Actions are stored in a command stack and popped off one-by-one to be executed

       Cycle repeats until ending condititons are met.

   1.d Codification

       Codification logic ./frontend/src/app/game/codification.ts
   
       In order to store past boards in the database, they are encoded as a string with all relevant info

       Inversely, when we load a board the string is fetched and decoded into a set of objects to be placed

       This decoded info is passed to the aformentioned factory to be created cleanly
   
2. frontend/src/app/render

    2.a Shop Display

        Shop Components and DOM frontend/src/app/render/Shop.tsx
   
        Shop is responsible for displaying and handling the shop's logic
  
        Added to the app in (./frontend/src/app/requests/App.tsx)

        Updates information in the context after a purchase (unit purchased, currency)

   2.b Board Tiles / "Extras" Rendering

        The main rendering files can be found at frontend/src/app/render/BattleHexagon.tsx, Hexagon.tsx, renderTrash.tsx, cursorIndicator.ts
   
        These files are responsible for rendering only (upon being called)
  
        Called in (./frontend/src/app/render/handlerender.tsx)

        Render interactable/non-interactable boards, trash bin (for selling), cursor indicator (to indicate user is holding a piece)

   2.c Game Logic / Piece Rendering

        The top level rendering file is frontend/src/app/render/BoardRender.tsx
   
        Handles conditional rendering based on game state, defined the HexGrid component
  
        Called in (./frontend/src/app/requests/App.tsx)

        Call other rendering modules as needed and share state information with them

3. Misc.

  3.a ./frontend/src/app/context

      Contains code related to the Redux javascript library which allows for easy implementation of the state pattern

      Provides a "store" for inforamtion which can be accessed and modified by any child componet

      For example, page.tsx can provide information to all it's children since they are wrapped in the <Provider></Provider> element

      Allows for information to be communicated system wide which is unbelivably useful

      i.e Shop.tsx can communicate some simple info to HexGrid.tsx despite not being directly associated

  3.b ./frontend/src/app/requests

      Simple axios requests to the backend to upload and fetch boards

  3.c ./backend/app

      Contains the Fast-API app with all needed backends as well as some for future implementation
  
