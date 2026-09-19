import React from "react";

import EntityDashboard from "./components/EntityDashboard";

/**
 * The top-level component
 * Displays a confirmation that the service is ready,
 * along with the configured port from environment variables.
 *
 * @returns The rendered component.
 */
function App() {
	return (
		<div className="min-h-screen w-full overflow-x-hidden text-white">
			<EntityDashboard />
		</div>
	);
}

export default App;
