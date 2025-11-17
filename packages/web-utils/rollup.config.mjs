import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import stripCode from "rollup-plugin-strip-code";
import copy from "rollup-plugin-copy";
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
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      nodeResolve(),
      commonjs(),
      json(),
      stripCode({
        start_comment: '"use client";',
        end_comment: '"use client";',
      }),
      copy({
        targets: [{ src: "package.json", dest: "dist" }],
      }),
    ],
    external: ["react", "axios"],
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
