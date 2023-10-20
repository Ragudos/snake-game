import * as esbuild from "esbuild";

try {
    const build_result = await esbuild.build({
        entryPoints: ["src/**/*.ts", "index.html"],
        entryNames: "[name]",
        loader: {
            ".html": "copy",
            ".ico": "copy",
            ".png": "file",
            ".webp": "file",
            ".avif": "file",
            ".svg": "file",
        },
        metafile: true,
        assetNames: "[name]-[hash]",
        outdir: "build/",
        format: "esm",
        platform: "browser",
        bundle: true,
        minify: true,
        splitting: true,
        logLevel: "info",
        pure: ["console.log"],
        metafile: true,
        outExtension: {
            ".js": ".mjs",
        },
    });
} catch (err) {
    console.error(err);
}
