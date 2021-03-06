export const X_MARGIN = 100 // left-right game margin, px
export const Y_MARGIN = 150 // top-bottom game margin, px

export const ROW_NUM = 6 // Number of rows
export const COL_NUM = 6 // Number of columns

export const DOT_SIZE = 60 // px
export const CELL_SIZE = 100 // px

// Calculated game width and height
export const GAME_WIDTH = X_MARGIN * 2 + CELL_SIZE * COL_NUM
export const GAME_HEIGHT = Y_MARGIN * 2 + CELL_SIZE * ROW_NUM

export const POINTS_PER_DOT = 1
export const DOT_TWEENS = {
   FALL: 'FALL',
   SELECT: 'SELECT',
   UNSELECT: 'UNSELECT',
   ANIMATION: 'ANIMATION'
}

// Set of dots` colors:   жовтий,  блакитний, зелений,  червоний, фіолетовий.
export const COLOR_SET = [0xE6D813, 0x8EBBFC, 0x8BE897, 0xEE5C43, 0x985EB5]
// export const COLOR_SET = [0xffff00, 0x0000ff, 0x00ff00/*, 0xff0000, 0xcc0099*/]

export const BG_COLOR = '#ffffe5'
