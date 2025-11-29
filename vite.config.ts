import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
   plugins: [
      react({
         babel: {
            plugins: [['babel-plugin-react-compiler']],
         },
      }),
      svgr({
         svgrOptions: {
            titleProp: true,
            ref: true,
         },
         include: '**/*.svg',
      }),
   ],
   resolve: {
      alias: {
         app: path.resolve(__dirname, 'src/app'),
         shared: path.resolve(__dirname, 'src/shared'),
         entities: path.resolve(__dirname, 'src/entities'),
         features: path.resolve(__dirname, 'src/features'),
         widgets: path.resolve(__dirname, 'src/widgets'),
         pages: path.resolve(__dirname, 'src/pages'),
         server: path.resolve(__dirname, './server'),
      },
   },
})