# Circuit-Solver

# Commands
- `npm start` and open http://localhost:3000 to view project in the browser.
- `jest` to run tests

# Credits
- This project uses a modified version of [Maxwell](http://web.psung.name/maxwell/) by Phil Sung to model circuits and calculate voltages.

# Issues/Improvements
- **Unnecessary calculations**: When an element is rotated, the board recalculates its entire power distribution from scratch, potentially doing some unnecessary work, particularly when elements that are completely isolated from the circuit are rotated.
- **Voltmeters vs. Ammeters**: Under the hood, the gauges are voltmeters, but the way the puzzle is designed, they should actually be ammeters. Unfortunately, [Maxwell](http://web.psung.name/maxwell/), used as the basis for circuit modeling in this project, does not implement ammeters, so some mathematical approximations were used to mimic the behavior of ammeters. Ideally no approximations would be needed.
  - A proper voltmeter should have infinite resistance and be connected to the circuit in parallel; an ammeter should have zero resistance and be connected in series. The latter is closer to the role they play in the puzzle.
