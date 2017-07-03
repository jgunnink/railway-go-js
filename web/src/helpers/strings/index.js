export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function userFullName(user) {
	return `${user.get("firstName")} ${user.get("lastName")}`
}
