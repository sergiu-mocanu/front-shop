import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from './ProductCard'
import { makeProduct } from '@/test/factories'

// The product card in isolation, in the states worth looking at. The card holds <Link>s, so each
// story renders inside a router; the width matches one column of the catalogue grid.
const meta = {
  title: 'Catalogue/ProductCard',
  component: ProductCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ width: 340 }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  args: {
    index: 0,
    product: makeProduct({
      slug: 'lampe-aria',
      name: 'Lampe Aria',
      category: 'Lumière',
      description: 'Une lumière douce, un pied sculptural en céramique.',
      image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85',
      price: 129,
      badge: 'Coup de cœur',
    }),
  },
} satisfies Meta<typeof ProductCard>

export default meta
type Story = StoryObj<typeof meta>

// The card as the catalogue shows it.
export const Standard: Story = {}

// A very long name: does the title row wrap without pushing the price out of the card?
export const LongName: Story = {
  args: {
    product: {
      ...meta.args.product,
      name: 'Lampe Aria à poser, grand modèle, céramique émaillée faite main et abat-jour en lin lavé',
    },
  },
}
