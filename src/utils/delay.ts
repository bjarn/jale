const delay = (ms: number): Promise<NodeJS.Timeout> => new Promise(res => setTimeout(res, ms))

export default delay