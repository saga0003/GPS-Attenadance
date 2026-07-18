import { brotliDecompressSync } from "node:zlib";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
const packed=Array.from({length:6},(_,i)=>readFileSync(`chunks/chunk-${i}.txt`,"utf8")).join("");
const payload=JSON.parse(brotliDecompressSync(Buffer.from(packed,"base64")).toString());
for(const [file,content] of Object.entries(payload)){mkdirSync(dirname(file),{recursive:true});writeFileSync(file,content)}
console.log(`Prepared ${Object.keys(payload).length} source files.`);
