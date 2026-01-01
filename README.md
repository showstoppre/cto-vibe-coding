# Place Clone - 10x10 Grid Multiplayer

A collaborative pixel art canvas inspired by r/place, built with Next.js 16, React 19, and Tailwind CSS 4.

## Features

- **10x10 Grid Canvas**: A collaborative pixel grid where multiple users can place colored pixels
- **Real-time Multiplayer**: Changes are synced across all connected clients every second
- **Color Palette**: Choose from 10 different colors to paint your pixels
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Automatically adapts to your system's color scheme

## How to Play

1. Select a color from the color palette
2. Click on any cell in the 10x10 grid to paint it with your selected color
3. Watch as other players add their own pixels in real-time
4. Create collaborative art with players from around the world!

## Getting Started

### Prerequisites

- Node.js 20+ installed
- npm or your preferred package manager

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the canvas.

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Technical Details

For a deep dive into how the multiplayer synchronization works, see [MULTIPLAYER.md](./MULTIPLAYER.md).

### Architecture

- **Frontend**: React 19 with Next.js 16 App Router
- **Styling**: Tailwind CSS 4 with dark mode support
- **State Management**: Client-side React state with server synchronization
- **API**: Next.js API routes for grid state management
- **Real-time Updates**: Polling mechanism (1-second intervals) for multi-player synchronization

### Project Structure

```
├── app/
│   ├── api/
│   │   └── grid/
│   │       └── route.ts       # API endpoint for grid state
│   ├── globals.css            # Global styles and Tailwind config
│   ├── layout.tsx             # Root layout component
│   └── page.tsx               # Main page component
├── components/
│   └── Grid.tsx               # Grid component with game logic
└── public/                    # Static assets
```

### API Endpoints

#### GET /api/grid
Returns the current state of the 10x10 grid.

**Response:**
```json
{
  "grid": [
    ["#ffffff", "#ff0000", ...],
    ...
  ]
}
```

#### POST /api/grid
Updates a single cell in the grid.

**Request Body:**
```json
{
  "row": 0,
  "col": 0,
  "color": "#ff0000"
}
```

**Response:**
```json
{
  "success": true,
  "grid": [...]
}
```

## Customization

### Grid Size
To change the grid size, update the `GRID_SIZE` constant in:
- `app/api/grid/route.ts`
- `components/Grid.tsx`

### Colors
To add or modify colors, update the `COLORS` array in `components/Grid.tsx`:

```typescript
const COLORS = [
  '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
];
```

### Polling Interval
To adjust the real-time update frequency, modify the interval in `components/Grid.tsx`:

```typescript
const interval = setInterval(() => {
  fetchGrid();
}, 1000); // Change 1000 to your desired interval in milliseconds
```

## Future Enhancements

- WebSocket support for true real-time updates
- User identification and rate limiting
- Persistent storage (database)
- Canvas history and undo functionality
- Larger grid sizes
- More color options
- Drawing tools (fill, line, etc.)

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

MIT
