import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../../app/page'

async function resolvedComponent(Component, props) {
    const ComponentResolved = await Component(props)
    return () => ComponentResolved
}

// Mock Menu
jest.mock('../../app/components/Menu/Menu', () => {
    return jest.fn(() => <div data-testid="menu"></div>);
  });

// Mock Menu
jest.mock('../../app/components/CuratedShows/CuratedShows', () => {
    return jest.fn(() => <div data-testid="curated-shows"></div>);
  });

// Mock fetch function
global.fetch = jest.fn();

beforeEach(() => {
  // Reset mock implementation before each test
  global.fetch.mockReset();
});
 
describe('Page', () => {
  it('renders the Menu and CuratedShows components', async () => {
    expect.assertions();

    // Mock response for /api/queries/category-list endpoint
    global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
            categories: [{ category_id: 1234, name: 'Arts'}]
        }),
    });

    // Mock response for /api/queries/shows/1234?title=arts endpoint
    global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
            'arts': [{ id: 5678, authorId: 91, title: 'trains', imageUrl: 'https://test.com/img.jpg'}]
        }),
    });

    const HomeResolved = await resolvedComponent(Home);
    render(<HomeResolved />)
 
    const menu = screen.getByTestId('menu')
    expect(menu).toBeInTheDocument()

    const curatedShows = screen.getByTestId('curated-shows')
    expect(curatedShows).toBeInTheDocument()
  })
})