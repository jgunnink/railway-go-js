export const VIEWER_SET_MODEL = "VIEWER:SET:MODEL"

export const setActiveModel = (model) => {
	return { type: VIEWER_SET_MODEL, activeModel: model }
}
