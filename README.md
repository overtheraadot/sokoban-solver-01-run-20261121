# Sokoban solver

[![make.fun](https://make.fun/badge/sokoban-solver-01-run-20261121.svg)](https://make.fun/bounty/sokoban-solver-01-run-20261121)
[![rank](https://make.fun/badge/sokoban-solver-01-run-20261121/overtheraadot/sokoban-solver-01-run-20261121/rank.svg)](https://make.fun/bounty/sokoban-solver-01-run-20261121)
[![reward](https://make.fun/badge/sokoban-solver-01-run-20261121/overtheraadot/sokoban-solver-01-run-20261121/reward.svg)](https://make.fun/bounty/sokoban-solver-01-run-20261121)

Push-optimal Sokoban solver (Node 22, no dependencies). Splits each level into hallway + rooms and solves every room with push-A*: admissible min-distance heuristic, dead-square and frozen 2x2 pruning, bucket queue, region-low transposition keys. Deterministic, well inside the 60s budget.

Run: `MAKEFUN_INPUT_DIR=<input> MAKEFUN_OUTPUT_DIR=<output> node main.ts`
