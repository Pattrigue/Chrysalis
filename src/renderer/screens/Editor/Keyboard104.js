// -*- mode: js-jsx -*-
/* Chrysalis -- Kaleidoscope Command Center
 * Copyright (C) 2019-2022  Keyboardio, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import KeymapDB from "@api/focus/keymap/db";
import Box from "@mui/material/Box";
import useTheme from "@mui/material/styles/useTheme";
import React from "react";

const db = new KeymapDB();

const keycapunit = 56;

const KeySelector = (props) => {
  const keymap = db.getStandardLayout();
  const theme = useTheme();
  const { currentKeyCode, onKeySelect } = props;
  const keySpacingX = keycapunit;
  const keySpacingY = keycapunit;
  const keyOffsetX = [
    [0, 1, 0, 0, 0, 0.5, 0, 0, 0, 0.5],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0.5],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0.5, 0, 0, 0, 0.5],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0.5],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.5, 1.5, 0, 0, 0, 0.5],
    [0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0.5],
  ];
  const keySizeX = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
    [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.25],
    [1.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.75],
    [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25, 1, 1, 1, 2],
  ];
  const keySizeY = [[], [], [], [], []];
  keySizeY[2][20] = 2;
  keySizeY[4][17] = 2;

  const getKeySizeX = (row, col) => {
    if (keySizeX[row]?.[col]) {
      return keySizeX[row][col];
    } else {
      return 1;
    }
  };

  const getKeySizeY = (row, col) => {
    if (keySizeY[row]?.[col]) {
      return keySizeY[row][col];
    } else {
      return 1;
    }
  };

  const getKey = (row, col) => {
    if (keymap[row]) {
      return db.lookup(keymap[row][col]);
    } else {
      return {
        label: {},
      };
    }
  };

  const getX = (row, col) => {
    let offset = 0;

    for (let i = 0; i < col; i++) {
      offset += getKeySizeX(row, i) * keySpacingX;

      if (keyOffsetX[row]?.[i]) {
        offset += keyOffsetX[row][i] * keySpacingX;
      }
    }

    if (keyOffsetX[row]?.[col]) {
      offset += keyOffsetX[row][col] * keySpacingX;
    }

    return offset;
  };

  const getY = (row) => {
    let y = row * keySpacingY;
    if (row > 0) y += keySpacingY * 0.5;
    return y;
  };

  const getKeyWidth = (row, col) => {
    const size = getKeySizeX(row, col);
    return keycapunit * size;
  };

  const getKeyHeight = (row, col) => {
    return keycapunit * getKeySizeY(row, col);
  };

  const getKeycapSize = (row, col) => {
    return getKeySizeX(row, col).toString() + "u";
  };

  const Key = (props) => {
    const { row, col } = props;
    const x = getX(row, col),
      y = getY(row, col),
      key = getKey(row, col),
      active = key.code == currentKeyCode;
    const stroke = theme.palette.divider;
    const height = getKeyHeight(row, col);
    const width = getKeyWidth(row, col);
    const bottom = y + height - 8;
    const buttonColor = active
      ? theme.palette.primary.light
      : theme.palette.background.paper;

    const textColor = theme.palette.getContrastText(buttonColor);

    const onClick = (event) => {
      console.log(event.currentTarget);
      return onKeySelect(event.currentTarget.getAttribute("data-key-code"));
    };

    const label = db.format(key, { keycapSize: getKeycapSize(row, col) });
    let fontSize =
      label.main.length == 1
        ? Math.round(keycapunit / 2.5)
        : Math.round(keycapunit / 4);
    let mainLegendY = y + height / 2;

    if (label.shifted) {
      fontSize -= 3;
      mainLegendY += fontSize / 2 + 2;
    }

    return (
      <g onClick={onClick} className="key" data-key-code={key.code} sx={{}}>
        <rect
          x={x}
          y={y}
          rx={2}
          width={width}
          height={height}
          stroke={stroke}
          strokeWidth={1.55}
          fill={buttonColor}
        />
        {label.shifted && (
          <text
            x={x + width / 2}
            y={mainLegendY - (fontSize + 2)}
            fill={textColor}
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize={fontSize}
          >
            {label.shifted}
          </text>
        )}
        <text
          x={x + width / 2}
          y={mainLegendY}
          fill={textColor}
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize={fontSize}
        >
          {label.main}
        </text>
      </g>
    );
  };

  const viewBoxSize =
    "0 0 " +
    Math.round(23 * keycapunit).toString() +
    " " +
    Math.round(6.5 * keycapunit).toString();
  return (
    <Box
      sx={{
        margin: 0,
      }}
    >
      <svg
        viewBox={viewBoxSize}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMin meet"
        width="100%"
        height="100%"
        className={props.className}
        sx={{
          fontFamily: '"Source Code Pro", "monospace"',
          fontWeight: 700,
          fontSize: Math.round(keycapunit / 4),
        }}
      >
        <g transform="">
          <g>
            <Key row={0} col={0} />

            <Key row={0} col={1} />
            <Key row={0} col={2} />
            <Key row={0} col={3} />
            <Key row={0} col={4} />

            <Key row={0} col={5} />
            <Key row={0} col={6} />
            <Key row={0} col={7} />
            <Key row={0} col={8} />

            <Key row={0} col={9} />
            <Key row={0} col={10} />
            <Key row={0} col={11} />
            <Key row={0} col={12} />
          </g>

          <g>
            <Key row={1} col={0} />
            <Key row={1} col={1} />
            <Key row={1} col={2} />
            <Key row={1} col={3} />
            <Key row={1} col={4} />
            <Key row={1} col={5} />
            <Key row={1} col={6} />
            <Key row={1} col={7} />
            <Key row={1} col={8} />
            <Key row={1} col={9} />
            <Key row={1} col={10} />
            <Key row={1} col={11} />
            <Key row={1} col={12} />
            <Key row={1} col={13} />

            <Key row={1} col={14} />
            <Key row={1} col={15} />
            <Key row={1} col={16} />

            <Key row={1} col={17} />
            <Key row={1} col={18} />
            <Key row={1} col={19} />
            <Key row={1} col={20} />
          </g>

          <g>
            <Key row={2} col={0} />
            <Key row={2} col={1} />
            <Key row={2} col={2} />
            <Key row={2} col={3} />
            <Key row={2} col={4} />
            <Key row={2} col={5} />
            <Key row={2} col={6} />
            <Key row={2} col={7} />
            <Key row={2} col={8} />
            <Key row={2} col={9} />
            <Key row={2} col={10} />
            <Key row={2} col={11} />
            <Key row={2} col={12} />
            <Key row={2} col={13} />

            <Key row={2} col={14} />
            <Key row={2} col={15} />
            <Key row={2} col={16} />

            <Key row={2} col={17} />
            <Key row={2} col={18} />
            <Key row={2} col={19} />
            <Key row={2} col={20} />
          </g>

          <g>
            <Key row={3} col={0} />
            <Key row={3} col={1} />
            <Key row={3} col={2} />
            <Key row={3} col={3} />
            <Key row={3} col={4} />
            <Key row={3} col={5} />
            <Key row={3} col={6} />
            <Key row={3} col={7} />
            <Key row={3} col={8} />
            <Key row={3} col={9} />
            <Key row={3} col={10} />
            <Key row={3} col={11} />
            <Key row={3} col={12} />
            <Key row={3} col={13} />

            <Key row={3} col={14} />
            <Key row={3} col={15} />
            <Key row={3} col={16} />

            <Key row={3} col={17} />
            <Key row={3} col={18} />
            <Key row={3} col={19} />
          </g>

          <g>
            <Key row={4} col={0} />
            <Key row={4} col={1} />
            <Key row={4} col={2} />
            <Key row={4} col={3} />
            <Key row={4} col={4} />
            <Key row={4} col={5} />
            <Key row={4} col={6} />
            <Key row={4} col={7} />
            <Key row={4} col={8} />
            <Key row={4} col={9} />
            <Key row={4} col={10} />
            <Key row={4} col={11} />
            <Key row={4} col={12} />

            <Key row={4} col={13} />

            <Key row={4} col={14} />
            <Key row={4} col={15} />
            <Key row={4} col={16} />
            <Key row={4} col={17} />
          </g>

          <g>
            <Key row={5} col={0} />
            <Key row={5} col={1} />
            <Key row={5} col={2} />

            <Key row={5} col={3} />

            <Key row={5} col={4} />
            <Key row={5} col={5} />
            <Key row={5} col={6} />
            <Key row={5} col={7} />

            <Key row={5} col={8} />
            <Key row={5} col={9} />
            <Key row={5} col={10} />

            <Key row={5} col={11} />
            <Key row={5} col={12} />
          </g>
        </g>
      </svg>
    </Box>
  );
};
export default KeySelector;
