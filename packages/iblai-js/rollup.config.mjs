import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      json(),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      nodeResolve({
        preserveSymlinks: true,
      }),
      commonjs(),
    ],
    external: (id) =>
      [
        "react",
        "react-dom",
        "react-redux",
        "zod",
        "@reduxjs/toolkit",
        "@iblai/data-layer",
        "@iblai/web-utils",
        "@iblai/web-containers",
      ].some((pkg) => id === pkg || id.startsWith(`${pkg}/`)),
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [
      dts({
        respectExternal: true,
      }),
    ],
    external: (id) =>
      [
        "@iblai/data-layer",
        "@iblai/web-utils",
        "@iblai/web-containers",
      ].some((pkg) => id === pkg || id.startsWith(`${pkg}/`)),
  },
];
