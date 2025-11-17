import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import copy from "rollup-plugin-copy";

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
      resolve({
        preserveSymlinks: true,
      }),
      copy({
        targets: [{ src: "package.json", dest: "dist" }],
      }),
    ],

    external: (id) =>
      ["react", "react-dom", "react-redux", "zod", "@reduxjs/toolkit"].some(
        (pkg) => id === pkg || id.startsWith(`${pkg}/`)
      ),
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
