import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const workerPath = path.resolve("dist/server/index.js");
const workerUrl = pathToFileURL(workerPath);
workerUrl.searchParams.set("netlify", Date.now().toString());

const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request("https://karina-y-pablo.netlify.app/", {
    headers: { accept: "text/html" },
  }),
  {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  },
  {
    waitUntil() {},
    passThroughOnException() {},
  },
);

if (!response.ok) {
  throw new Error(`No se pudo generar la portada estática: ${response.status}`);
}

await writeFile(path.resolve("dist/client/index.html"), await response.text(), "utf8");
console.log("Versión estática de Netlify generada en dist/client");
