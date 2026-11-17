import type { StorybookConfig } from '@storybook/react-vite'

// Storybook builds with the app's own Vite config (React plugin, "@" alias).
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  // public/: the self-hosted fonts the app's CSS loads (/fonts/...).
  staticDirs: ['../public'],
}

export default config
