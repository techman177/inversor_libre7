import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

// Aquí estaba el error: Le faltaba el "/src/"
import {schemaTypes} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'Inversor Libre',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,

  basePath: '/studio',

  plugins: [
    structureTool({structure}),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})