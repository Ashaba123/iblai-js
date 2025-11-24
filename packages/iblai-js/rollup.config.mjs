import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import dts from "rollup-plugin-dts";

const commonPlugins = [
  peerDepsExternal(),
  json(),
  typescript({
    tsconfig: "./tsconfig.json",
  }),
  nodeResolve({
    preserveSymlinks: true,
  }),
  commonjs(),
];

const commonExternal = (id) =>
  [
    "react",
    "react-dom",
    "react-redux",
    "react-router-dom",
    "zod",
    "@reduxjs/toolkit",
    "@iblai/data-layer",
    "@iblai/web-utils",
    "@iblai/web-containers",
    "next",
    "next/navigation",
    "next/router",
    "next/image",
    "next/link",
  ].some((pkg) => id === pkg || id.startsWith(`${pkg}/`));

const dtsExternal = (id) =>
  [
    "@iblai/data-layer",
    "@iblai/web-utils",
    "@iblai/web-containers",
  ].some((pkg) => id === pkg || id.startsWith(`${pkg}/`));

export default [
  // Main entry point
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
    plugins: commonPlugins,
    external: commonExternal,
  },
  // Next.js-specific entry point
  {
    input: "src/next/index.ts",
    output: [
      {
        file: "dist/next/index.js",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/next/index.esm.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: commonPlugins,
    external: commonExternal,
  },
  // Type declarations for main entry
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [
      dts({
        respectExternal: true,
      }),
    ],
    external: dtsExternal,
  },
  // Type declarations for Next.js entry
  {
    input: "src/next/index.ts",
    output: [{ file: "dist/next/index.d.ts", format: "es" }],
    plugins: [
      dts({
        respectExternal: true,
      }),
    ],
    external: dtsExternal,
  },
];
