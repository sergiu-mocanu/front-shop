import type { Preview } from '@storybook/react-vite'
// The app's global styles, so components look as they do in the shop.
import '@/index.css'
import '@/App.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
