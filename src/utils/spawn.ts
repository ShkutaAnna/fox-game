import * as THREE from 'three';

export function getAreaCellsIndexes(params: AreaCellsParams): Cell[] {
    const { minX, maxX, minZ, maxZ, cellSize } = params;
    const width = maxX - minX;
    const depth = maxZ - minZ;

    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(depth / cellSize);

    const cells: Cell[] = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const worldX = minX + (col + 0.5) * cellSize;
            const worldZ = minZ + (row + 0.5) * cellSize;
            cells.push({
                col: col,
                row: row,
                centerX: worldX,
                centerZ: worldZ,
            });
        }
    }

    return cells;
}

export function getBlockedCells(spawnBoxes: THREE.Box3[], params: AreaCellsParams): Set<string> {
    const { minX, minZ, cellSize } = params;

    const blockedCells = new Set<string>();
    spawnBoxes.forEach((box) => {
        const minCol = Math.floor((box.min.x - minX) / cellSize);
        const maxCol = Math.floor((box.max.x - minX) / cellSize);
        const minRow = Math.floor((box.min.z - minZ) / cellSize);
        const maxRow = Math.floor((box.max.z - minZ) / cellSize);

        for (let row = minRow; row <= maxRow; row++){
            for (let col = minCol; col <= maxCol; col++) {
                blockedCells.add(cellKey(row,col));
            }
           
        }
    });

    return blockedCells;
}


export function cellKey(row: number, col: number) {
    return `${row}:${col}`;
}

export type AreaCellsParams = AreaMinMax & { cellSize: number };

export type AreaMinMax = {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
}

export type Cell = {
    row: number,
    col: number,
    centerX: number,
    centerZ: number,
};