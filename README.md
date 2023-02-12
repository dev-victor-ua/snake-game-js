# Simple snake game

Just another snake game made for... just because.

## Requirements

- `node v14`

## Installation

- Run `npm install`

## How to start a game

- Run `npm run serve`
- Open URL returned in the console (usually its http://localhost:5342/).

## Maps creation

All maps are just an array of `Shape` resources (see [types.d.ts](/src/types.d.ts)) contained in a JSON file defined in [/public/maps](/public/maps/) directory. See [map01.json](/public/maps/map01.json) for example.
