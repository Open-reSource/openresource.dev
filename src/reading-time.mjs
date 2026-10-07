/** A reading time in minutes as the guide prints it: `43 min`, `4 h 19 min`. */
export const formatMinutes = (minutes) =>
	minutes >= 60 ? `${Math.floor(minutes / 60)} h ${Math.ceil(minutes % 60)} min` : `${minutes} min`;
