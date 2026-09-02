////Local
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// import legacy from '@vitejs/plugin-legacy';

// export default defineConfig({
//   plugins: [react(), 
//     tailwindcss(),
//     legacy({
//       targets: ['defaults', 'not IE 11']
//     })],
//   server: {
//     allowedHosts: [
//       'spotty-dogs-worry.loca.lt',
//     ],
//     host: true,
//   }
// })


//Test Server
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
  ],

  server: {
    host: true,
    port: 5182,

    allowedHosts: [
      'spotty-dogs-worry.localt'
    ],
  },
})
