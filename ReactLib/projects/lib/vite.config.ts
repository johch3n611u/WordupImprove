import react from '@vitejs/plugin-react';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { defineConfig, UserConfigExport } from 'vite';
import dts from 'vite-plugin-dts';

const App = async (): Promise<UserConfigExport> => {

    var name: string = 'replaceme';

    const data: string = await readFile(
        path.join(__dirname, 'src', 'components', 'index.tsx'), 
        { encoding: 'utf-8' }
    );

    const s = data.split('\n');

    for (let x of s.reverse()) {
        if (x.includes('export default')) {
            name = x.replace('export default ', '').replace(" ", "");
        }
    };

    return defineConfig({
        plugins: [
            reactRefresh(),
            dts({
                insertTypesEntry: true,
            }),
        ],
        build: {
            lib: {
                entry: path.resolve(__dirname, 'src/components/index.tsx'),
                name, // 暴露的全局变量
                formats: ['es', 'umd'],
                fileName: (format) => `lib.${format}.js`,
            },
            rollupOptions: {
                external: ['react', 'react-dom', 'styled-components'],
                output: {
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM',
                        'styled-components': 'styled',
                    },
                },
            },
        },
    });
}

export default App