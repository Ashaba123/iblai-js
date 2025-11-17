import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import stripCode from "rollup-plugin-strip-code";
import autoprefixer from "autoprefixer";
import { fileURLToPath } from "url";
import path from "path";
import copy from "rollup-plugin-copy";
import dts from "rollup-plugin-dts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      nodeResolve({
        preserveSymlinks: true,
      }),
      json(),
      peerDepsExternal(),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      commonjs(),
      postcss({
        plugins: [autoprefixer()],
      }),
      stripCode({
        start_comment: '"use client";',
        end_comment: '"use client";',
      }),
      copy({
        targets: [{ src: "package.json", dest: "dist" }],
      }),
    ],
    external: ["zod", "react"],
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
