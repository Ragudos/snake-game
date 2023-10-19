import * as esbuild from "esbuild";

try {
    const ctx = await esbuild.context({
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
        assetNames: "[name]-[hash]",
        outdir: "dev/",
        format: "esm",
        platform: "browser",
        bundle: true,
        minifyWhitespace: true,
        splitting: true,
        logLevel: "info",
        pure: ["console.log"],
        metafile: true,
        banner: {
            js: "(() => { (new EventSource(\"/esbuild\")).addEventListener('change', () => location.reload()); })();",
        },
        outExtension: {
            ".js": ".mjs",
        },
    });

    const url = await ctx.serve({
        servedir: "dev",
        port: 3000,
    });

    console.log(`Server is running on ${url.host}:${url.port}`);

    await ctx.watch();
} catch (err) {
    console.error(err);
}
