import { build as _build, addFile } from 'esbuild';

async function build() {
    const fileName = 'anonymous.js';
    const fileContent = 'console.log("Hello, World!");';

    const result = await _build({
        entryPoints: [fileName],
        outfile: 'bundle.js',
        sourcemap: true,
        target: 'es6',
        write: false,
    });

    addFile(fileName, fileContent);

    if (result.error) {
        console.error(result.error);
    } else {
        console.log(result.output);
    }
}

build();
