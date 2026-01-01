# Multiplayer Implementation Details

This document provides a technical overview of how the multiplayer functionality is implemented in the Place Clone application.

## Overview

The multiplayer feature allows multiple users to view and edit a shared 10x10 grid of pixels in real-time. Since the current implementation is a simplified version, it uses **HTTP Polling** rather than WebSockets or Server-Sent Events (SSE).

## Architecture

### 1. Server-Side State Management

The shared state of the grid is maintained on the server in `app/api/grid/route.ts`.

- **In-Memory Storage**: The grid state is stored as a 2D array of strings (representing hex colors) in a variable called `gridState`.
- **Note**: Because the state is stored in memory, it will reset if the server process restarts.

```typescript
const gridState: string[][] = Array(GRID_SIZE)
  .fill(null)
  .map(() => Array(GRID_SIZE).fill(DEFAULT_COLOR));
```

### 2. API Endpoints

Two main endpoints handle the communication between the client and the server:

- **GET `/api/grid`**: Returns the current state of the entire grid.
- **POST `/api/grid`**: Accepts a row, column, and color to update a specific pixel. It returns the updated grid state upon success.

### 3. Client-Side Synchronization (The "Multiplayer" Magic)

The real-time feel is achieved through regular polling in the `Grid` component (`components/Grid.tsx`).

#### Initial Load
When the `Grid` component mounts, it performs an initial fetch to get the current state of the canvas.

#### Polling Mechanism
To keep the client in sync with changes made by other users, the component sets up a 1-second interval that repeatedly calls the `fetchGrid` function.

```typescript
useEffect(() => {
  const fetchGrid = async () => {
    const response = await fetch('/api/grid');
    const data = await response.json();
    setGrid(data.grid);
  };

  fetchGrid(); // Initial fetch

  const interval = setInterval(() => {
    fetchGrid();
  }, 1000); // Poll every 1 second

  return () => clearInterval(interval); // Cleanup on unmount
}, []);
```

#### Updating the Grid
When a user clicks a cell, the `handleCellClick` function is triggered:
1. It sends a `POST` request to the server with the update.
2. The server updates its master `gridState`.
3. The server responds with the new state, and the local client updates its state immediately.
4. Other clients will receive this update on their next 1-second poll.

## Performance Considerations

- **Traffic**: Polling every second creates a constant stream of HTTP requests. For a small number of users and a small grid (10x10), this is manageable.
- **Latency**: There is a maximum 1-second delay before a change made by one user is visible to others.
- **Scalability**: For a larger-scale application, this approach would be replaced with WebSockets (e.g., Socket.io or deep-stream) or a real-time database (e.g., Firebase, Supabase Realtime) to reduce overhead and latency.

## Future Improvements

- **WebSockets**: Transition to WebSockets for instant updates and reduced HTTP overhead.
- **Optimistic Updates**: Improve the UI responsiveness by updating the local state before the server responds.
- **Persistence**: Move the `gridState` from in-memory to a database (like Redis or PostgreSQL) to persist changes across server restarts.
- **Conflict Resolution**: Implement logic to handle cases where two users try to paint the same pixel at the exact same time.
